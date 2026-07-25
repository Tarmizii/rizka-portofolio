"use client"

import { useState, useCallback } from "react"
import PortfolioLoader from "@/components/portfolio/PortfolioLoader"
import PortfolioHeader from "@/components/portfolio/PortfolioHeader"
import SideElements from "@/components/portfolio/SideElements"
import Hero from "@/components/portfolio/Hero"
import DiagonalMarquee from "@/components/portfolio/DiagonalMarquee"
import About from "@/components/portfolio/About"
import Capabilities from "@/components/portfolio/Capabilities"
import SelectedProjects from "@/components/portfolio/SelectedProjects"
import TechStack from "@/components/portfolio/TechStack"
import Education from "@/components/portfolio/Education"
import Contact from "@/components/portfolio/Contact"
import Footer from "@/components/portfolio/Footer"
import CustomCursor from "@/components/portfolio/CustomCursor"
import { LenisProvider } from "@/components/portfolio/LenisProvider"

export default function PortfolioPage() {
  const [isLoading, setIsLoading] = useState(true)

  const handleLoadComplete = useCallback(() => {
    setIsLoading(false)
  }, [])

  return (
    <>
      {isLoading && <PortfolioLoader onComplete={handleLoadComplete} />}

      <LenisProvider>
        <div
          className={`min-h-screen bg-[var(--background)] text-[var(--foreground)] ${
            isLoading ? "opacity-0" : "opacity-100"
          } transition-opacity duration-500`}
        >
          <PortfolioHeader />
          <SideElements />

          <main>
            <Hero />
            <DiagonalMarquee />
            <About />
            <Capabilities />
            <SelectedProjects />
            <TechStack />
            <Education />
            <Contact />
          </main>

          <Footer />
          <CustomCursor />
        </div>
      </LenisProvider>
    </>
  )
}
