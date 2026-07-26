import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"
import { FileText } from "lucide-react"
import { motion } from "framer-motion"

import { Certificate } from "@/types/database"

interface FeaturedCertificatesProps {
  certificates?: Certificate[]
}

export default function FeaturedCertificates({ certificates }: FeaturedCertificatesProps) {
  if (!certificates || certificates.length === 0) return null

  return (
    <section
      id="certificates"
      className="relative overflow-hidden py-28 md:py-36"
    >
      <div className="bg-letter absolute left-[-5%] top-[5%]">C</div>

      <div className="relative z-10 px-6 md:px-10">
        <motion.h2
          className="section-title mb-10 text-sm font-semibold tracking-[0.3em]"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          CERTIFICATES
        </motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {certificates.map((cert, index) => (
            <motion.div
              key={cert.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.6,
                delay: index * 0.1,
                ease: [0.76, 0, 0.24, 1],
              }}
            >
              <Card className="overflow-hidden group hover:border-accent transition-colors h-full flex flex-col">
                <div className="relative h-40 overflow-hidden">
                  <Image
                    src={cert.cover_url}
                    alt={cert.title}
                    fill
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                  <div className="absolute top-3 right-3">
                    <span className="inline-flex items-center rounded-full bg-[var(--accent)] px-2.5 py-0.5 text-xs font-bold text-white shadow-lg">
                      {cert.year}
                    </span>
                  </div>
                </div>
                <CardHeader className="pb-3 flex-1">
                  <CardTitle className="text-base">{cert.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  {cert.issuer && <p className="text-xs text-muted-foreground mb-2">{cert.issuer}</p>}
                  <a
                    href={cert.pdf_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-xs font-medium text-accent hover:text-accent/80 mt-2"
                  >
                    <FileText className="w-3 h-3" />
                    View PDF
                  </a>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}