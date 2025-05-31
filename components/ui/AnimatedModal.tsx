"use client";
import { AnimatePresence, motion } from "framer-motion";
import React, {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import { cn } from "@/lib/utils";

interface ModalContextType {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [open, setOpen] = useState(false);

  return (
    <ModalContext.Provider value={{ open, setOpen }}>
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);

  if (!context) {
    throw new Error("useModal must be used within a ModalProvider");
  }

  return context;
};

export function Modal({ children }: { children: ReactNode }) {
  return <ModalProvider>{children}</ModalProvider>;
}

export const ModalTrigger = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  const { setOpen } = useModal();

  return (
    <button
      className={cn(
        "px-4 py-2 rounded-md text-black dark:text-white text-center relative overflow-hidden",
        className,
      )}
      onClick={() => setOpen(true)}
    >
      {children}
    </button>
  );
};

export const ModalBody = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  const { open } = useModal();

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [open]);

  const modalRef = useRef(null);
  const { setOpen } = useModal();

  useOutsideClick(modalRef, () => setOpen(false));

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          animate={{
            opacity: 1,
            backdropFilter: "blur(20px)",
          }}
          className="fixed inset-0 h-screen w-full flex items-center justify-center z-40 overflow-y-auto py-8"
          exit={{
            opacity: 0,
            backdropFilter: "blur(0px)",
          }}
          initial={{
            opacity: 0,
            backdropFilter: "blur(0px)",
          }}
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.2)",
          }}
          transition={{
            duration: 0.3,
          }}
        >
          <div className="fixed inset-0 backdrop-blur-xl z-40" />
          <Overlay />

          <motion.div
            ref={modalRef}
            animate={{
              opacity: 1,
              scale: 1,
              rotateX: 0,
              y: 0,
            }}
            className={cn(
              "min-h-[60vh] max-h-[90vh] md:max-w-[40%] bg-white/10 dark:bg-neutral-950/10 backdrop-blur-xl border border-white/20 dark:border-neutral-800/50 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] md:rounded-2xl relative z-50 flex flex-col flex-1 overflow-auto overflow-y-auto my-auto",
              className,
            )}
            exit={{
              opacity: 0,
              scale: 0.8,
              rotateX: 10,
              y: 20,
            }}
            initial={{
              opacity: 0,
              scale: 0.5,
              rotateX: 40,
              y: 20,
            }}
            style={{
              backdropFilter: "none",
            }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 15,
            }}
          >
            <CloseIcon />
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export const ModalContent = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex flex-col flex-1 p-8 md:p-10", className)}>
      {children}
    </div>
  );
};

export const ModalFooter = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "flex justify-end p-4 bg-gray-100 dark:bg-neutral-900",
        className,
      )}
    >
      {children}
    </div>
  );
};

const Overlay = ({ className }: { className?: string }) => {
  return (
    <motion.div
      animate={{
        opacity: 1,
      }}
      className={`fixed inset-0 h-full w-full bg-black/40 z-40 ${className}`}
      exit={{
        opacity: 0,
      }}
      initial={{
        opacity: 0,
      }}
      transition={{
        duration: 0.3,
      }}
    />
  );
};

const CloseIcon = () => {
  const { setOpen } = useModal();

  return (
    <button
      className="absolute top-4 right-4 group"
      onClick={() => setOpen(false)}
    >
      <svg
        className="text-black dark:text-white h-4 w-4 group-hover:scale-125 group-hover:rotate-3 transition duration-200"
        fill="none"
        height="24"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        viewBox="0 0 24 24"
        width="24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M0 0h24v24H0z" fill="none" stroke="none" />
        <path d="M18 6l-12 12" />
        <path d="M6 6l12 12" />
      </svg>
    </button>
  );
};

// Hook to detect clicks outside of a component.
// Add it in a separate file, I've added here for simplicity
export const useOutsideClick = (
  ref: React.RefObject<HTMLDivElement>,
  callback: Function,
) => {
  useEffect(() => {
    const listener = (event: any) => {
      // DO NOTHING if the element being clicked is the target element or their children
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }
      callback(event);
    };

    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);

    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, callback]);
};
