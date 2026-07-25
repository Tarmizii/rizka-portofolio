export default function TechStack() {
  return (
    <section id="tech-stack" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl md:text-6xl font-bold mb-16">TECH STACK</h2>
        <div className="space-y-8">
          {[
            { category: "Frontend", items: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Framer Motion"] },
            { category: "Backend", items: ["Node.js", "PHP", "Express", "Supabase"] },
            { category: "Database", items: ["PostgreSQL", "MySQL", " Supabase Auth"] },
            { category: "Tools", items: ["Git", "VS Code", "Figma", "Postman", "Docker"] },
          ].map((group) => (
            <div key={group.category}>
              <h3 className="text-xl font-bold mb-4">{group.category}</h3>
              <div className="flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <span key={item} className="rounded-full bg-muted/50 px-4 py-2 text-sm">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
