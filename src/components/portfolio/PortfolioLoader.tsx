"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

export default function PortfolioLoader({
  onComplete,
}: {
  onComplete: () => void
}) {
  const [progress, setProgress] = useState(0)
  const [isExiting, setIsExiting] = useState(false)

  useEffect(() => {
    const duration = 1500
    const interval = 16
    const steps = duration / interval
    const increment = 100 / steps
    let current = 0

    const timer = setInterval(() => {
      current += increment
      if (current >= 100) {
        current = 100
        clearInterval(timer)
        setTimeout(() => {
          setIsExiting(true)
          setTimeout(onComplete, 600)
        }, 300)
      }
      setProgress(Math.round(current))
    }, interval)

    return () => clearInterval(timer)
  }, [onComplete])

  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#050505]"
          exit={{ opacity: 0, y: -40 }}
          transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
        >
          {/* Background letter R */}
          <div className="bg-letter absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-100">
            R
          </div>

          {/* Center content */}
          <div className="relative z-10 flex flex-col items-center gap-6">
            {/* Monogram */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="text-5xl font-bold tracking-[-0.05em] text-[var(--foreground)]"
            >
              rizka aulia
            </motion.div>

            {/* Progress bar */}
            <div className="flex w-48 flex-col items-center gap-3">
              <div className="h-[2px] w-full overflow-hidden rounded-full bg-[var(--border)]">
                <motion.div
                  className="h-full bg-[var(--accent)]"
                  initial={{ width: "0%" }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.05 }}
                />
              </div>
              <motion.span
                className="text-xs font-medium tracking-widest text-[var(--muted)]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {progress}%
              </motion.span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
