import { useState, useEffect } from "react"

export function useUnsavedChanges(isDirty: boolean) {
  const [showWarning, setShowWarning] = useState(false)

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault()
        e.returnValue = ""
        setShowWarning(true)
      }
    }

    window.addEventListener("beforeunload", handleBeforeUnload)
    return () => window.removeEventListener("beforeunload", handleBeforeUnload)
  }, [isDirty])

  return { showWarning, setShowWarning }
}