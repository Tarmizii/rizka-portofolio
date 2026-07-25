export default function ProjectDetailPage({ params }: { params: { slug: string } }) {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto p-4">Project Detail: {params.slug}</div>
    </main>
  )
}
