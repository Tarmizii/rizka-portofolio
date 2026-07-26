import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import Image from "next/image"
import { FileText } from "lucide-react"

export default async function CertificatesPage() {
  const supabase = await createClient()
  
  const { data: certificates, error } = await supabase
    .from("certificates")
    .select("*")
    .is("deleted_at", null)
    .eq("status", "published")
    .order("created_at", { ascending: false })
    .order("id", { ascending: false })

  if (error) {
    console.error("Error fetching certificates:", error)
    return (
      <div className="min-h-screen bg-background text-foreground">
        <div className="container mx-auto p-6">
          <h1 className="text-4xl font-bold mb-8">Certificates</h1>
          <p className="text-muted-foreground">Failed to load certificates</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto p-6 py-12">
        <div className="mb-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">CERTIFICATES</h1>
          <p className="text-muted-foreground text-lg">My professional certifications and achievements</p>
        </div>

        {certificates.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No certificates available yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {certificates.map((cert) => (
              <Card key={cert.id} className="overflow-hidden group hover:border-accent transition-colors">
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={cert.cover_url}
                    alt={cert.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <div className="absolute top-3 right-3">
                    <span className="inline-flex items-center rounded-full bg-[var(--accent)] px-2.5 py-0.5 text-xs font-bold text-white shadow-lg">
                      {cert.year}
                    </span>
                  </div>
                </div>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">{cert.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  {cert.issuer && <p className="text-sm text-muted-foreground mb-2">Issued by {cert.issuer}</p>}
                  <div className="flex items-center justify-between mt-4">
                    <a
                      href={cert.pdf_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-accent hover:text-accent/80 font-medium"
                    >
                      <FileText className="w-4 h-4" />
                      View PDF
                    </a>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
