"use client"

const topItems = [
  "NEXT.JS",
  "TYPESCRIPT",
  "PHP",
  "MYSQL",
  "WEB DEVELOPMENT",
  "REACT",
  "TAILWIND",
]
const bottomItems = [
  "FRONTEND",
  "BACKEND",
  "DATABASE",
  "PRODUCT",
  "DEVELOPMENT",
  "API",
  "DEPLOYMENT",
]

function MarqueeStrip({
  items,
  direction = "left",
  variant = "light",
}: {
  items: string[]
  direction?: "left" | "right"
  variant?: "light" | "dark"
}) {
  const isLight = variant === "light"
  const animClass =
    direction === "left" ? "animate-marquee" : "animate-marquee-reverse"

  return (
    <div
      className={`flex overflow-hidden whitespace-nowrap py-4 ${
        isLight
          ? "bg-[var(--foreground)] text-[var(--background)]"
          : "bg-[var(--border)] text-[var(--foreground)]"
      }`}
    >
      <div className={`flex shrink-0 ${animClass}`}>
        {[...Array(4)].map((_, repeat) => (
          <div key={repeat} className="flex shrink-0 items-center">
            {items.map((item, i) => (
              <span key={`${repeat}-${i}`} className="flex items-center">
                <span className="px-6 text-sm font-semibold tracking-[0.2em]">
                  {item}
                </span>
                <span
                  className="inline-block h-2 w-2 shrink-0 rounded-full bg-[var(--accent)]"
                />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

export default function DiagonalMarquee() {
  return (
    <div className="relative -mt-4 overflow-hidden">
      {/* Top strip - rotated right, light */}
      <div
        className="relative origin-center"
        style={{
          transform: "rotate(-3deg)",
          marginLeft: "-10vw",
          marginRight: "-10vw",
          width: "120vw",
        }}
      >
        <MarqueeStrip items={topItems} direction="left" variant="light" />
      </div>

      {/* Bottom strip - rotated left, dark */}
      <div
        className="relative -mt-2 origin-center"
        style={{
          transform: "rotate(3deg)",
          marginLeft: "-10vw",
          marginRight: "-10vw",
          width: "120vw",
        }}
      >
        <MarqueeStrip items={bottomItems} direction="right" variant="dark" />
      </div>
    </div>
  )
}

