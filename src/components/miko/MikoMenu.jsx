import { useEffect, useRef } from "react";
import {
  UserRound,
  Code2,
  BriefcaseBusiness,
  FolderOpen,
  Mail,
  X,
} from "lucide-react";

const menuItems = [
  {
    id: "about",
    label: "About",
    icon: UserRound,
  },
  {
    id: "skills",
    label: "Skills",
    icon: Code2,
  },
  {
    id: "experience",
    label: "Experience",
    icon: BriefcaseBusiness,
  },
  {
    id: "projects",
    label: "Projects",
    icon: FolderOpen,
  },
  {
    id: "contact",
    label: "Contact",
    icon: Mail,
  },
];

function MikoMenu({
  isOpen,
  position,
  onClose,
}) {
  const menuRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleOutsideClick = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target)
      ) {
        onClose();
      }
    };

    document.addEventListener(
      "pointerdown",
      handleOutsideClick
    );

    return () => {
      document.removeEventListener(
        "pointerdown",
        handleOutsideClick
      );
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  const menuWidth = 230;
  const menuHeight = 330;
  const gap = 18;

  let left = position.x - menuWidth - gap;
  let top = position.y;

  if (left < 16) {
    left = position.x + 110 + gap;
  }

  if (left + menuWidth > window.innerWidth - 16) {
    left = window.innerWidth - menuWidth - 16;
  }

  if (top + menuHeight > window.innerHeight - 16) {
    top = window.innerHeight - menuHeight - 16;
  }

  if (top < 16) {
    top = 16;
  }

  const handleNavigation = (sectionId) => {
    const section =
      document.getElementById(sectionId);

    if (section) {
      onClose();

      setTimeout(() => {
        section.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);
    }
  };

  return (
    <div
      ref={menuRef}
      style={{
        left: `${left}px`,
        top: `${top}px`,
      }}
      className="
        fixed
        z-[9998]
        w-[230px]
        overflow-hidden
        rounded-2xl
        border
        border-violet-400/15
        bg-[#100b17]/95
        shadow-[0_20px_60px_rgba(0,0,0,0.45),0_0_40px_rgba(139,92,246,0.12)]
        backdrop-blur-xl
        animate-[mikoMenuIn_0.2s_ease-out]
      "
    >
      {/* Header */}

      <div
        className="
          flex
          items-center
          justify-between
          border-b
          border-white/5
          px-4
          py-3
        "
      >
        <div>
          <p className="text-[9px] font-semibold tracking-[0.2em] text-violet-400">
            MIKO
          </p>

          <p className="mt-0.5 text-xs text-white/70">
            What are you looking for?
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="
            flex
            h-7
            w-7
            items-center
            justify-center
            rounded-lg
            text-white/40
            transition
            hover:bg-white/5
            hover:text-white
          "
          aria-label="Close Miko guide"
        >
          <X size={14} />
        </button>
      </div>

      {/* Menu */}

      <div className="p-2">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() =>
                handleNavigation(item.id)
              }
              className="
                group
                flex
                w-full
                items-center
                gap-3
                rounded-xl
                px-3
                py-3
                text-left
                transition-all
                duration-200
                hover:bg-violet-500/10
              "
            >
              <span
                className="
                  flex
                  h-8
                  w-8
                  items-center
                  justify-center
                  rounded-lg
                  bg-violet-500/10
                  text-violet-300
                  transition
                  group-hover:bg-violet-500/20
                  group-hover:text-violet-200
                "
              >
                <Icon size={15} />
              </span>

              <span
                className="
                  text-sm
                  font-medium
                  text-white/70
                  transition
                  group-hover:text-white
                "
              >
                {item.label}
              </span>

              <span
                className="
                  ml-auto
                  translate-x-[-4px]
                  text-xs
                  text-white/20
                  opacity-0
                  transition-all
                  group-hover:translate-x-0
                  group-hover:opacity-100
                "
              >
                →
              </span>
            </button>
          );
        })}
      </div>

      {/* Footer */}

      <div
        className="
          border-t
          border-white/5
          px-4
          py-2.5
        "
      >
        <p className="text-center text-[9px] tracking-wider text-white/25">
          CLICK MIKO ANYTIME
        </p>
      </div>
    </div>
  );
}

export default MikoMenu;