import { useEffect, useState } from "react";

const IDLE_MESSAGES = ["hey!", ":D", "nice place.", "...cozy.", "hmm?"];

// small reactions when Miko changes activity (shown ~half the time)
const STATE_MESSAGES = {
  walking: ["la la la ♪", "just stretching my legs", "off I go!"],
  sitting: ["*sits down*", "phew...", "nice spot."],
  curious: ["hmm?", "what's that?"],
  happy: [":D", "yay!"],
};

const pick = (list) => list[Math.floor(Math.random() * list.length)];

function MikoBubble({ state, guideOpen }) {
  const [message, setMessage] = useState("");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (guideOpen) {
      setVisible(false);
      return;
    }

    let showTimer;
    let hideTimer;

    const show = (text) => {
      setMessage(text);
      setVisible(true);
      hideTimer = setTimeout(() => setVisible(false), 2200);
    };

    const reactions = STATE_MESSAGES[state];

    if (reactions && Math.random() < 0.5) {
      showTimer = setTimeout(() => show(pick(reactions)), 500);
    } else if (state === "idle") {
      showTimer = setTimeout(
        () => show(pick(IDLE_MESSAGES)),
        7000 + Math.random() * 8000
      );
    }

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
      setVisible(false);
    };
  }, [guideOpen, state]);

  if (!visible || guideOpen) {
    return null;
  }

  return (
    <div
      className="
        pointer-events-none
        absolute
        -top-10
        left-1/2
        -translate-x-1/2
        whitespace-nowrap
        rounded-xl
        border
        border-violet-400/20
        bg-[#160d22]/95
        px-3
        py-1.5
        text-[11px]
        font-medium
        text-violet-200
        shadow-[0_8px_30px_rgba(139,92,246,0.18)]
        backdrop-blur-md
        animate-[mikoBubble_0.25s_ease-out]
      "
    >
      {message}
    </div>
  );
}

export default MikoBubble;