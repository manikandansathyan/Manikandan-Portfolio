import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Environment, ContactShadows, RoundedBox } from "@react-three/drei";
import { useEffect, useRef, useState } from "react";

import MikoBubble from "./MikoBubble";
import MikoMenu from "./MikoMenu";

/* NOTE: MikoBehaviour is no longer used here. Walking / wandering /
   greeting are handled inside this file so they can't fight each other. */

const MIKO_WIDTH = 105;
const MIKO_HEIGHT = 125;
const WALK_SPEED = 65; // px per second

const clampPos = (x, y) => ({
    x: Math.max(15, Math.min(x, window.innerWidth - MIKO_WIDTH - 15)),
    y: Math.max(15, Math.min(y, window.innerHeight - MIKO_HEIGHT - 15)),
});

const IDLE_LINES = [
    "Need a hand? Tap me! 👆",
    "I'm right here with you ✨",
    "Psst... tap me for a quick guide",
    "Lovely page, right? 😄",
    "Want me to show you around?",
];

/* ==========================================
   3D MODEL
========================================== */

function MikoModel({ state, dragging, facing }) {
    const groupRef = useRef(null);
    const leftEyeRef = useRef(null);
    const rightEyeRef = useRef(null);
    const smileRef = useRef(null);
    const leftArmRef = useRef(null);
    const rightArmRef = useRef(null);
    const leftLegRef = useRef(null);
    const rightLegRef = useRef(null);

    const blinkAt = useRef(2);
    const blinkStart = useRef(-1);
    const eyeOpen = useRef(1);

    useFrame(({ clock }, delta) => {
        const g = groupRef.current;
        if (!g) return;

        const t = clock.getElapsedTime();
        const f = 1 - Math.exp(-12 * delta);
        const ease = (obj, key, target) => {
            obj[key] += (target - obj[key]) * f;
        };

        /* ---------- pose targets ---------- */
        const T = {
            y: 0, rz: 0, ry: 0,
            laz: -0.25, raz: 0.25, // arm out-angle (z)
            lax: 0, rax: 0,        // arm swing (x)
            llx: 0, rlx: 0,        // leg swing (x)
            smile: 1, eye: 1,
        };

        const isDragged = dragging || state === "dragged";

        if (isDragged) {
            T.rz = -0.08;
            T.y = 0.03;
            T.laz = -0.9 + Math.sin(t * 12) * 0.15;
            T.raz = 0.9 - Math.sin(t * 12) * 0.15;
            T.llx = Math.sin(t * 6) * 0.25;
            T.rlx = -Math.sin(t * 6) * 0.25;
            T.smile = 0.9;
        } else if (state === "walking") {
            const p = t * 9;
            T.y = Math.abs(Math.sin(p)) * 0.045;
            T.rz = Math.sin(p) * 0.035;
            T.ry = facing * 0.85; // turn to face walking direction
            T.llx = Math.sin(p) * 0.65;
            T.rlx = -Math.sin(p) * 0.65;
            T.lax = -Math.sin(p) * 0.55;
            T.rax = Math.sin(p) * 0.55;
            T.smile = 1.1;
        } else if (state === "greeting") {
            T.y = Math.abs(Math.sin(t * 3)) * 0.03;
            T.rz = Math.sin(t * 2) * 0.02;
            T.raz = 2.5 + Math.sin(t * 11) * 0.4; // right arm up, waving
            T.smile = 1.3;
        } else if (state === "happy") {
            T.y = Math.abs(Math.sin(t * 7)) * 0.07;
            T.rz = Math.sin(t * 8) * 0.04;
            T.ry = Math.sin(t * 6) * 0.05;
            T.laz = -2.3 + Math.sin(t * 9) * 0.2; // cheering arms
            T.raz = 2.3 - Math.sin(t * 9) * 0.2;
            T.smile = 1.35;
        } else if (state === "curious") {
            T.ry = Math.sin(t * 5) * 0.14;
            T.rz = Math.sin(t * 4) * 0.035;
            T.smile = 1.1;
        } else if (state === "sleeping") {
            T.rz = -0.1;
            T.y = -0.02;
            T.eye = 0.05;
            T.smile = 0.6;
        } else if (state === "sitting") {
            T.y = -0.3;
            T.rz = Math.sin(t * 1.2) * 0.015;
            T.llx = -1.3; // legs stretched out front
            T.rlx = -1.3;
            T.laz = -0.35;
            T.raz = 0.35;
            T.lax = Math.sin(t * 1.5) * 0.05;
            T.rax = -Math.sin(t * 1.5) * 0.05;
            T.smile = 1.1;
        } else {
            // idle
            T.y = Math.sin(t * 2.2) * 0.025;
            T.rz = Math.sin(t * 1.3) * 0.018;
            T.lax = Math.sin(t * 1.5) * 0.06;
            T.rax = -Math.sin(t * 1.5) * 0.06;
        }

        /* ---------- apply ---------- */
        ease(g.position, "y", T.y);
        ease(g.rotation, "z", T.rz);
        ease(g.rotation, "y", T.ry);

        if (leftArmRef.current) {
            ease(leftArmRef.current.rotation, "z", T.laz);
            ease(leftArmRef.current.rotation, "x", T.lax);
        }
        if (rightArmRef.current) {
            ease(rightArmRef.current.rotation, "z", T.raz);
            ease(rightArmRef.current.rotation, "x", T.rax);
        }
        if (leftLegRef.current) ease(leftLegRef.current.rotation, "x", T.llx);
        if (rightLegRef.current) ease(rightLegRef.current.rotation, "x", T.rlx);

        /* ---------- blinking ---------- */
        if (t > blinkAt.current) {
            blinkStart.current = t;
            blinkAt.current = t + 2.5 + Math.random() * 3.5;
        }
        const bd = t - blinkStart.current;
        const blink =
            bd >= 0 && bd < 0.16
                ? 1 - Math.sin((bd / 0.16) * Math.PI) * 0.95
                : 1;

        eyeOpen.current += (T.eye - eyeOpen.current) * f;
        const eyeScaleY = Math.max(0.06, Math.min(blink, eyeOpen.current));

        /* ---------- eye glow + smile ---------- */
        const eyeGlow = 1.3 + Math.sin(t * 3) * 0.25;

        if (leftEyeRef.current) {
            leftEyeRef.current.material.emissiveIntensity = eyeGlow;
            leftEyeRef.current.scale.y = eyeScaleY;
        }
        if (rightEyeRef.current) {
            rightEyeRef.current.material.emissiveIntensity = eyeGlow;
            rightEyeRef.current.scale.y = eyeScaleY;
        }
        if (smileRef.current) {
            smileRef.current.material.emissiveIntensity =
                1.1 + Math.sin(t * 4) * 0.2;
            ease(smileRef.current.scale, "x", 1.25 * T.smile);
            ease(smileRef.current.scale, "y", 0.9 * T.smile);
        }
    });

    return (
        <group ref={groupRef}>
            {/* HEAD */}
            <mesh position={[0, 0.65, 0]}>
                <sphereGeometry args={[0.48, 32, 28]} />
                <meshStandardMaterial color="#fafaff" metalness={0.25} roughness={0.18} />
            </mesh>

            {/* FACE */}
            <mesh position={[0, 0.62, 0.435]} scale={[0.82, 0.67, 0.08]}>
                <sphereGeometry args={[0.45, 32, 24]} />
                <meshStandardMaterial color="#18132a" metalness={0.15} roughness={0.15} />
            </mesh>

            {/* EYES */}
            <mesh ref={leftEyeRef} position={[-0.19, 0.71, 0.485]}>
                <sphereGeometry args={[0.07, 24, 24]} />
                <meshStandardMaterial color="#c4b5fd" emissive="#a855f7" emissiveIntensity={1.3} roughness={0.1} />
                {/* sparkle highlight */}
                <mesh position={[0.025, 0.028, 0.055]}>
                    <sphereGeometry args={[0.022, 12, 12]} />
                    <meshBasicMaterial color="#ffffff" />
                </mesh>
            </mesh>

            <mesh ref={rightEyeRef} position={[0.19, 0.71, 0.485]}>
                <sphereGeometry args={[0.07, 24, 24]} />
                <meshStandardMaterial color="#bae6fd" emissive="#38bdf8" emissiveIntensity={1.3} roughness={0.1} />
                {/* sparkle highlight */}
                <mesh position={[0.025, 0.028, 0.055]}>
                    <sphereGeometry args={[0.022, 12, 12]} />
                    <meshBasicMaterial color="#ffffff" />
                </mesh>
            </mesh>

            {/* HAPPY SMILE (arc flipped to curve upward ∪) */}
            <mesh
                ref={smileRef}
                position={[0, 0.575, 0.495]}
                rotation={[0, 0, Math.PI]}
                scale={[1.25, 0.9, 1]}
            >
                <torusGeometry args={[0.085, 0.02, 12, 32, Math.PI]} />
                <meshStandardMaterial color="#e9d5ff" emissive="#a855f7" emissiveIntensity={1.1} />
            </mesh>

            {/* CHEEKS */}
            <mesh position={[-0.27, 0.58, 0.46]} scale={[1.3, 0.8, 0.6]}>
                <sphereGeometry args={[0.04, 16, 16]} />
                <meshStandardMaterial color="#f0abfc" emissive="#d946ef" emissiveIntensity={0.9} transparent opacity={0.55} />
            </mesh>
            <mesh position={[0.27, 0.58, 0.46]} scale={[1.3, 0.8, 0.6]}>
                <sphereGeometry args={[0.04, 16, 16]} />
                <meshStandardMaterial color="#f0abfc" emissive="#d946ef" emissiveIntensity={0.9} transparent opacity={0.55} />
            </mesh>

            {/* ANTENNA */}
            <mesh position={[0, 1.1, 0]}>
                <cylinderGeometry args={[0.018, 0.018, 0.16, 12]} />
                <meshStandardMaterial color="#8b5cf6" emissive="#8b5cf6" emissiveIntensity={1} />
            </mesh>
            <mesh position={[0, 1.21, 0]}>
                <sphereGeometry args={[0.055, 20, 20]} />
                <meshStandardMaterial color="#ffffff" emissive="#38bdf8" emissiveIntensity={4} />
            </mesh>

            {/* BODY */}
            <RoundedBox args={[0.62, 0.52, 0.48]} radius={0.2} smoothness={6} position={[0, -0.02, 0]}>
                <meshStandardMaterial color="#f4f4fa" metalness={0.28} roughness={0.2} />
            </RoundedBox>

            {/* BELLY PANEL + LIGHT */}
            <RoundedBox args={[0.27, 0.18, 0.035]} radius={0.06} smoothness={4} position={[0, -0.02, 0.255]}>
                <meshStandardMaterial color="#19142b" metalness={0.2} roughness={0.15} />
            </RoundedBox>
            <mesh position={[0, -0.02, 0.28]}>
                <sphereGeometry args={[0.045, 16, 16]} />
                <meshStandardMaterial color="#ffffff" emissive="#8b5cf6" emissiveIntensity={4} />
            </mesh>

            {/* LEFT ARM (pivot at shoulder) */}
            <group ref={leftArmRef} position={[-0.35, 0.1, 0]} rotation={[0, 0, -0.25]}>
                <mesh position={[0, -0.15, 0]}>
                    <capsuleGeometry args={[0.075, 0.22, 8, 12]} />
                    <meshStandardMaterial color="#e8e8f3" metalness={0.3} roughness={0.2} />
                </mesh>
                <mesh position={[0, -0.34, 0]}>
                    <sphereGeometry args={[0.085, 16, 16]} />
                    <meshStandardMaterial color="#fafaff" metalness={0.25} roughness={0.18} />
                </mesh>
            </group>

            {/* RIGHT ARM (pivot at shoulder) */}
            <group ref={rightArmRef} position={[0.35, 0.1, 0]} rotation={[0, 0, 0.25]}>
                <mesh position={[0, -0.15, 0]}>
                    <capsuleGeometry args={[0.075, 0.22, 8, 12]} />
                    <meshStandardMaterial color="#e8e8f3" metalness={0.3} roughness={0.2} />
                </mesh>
                <mesh position={[0, -0.34, 0]}>
                    <sphereGeometry args={[0.085, 16, 16]} />
                    <meshStandardMaterial color="#fafaff" metalness={0.25} roughness={0.18} />
                </mesh>
            </group>

            {/* LEFT LEG (pivot at hip) */}
            <group ref={leftLegRef} position={[-0.15, -0.28, 0]}>
                <mesh position={[0, -0.12, 0]}>
                    <capsuleGeometry args={[0.085, 0.16, 8, 12]} />
                    <meshStandardMaterial color="#e4e4ef" metalness={0.3} roughness={0.2} />
                </mesh>
                <mesh position={[0, -0.24, 0.06]} scale={[1.25, 0.7, 1.45]}>
                    <sphereGeometry args={[0.12, 20, 20]} />
                    <meshStandardMaterial color="#d9d9e6" metalness={0.3} roughness={0.22} />
                </mesh>
            </group>

            {/* RIGHT LEG (pivot at hip) */}
            <group ref={rightLegRef} position={[0.15, -0.28, 0]}>
                <mesh position={[0, -0.12, 0]}>
                    <capsuleGeometry args={[0.085, 0.16, 8, 12]} />
                    <meshStandardMaterial color="#e4e4ef" metalness={0.3} roughness={0.2} />
                </mesh>
                <mesh position={[0, -0.24, 0.06]} scale={[1.25, 0.7, 1.45]}>
                    <sphereGeometry args={[0.12, 20, 20]} />
                    <meshStandardMaterial color="#d9d9e6" metalness={0.3} roughness={0.22} />
                </mesh>
            </group>

            {/* WAIST LIGHT */}
            <mesh position={[0, -0.29, 0]}>
                <torusGeometry args={[0.23, 0.018, 8, 32]} />
                <meshStandardMaterial color="#a855f7" emissive="#8b5cf6" emissiveIntensity={3} />
            </mesh>
        </group>
    );
}

