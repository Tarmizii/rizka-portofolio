"use client"

import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"

interface FullscreenMenuProps {
  isOpen: boolean
  onClose: () => void
}

const menuLinks = [
  { label: "About", href: "/#about" },
  { label: "Projects", href: "/#projects" },
  { label: "Capabilities", href: "/#capabilities" },
  { label: "Certificates", href: "/certificates" },
  { label: "Contact", href: "/#contact" },
]

const externalLinks = [
  {
    label: "GitHub",
    href: "https://github.com/rizkaauliaa",
    external: true,
  },
  {
    label: "Email",
    href: "mailto:rizkaauliaa198@gmail.com",
    external: false,
  },
]

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.2,
    },
  },
  exit: {
    transition: {
      staggerChildren: 0.04,
      staggerDirection: -1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.76, 0, 0.24, 1] },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: { duration: 0.3, ease: [0.76, 0, 0.24, 1] },
  },
}

export default function FullscreenMenu({ isOpen, onClose }: FullscreenMenuProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[60] bg-[var(--background)]"
          initial={{ clipPath: "inset(0 0 100% 0)" }}
          animate={{ clipPath: "inset(0 0 0% 0)" }}
          exit={{ clipPath: "inset(0 0 100% 0)" }}
          transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
        >
          {/* Close button */}
          <div className="absolute top-0 right-0 p-6 md:p-10">
            <button
              onClick={onClose}
              className="flex items-center gap-3 text-xs font-medium tracking-wider text-[var(--foreground)] transition-opacity hover:opacity-70"
              aria-label="Close menu"
            >
              <span className="hidden sm:inline">CLOSE</span>
              <div className="relative h-5 w-5">
                <span className="absolute top-1/2 left-0 block h-[1.5px] w-5 -translate-y-1/2 rotate-45 bg-[var(--foreground)]" />
                <span className="absolute top-1/2 left-0 block h-[1.5px] w-5 -translate-y-1/2 -rotate-45 bg-[var(--foreground)]" />
              </div>
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex h-full flex-col items-center justify-center px-6">
            <motion.div
              className="flex flex-col items-center gap-6 md:gap-8"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {menuLinks.map((link) => (
                <motion.div key={link.label} variants={itemVariants}>
                  <Link
                    href={link.href}
                    className="group relative text-3xl font-light tracking-wider text-[var(--foreground)] transition-colors hover:text-[var(--accent)] sm:text-4xl md:text-5xl"
                    onClick={onClose}
                  >
                    {link.label}
                    <span className="absolute -bottom-1 left-0 h-[1px] w-0 bg-[var(--accent)] transition-all duration-300 group-hover:w-full" />
                  </Link>
                </motion.div>
              ))}

              {/* Divider */}
              <motion.div
                variants={itemVariants}
                className="my-2 h-[1px] w-16 bg-[var(--border)]"
              />

              {/* External links */}
              <motion.div
                variants={itemVariants}
                className="flex gap-8"
              >
                {externalLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target={link.external ? "_blank" : undefined}
                    rel={link.external ? "noopener noreferrer" : undefined}
                    className="text-sm font-medium tracking-widest text-[var(--muted)] transition-colors hover:text-[var(--accent)]"
                    onClick={onClose}
                  >
                    {link.label}
                  </a>
                ))}
              </motion.div>
            </motion.div>
          </nav>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
