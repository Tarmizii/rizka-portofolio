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

import { Project, Skill, Profile } from "@/types/database"

interface PortfolioLayoutProps {
  profile?: Profile | null
  projects: Project[]
  skills: Skill[]
}

export default function PortfolioLayout({ profile, projects, skills }: PortfolioLayoutProps) {
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
          <PortfolioHeader profile={profile} />
          <SideElements />

          <main>
            <Hero profile={profile} />
            <DiagonalMarquee />
            <About profile={profile} />
            <Capabilities />
            <SelectedProjects projects={projects} />
            <TechStack skills={skills} />
            <Education profile={profile} />
            <Contact profile={profile} />
          </main>

          <Footer />
          <CustomCursor />
        </div>
      </LenisProvider>
    </>
  )
}
