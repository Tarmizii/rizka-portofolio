import type { Metadata } from "next"
import { Toaster } from "@/components/ui/sonner"
import "./globals.css"

export const metadata: Metadata = {
  title: "Rizka Aulia — Full-Stack Developer",
  description:
    "Full-Stack Developer specializing in building web products from interface through data and backend logic. Next.js, TypeScript, PHP, PostgreSQL.",
  keywords: [
    "full-stack developer",
    "web development",
    "portfolio",
    "react",
    "next.js",
    "typescript",
    "supabase",
    "php",
    "postgresql",
  ],
  authors: [{ name: "Rizka Aulia" }],
  openGraph: {
    title: "Rizka Aulia — Full-Stack Developer",
    description:
      "Portfolio showcasing full-stack web development projects and skills",
    type: "website",
    locale: "en_US",
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  )
}
