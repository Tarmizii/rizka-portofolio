"use client"

import { useEffect, useState, useRef } from "react"
import { motion, useMotionValue, useSpring } from "framer-motion"

export default function CustomCursor() {
  const [isVisible, setIsVisible] = useState(false)
  const [cursorText, setCursorText] = useState("")
  const [isHovering, setIsHovering] = useState(false)
  const cursorX = useMotionValue(0)
  const cursorY = useMotionValue(0)
  const springX = useSpring(cursorX, { stiffness: 500, damping: 28 })
  const springY = useSpring(cursorY, { stiffness: 500, damping: 28 })
  const isTouchDevice = useRef(false)

  useEffect(() => {
    // Detect touch device
    isTouchDevice.current =
      "ontouchstart" in window || navigator.maxTouchPoints > 0

    if (isTouchDevice.current) return

    const handleMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX)
      cursorY.set(e.clientY)
      if (!isVisible) setIsVisible(true)
    }

    const handleMouseLeave = () => setIsVisible(false)
    const handleMouseEnter = () => setIsVisible(true)

    // Listen for hover on interactive elements
    const handleElementHover = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const link = target.closest("a")
      const button = target.closest("button")
      const projectCard = target.closest("[data-cursor='project']")
      const certCard = target.closest("[data-cursor='certificate']")
      const externalLink = target.closest("a[target='_blank']")

      if (projectCard) {
        setCursorText("VIEW →")
        setIsHovering(true)
      } else if (certCard) {
        setCursorText("PDF →")
        setIsHovering(true)
      } else if (externalLink) {
        setCursorText("OPEN →")
        setIsHovering(true)
      } else if (link || button) {
        setIsHovering(true)
        setCursorText("")
      } else {
        setIsHovering(false)
        setCursorText("")
      }
    }

    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("mouseover", handleElementHover)
    document.addEventListener("mouseleave", handleMouseLeave)
    document.addEventListener("mouseenter", handleMouseEnter)

    // Hide default cursor
    document.body.style.cursor = "none"
    const style = document.createElement("style")
    style.id = "custom-cursor-style"
    style.textContent = `
      a, button, [role="button"], input, textarea, select {
        cursor: none !important;
      }
    `
    document.head.appendChild(style)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseover", handleElementHover)
      document.removeEventListener("mouseleave", handleMouseLeave)
      document.removeEventListener("mouseenter", handleMouseEnter)
      document.body.style.cursor = ""
      const cursorStyle = document.getElementById("custom-cursor-style")
      if (cursorStyle) cursorStyle.remove()
    }
  }, [cursorX, cursorY, isVisible])

  if (typeof window !== "undefined" && isTouchDevice.current) return null

  return (
    <motion.div
      className="custom-cursor pointer-events-none fixed left-0 top-0 z-[9999] mix-blend-difference"
      style={{
        x: springX,
        y: springY,
        translateX: "-50%",
        translateY: "-50%",
      }}
    >
      {/* Outer ring */}
      <motion.div
        className="flex items-center justify-center rounded-full border border-white"
        animate={{
          width: isHovering ? (cursorText ? 80 : 48) : 20,
          height: isHovering ? (cursorText ? 80 : 48) : 20,
          opacity: isVisible ? 1 : 0,
        }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        {cursorText && (
          <motion.span
            className="text-[10px] font-bold tracking-wider text-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {cursorText}
          </motion.span>
        )}
      </motion.div>

      {/* Center dot */}
      {!isHovering && (
        <motion.div
          className="absolute left-1/2 top-1/2 h-1 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white"
          animate={{ opacity: isVisible ? 1 : 0 }}
        />
      )}
    </motion.div>
  )
}