/* ==========================================
   SCENE
========================================== */

function MikoScene({ state, dragging, facing }) {
    return (
        <Canvas
            camera={{ position: [0, 0.4, 4], fov: 35 }}
            dpr={[1, 2]}
            gl={{ alpha: true, antialias: true }}
        >
            <ambientLight intensity={1.8} />
            <directionalLight position={[4, 6, 5]} intensity={3} />
            <pointLight position={[-3, 2, 4]} intensity={3} distance={6} color="#8b5cf6" />
            <pointLight position={[3, 1, 3]} intensity={3} distance={6} color="#38bdf8" />
            <pointLight position={[0, 3, -2]} intensity={2} distance={5} color="#ffffff" />

            <Float speed={1.5} rotationIntensity={0.15} floatIntensity={0.25}>
                <MikoModel state={state} dragging={dragging} facing={facing} />
            </Float>

            <ContactShadows position={[0, -0.78, 0]} opacity={0.45} scale={3} blur={2} far={3} />
            <Environment preset="city" />
        </Canvas>
    );
}

/* ==========================================
   MIKO (companion + guide)
========================================== */

function Miko() {
    const [position, setPosition] = useState(() => ({
        x: typeof window !== "undefined" ? window.innerWidth - 180 : 800,
        y: typeof window !== "undefined" ? window.innerHeight - 220 : 500,
    }));

    const [state, setState] = useState("idle");
    const [dragging, setDragging] = useState(false);
    const [guideOpen, setGuideOpen] = useState(false);
    const [facing, setFacing] = useState(0); // -1 left, 0 front, 1 right
    const [message, setMessage] = useState(null);

    const mikoRef = useRef(null);
    const pointerStart = useRef({ x: 0, y: 0 });
    const dragOffset = useRef({ x: 0, y: 0 });
    const hasDragged = useRef(false);

    // refs mirroring state so timers / rAF never read stale values
    const stateRef = useRef("idle");
    const draggingRef = useRef(false);
    const guideRef = useRef(false);
    const posRef = useRef(position);
    const walkRef = useRef(null);
    const greetedRef = useRef(false);
    const idleTimer = useRef(null);
    const msgTimer = useRef(null);

    useEffect(() => { stateRef.current = state; }, [state]);
    useEffect(() => { draggingRef.current = dragging; }, [dragging]);
    useEffect(() => { guideRef.current = guideOpen; }, [guideOpen]);
    useEffect(() => { posRef.current = position; }, [position]);

    const say = (text, ms = 3200) => {
        setMessage(text);
        clearTimeout(msgTimer.current);
        msgTimer.current = setTimeout(() => setMessage(null), ms);
    };

    const backToIdle = (ms = 1200) => {
        clearTimeout(idleTimer.current);
        idleTimer.current = setTimeout(() => setState("idle"), ms);
    };

    /* ---------- greeting on page load ---------- */
    useEffect(() => {
        const t1 = setTimeout(() => {
            setState("greeting");
            setMessage("Hi! I'm Miko 👋");
        }, 700);

        const t2 = setTimeout(() => {
            setMessage("I'll be your guide here. Tap me anytime!");
        }, 2800);

        const t3 = setTimeout(() => {
            setMessage(null);
            setState((s) => (s === "greeting" ? "idle" : s));
            greetedRef.current = true;
        }, 5600);

        return () => {
            clearTimeout(t1);
            clearTimeout(t2);
            clearTimeout(t3);
        };
    }, []);

    /* ---------- behaviour: sleep / sit / look around / chat / walk ---------- */
    useEffect(() => {
        const timers = [];
        const later = (fn, ms) => timers.push(setTimeout(fn, ms));
        const endAfter = (expected, ms) =>
            later(() => {
                if (stateRef.current === expected) setState("idle");
            }, ms);

        const tick = () => {
            if (
                stateRef.current !== "idle" ||
                draggingRef.current ||
                guideRef.current ||
                !greetedRef.current
            ) {
                later(tick, 1500);
                return;
            }

            const r = Math.random();
            let duration = 2000;

            if (r < 0.12) {
                duration = 4000 + Math.random() * 4000;
                setState("sleeping");
                say("zzz...", 2500);
                endAfter("sleeping", duration);
            } else if (r < 0.28) {
                duration = 2500 + Math.random() * 2500;
                setState("sitting");
                endAfter("sitting", duration);
            } else if (r < 0.42) {
                duration = 900 + Math.random() * 700;
                setState("curious");
                endAfter("curious", duration);
            } else if (r < 0.52) {
                duration = 3200;
                say(IDLE_LINES[Math.floor(Math.random() * IDLE_LINES.length)], duration);
            } else {
                // walk to a random spot anywhere on screen
                const maxX = window.innerWidth - MIKO_WIDTH - 15;
                const maxY = window.innerHeight - MIKO_HEIGHT - 15;
                const tx = 15 + Math.random() * Math.max(maxX - 15, 1);
                const ty = 15 + Math.random() * Math.max(maxY - 15, 1);
                const { x, y } = posRef.current;
                const dist = Math.hypot(tx - x, ty - y);

                if (dist < 100) {
                    later(tick, 1500);
                    return;
                }

                walkRef.current = { x: tx, y: ty };
                setFacing(Math.abs(tx - x) < 30 ? 0 : tx > x ? 1 : -1);
                setState("walking");
                duration = (dist / WALK_SPEED) * 1000 + 300;
            }

            later(tick, duration + 2500 + Math.random() * 4000);
        };

        later(tick, 3000 + Math.random() * 3000);

        return () => timers.forEach(clearTimeout);
    }, []);

    /* ---------- walking movement loop (moves DOM directly = smooth) ---------- */
    useEffect(() => {
        let raf;
        let last = performance.now();

        const loop = (now) => {
            const dt = Math.min((now - last) / 1000, 0.05);
            last = now;

            const w = walkRef.current;

            if (w && !draggingRef.current && stateRef.current === "walking") {
                const { x: cx, y: cy } = posRef.current;
                const dx = w.x - cx;
                const dy = w.y - cy;
                const dist = Math.hypot(dx, dy);
                const step = WALK_SPEED * dt;
                const arrived = dist <= step;
                const nx = arrived ? w.x : cx + (dx / dist) * step;
                const ny = arrived ? w.y : cy + (dy / dist) * step;

                posRef.current = { x: nx, y: ny };
                if (mikoRef.current) {
                    mikoRef.current.style.left = `${nx}px`;
                    mikoRef.current.style.top = `${ny}px`;
                }

                if (arrived) {
                    walkRef.current = null;
                    setPosition({ ...posRef.current });
                    setFacing(0);
                    setState("idle");
                }
            }

            raf = requestAnimationFrame(loop);
        };

        raf = requestAnimationFrame(loop);
        return () => cancelAnimationFrame(raf);
    }, []);

    /* ---------- keep on-screen when window resizes ---------- */
    useEffect(() => {
        const onResize = () =>
            setPosition((p) => clampPos(p.x, p.y));
        window.addEventListener("resize", onResize);
        return () => window.removeEventListener("resize", onResize);
    }, []);

    /* ---------- pointer handling ---------- */
    const handlePointerDown = (event) => {
        const rect = mikoRef.current?.getBoundingClientRect();
        if (!rect) return;

        // stop walking and sync React position with where he actually is
        walkRef.current = null;
        setPosition({ ...posRef.current });
        setFacing(0);
        setMessage(null);
        clearTimeout(idleTimer.current);

        pointerStart.current = { x: event.clientX, y: event.clientY };
        dragOffset.current = {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top,
        };
        hasDragged.current = false;

        mikoRef.current?.setPointerCapture?.(event.pointerId);

        setDragging(true);
        setState("curious");
    };

    const handlePointerMove = (event) => {
        if (!dragging) return;

        const dx = event.clientX - pointerStart.current.x;
        const dy = event.clientY - pointerStart.current.y;

        if (Math.sqrt(dx * dx + dy * dy) > 7) hasDragged.current = true;
        if (!hasDragged.current) return;

        setPosition(
            clampPos(
                event.clientX - dragOffset.current.x,
                event.clientY - dragOffset.current.y
            )
        );
        setState("dragged");
    };

    const handlePointerUp = (event) => {
        if (!dragging) return;

        setDragging(false);
        mikoRef.current?.releasePointerCapture?.(event.pointerId);

        setState("happy");

        if (!hasDragged.current) {
            setGuideOpen((previous) => !previous);
        }

        backToIdle(1200);
    };

    const handlePointerCancel = (event) => {
        setDragging(false);
        mikoRef.current?.releasePointerCapture?.(event.pointerId);
        setState("idle");
    };

    const handleCloseGuide = () => {
        setGuideOpen(false);
        setState("idle");
    };

    useEffect(() => {
        if (guideOpen) setState("happy");
    }, [guideOpen]);

    return (
        <>
            <div
                ref={mikoRef}
                style={{
                    left: `${position.x}px`,
                    top: `${position.y}px`,
                }}
                className={`
          fixed
          z-[9997]
          h-[120px]
          w-[105px]
          select-none
          touch-none
          ${dragging ? "cursor-grabbing" : "cursor-grab"}
        `}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerCancel}
            >
                {/* Purple aura */}
                <div
                    className="
            pointer-events-none
            absolute
            left-1/2
            top-1/2
            h-28
            w-28
            -translate-x-1/2
            -translate-y-1/2
            rounded-full
            bg-violet-500/20
            blur-3xl
          "
                />

                {/* Speech bubble (greeting + companion chatter) */}
                {message ? (
                    <div
                        className="
              pointer-events-none
              absolute
              bottom-full
              left-1/2
              mb-1
              -translate-x-1/2
              whitespace-nowrap
              rounded-2xl
              border
              border-violet-400/25
              bg-[#120c1b]/95
              px-3
              py-1.5
              text-[11px]
              font-medium
              text-violet-100
              shadow-lg
              backdrop-blur-md
            "
                    >
                        {message}
                        <span
                            className="
                absolute
                left-1/2
                top-full
                h-2
                w-2
                -translate-x-1/2
                -translate-y-1/2
                rotate-45
                border-b
                border-r
                border-violet-400/25
                bg-[#120c1b]/95
              "
                        />
                    </div>
                ) : (
                    <MikoBubble state={state} guideOpen={guideOpen} />
                )}

                {/* 3D Miko */}
                <div className="pointer-events-none absolute inset-0">
                    <MikoScene
                        state={state}
                        dragging={dragging}
                        facing={facing}
                    />
                </div>

                {/* Guide indicator */}
                {guideOpen && (
                    <div
                        className="
              pointer-events-none
              absolute
              bottom-0
              left-1/2
              -translate-x-1/2
              whitespace-nowrap
              rounded-full
              border
              border-violet-400/20
              bg-[#120c1b]/90
              px-2.5
              py-1
              text-[9px]
              font-medium
              tracking-wide
              text-violet-200
              shadow-lg
              backdrop-blur-md
            "
                    >
                        Miko guide
                    </div>
                )}
            </div>

            <MikoMenu
                isOpen={guideOpen}
                position={position}
                onClose={handleCloseGuide}
            />
        </>
    );
}

export default Miko;