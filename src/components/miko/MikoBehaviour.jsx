import { useCallback, useEffect, useRef } from "react";

function MikoBehavior({
  position,
  setPosition,
  setState,
  dragging,
  guideOpen,
}) {
  const timerRef = useRef(null);
  const mountedRef = useRef(true);

  const MIKO_WIDTH = 110;
  const MIKO_HEIGHT = 150;
  const EDGE = 24;

  const clampPosition = useCallback((x, y) => {
    const maxX = window.innerWidth - MIKO_WIDTH - EDGE;
    const maxY = window.innerHeight - MIKO_HEIGHT - EDGE;

    return {
      x: Math.max(EDGE, Math.min(x, maxX)),
      y: Math.max(EDGE, Math.min(y, maxY)),
    };
  }, []);

  const getRandomPosition = useCallback(() => {
    const maxX = window.innerWidth - MIKO_WIDTH - EDGE;
    const maxY = window.innerHeight - MIKO_HEIGHT - EDGE;

    return {
      x: Math.floor(
        Math.random() * Math.max(maxX - EDGE, 1) + EDGE
      ),
      y: Math.floor(
        Math.random() * Math.max(maxY - EDGE, 1) + EDGE
      ),
    };
  }, []);

  const performBehavior = useCallback(() => {
    if (!mountedRef.current || dragging || guideOpen) {
      return;
    }

    const random = Math.random();

    if (random < 0.12) {
      setState("sleeping");

      timerRef.current = setTimeout(() => {
        if (!mountedRef.current || dragging || guideOpen) return;

        setState("idle");

        timerRef.current = setTimeout(
          performBehavior,
          2500
        );
      }, 4000 + Math.random() * 4000);

      return;
    }

    if (random < 0.28) {
      setState("sitting");

      timerRef.current = setTimeout(() => {
        if (!mountedRef.current || dragging || guideOpen) return;

        setState("idle");

        timerRef.current = setTimeout(
          performBehavior,
          1800
        );
      }, 2500 + Math.random() * 2500);

      return;
    }

    if (random < 0.42) {
      setState("curious");

      timerRef.current = setTimeout(() => {
        if (!mountedRef.current || dragging || guideOpen) return;

        setState("idle");

        timerRef.current = setTimeout(
          performBehavior,
          1500
        );
      }, 900 + Math.random() * 700);

      return;
    }

    setState("walking");

    const nextPosition = getRandomPosition();

    setPosition((current) => {
      const distance = Math.sqrt(
        Math.pow(nextPosition.x - current.x, 2) +
        Math.pow(nextPosition.y - current.y, 2)
      );

      if (distance < 100) {
        return current;
      }

      return clampPosition(
        nextPosition.x,
        nextPosition.y
      );
    });

    timerRef.current = setTimeout(() => {
      if (!mountedRef.current) return;

      setState("idle");

      timerRef.current = setTimeout(
        performBehavior,
        2500 + Math.random() * 4000
      );
    }, 2500 + Math.random() * 2500);
  }, [
    clampPosition,
    dragging,
    getRandomPosition,
    guideOpen,
    setPosition,
    setState,
  ]);

  useEffect(() => {
    mountedRef.current = true;

    if (!dragging && !guideOpen) {
      timerRef.current = setTimeout(
        performBehavior,
        3000 + Math.random() * 3000
      );
    }

    return () => {
      mountedRef.current = false;

      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [dragging, guideOpen, performBehavior]);

  useEffect(() => {
    const handleResize = () => {
      setPosition((current) =>
        clampPosition(current.x, current.y)
      );
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener(
        "resize",
        handleResize
      );
    };
  }, [clampPosition, setPosition]);

  return null;
}

export default MikoBehavior;