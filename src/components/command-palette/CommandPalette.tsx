import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { FaHome, FaProjectDiagram, FaBook, FaFileAlt } from "react-icons/fa";
import { MdContactMail } from "react-icons/md";
import type { ComponentType } from "react";
import "./command-palette.css";

interface Command {
  id: string;
  label: string;
  Icon: ComponentType<{ className?: string }>;
  action: () => void;
}

const CommandPalette = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setActiveIndex(0);
  }, []);

  const commands: Command[] = useMemo(
    () => [
      {
        id: "home",
        label: "Go to Home",
        Icon: FaHome,
        action: () => {
          navigate("/");
          close();
          scrollToId("about");
        },
      },
      {
        id: "projects",
        label: "Go to Projects",
        Icon: FaProjectDiagram,
        action: () => {
          navigate("/");
          close();
          scrollToId("project");
        },
      },
      {
        id: "experience",
        label: "Go to Experience",
        Icon: FaBook,
        action: () => {
          navigate("/");
          close();
          scrollToId("experience");
        },
      },
      {
        id: "contact",
        label: "Go to Contact",
        Icon: MdContactMail,
        action: () => {
          navigate("/");
          close();
          scrollToId("contact");
        },
      },
      {
        id: "resume",
        label: "Open Resume",
        Icon: FaFileAlt,
        action: () => {
          navigate("/resume");
          close();
        },
      },
    ],
    [navigate, close],
  );

  const filtered = useMemo(
    () =>
      query
        ? commands.filter((c) => c.label.toLowerCase().includes(query.toLowerCase()))
        : commands,
    [query, commands],
  );

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
    }
  }, [open]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % filtered.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => (i - 1 + filtered.length) % filtered.length);
    } else if (e.key === "Enter" && filtered[activeIndex]) {
      filtered[activeIndex].action();
    } else if (e.key === "Escape") {
      close();
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="cmd-palette_backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          onClick={close}
        >
          <motion.div
            className="cmd-palette"
            role="dialog"
            aria-modal="true"
            aria-label="Command palette"
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.15 }}
            onClick={(e) => e.stopPropagation()}
            onKeyDown={handleKeyDown}
          >
            <input
              ref={inputRef}
              className="cmd-palette_input"
              placeholder="Type a command..."
              aria-label="Search commands"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            {filtered.length > 0 ? (
              <ul className="cmd-palette_list">
                {filtered.map((cmd, i) => (
                  <li
                    key={cmd.id}
                    className={`cmd-palette_item ${i === activeIndex ? "active" : ""}`}
                    onClick={cmd.action}
                    onMouseEnter={() => setActiveIndex(i)}
                  >
                    <cmd.Icon className="cmd-palette_item-icon" />
                    {cmd.label}
                  </li>
                ))}
              </ul>
            ) : (
              <div className="cmd-palette_empty">No commands found</div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

/** Delay to allow route transition to complete before scrolling */
const SCROLL_AFTER_NAVIGATE_MS = 100;

function scrollToId(id: string) {
  setTimeout(() => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }, SCROLL_AFTER_NAVIGATE_MS);
}

export default CommandPalette;
