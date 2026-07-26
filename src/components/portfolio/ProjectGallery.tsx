"use client"

import { useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"

import { ProjectImage } from "@/types/database"

interface ProjectGalleryProps {
  images?: ProjectImage[]
}

export default function ProjectGallery({ images }: ProjectGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<ProjectImage | null>(null)

  if (!images || images.length === 0) return null

  return (
    <section className="mb-12">
      <h2 className="text-sm font-semibold tracking-[0.3em] text-[#888] uppercase mb-6">
        Project Screenshots
      </h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {images.map((img, index) => (
          <motion.div
            key={img.id}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, ease: [0.76, 0, 0.24, 1] }}
            onClick={() => setSelectedImage(img)}
            className="group relative aspect-video cursor-pointer rounded-lg overflow-hidden bg-[#18181c]"
          >
            <Image
              src={img.image_url}
              alt={img.caption || "Project screenshot"}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <span className="text-white font-medium">View Full Size</span>
            </div>
            {img.caption && (
              <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-3">
                <p className="text-xs text-white">{img.caption}</p>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Lightbox */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-6"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute top-6 right-6 text-white hover:text-[#FF6A13] transition-colors"
            onClick={(e) => {
              e.stopPropagation()
              setSelectedImage(null)
            }}
          >
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div
            className="relative max-w-5xl max-h-[90vh] rounded-lg overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={selectedImage.image_url}
              alt={selectedImage.caption || "Project screenshot"}
              width={1200}
              height={800}
              className="max-w-full max-h-[90vh] object-contain"
            />
          </div>
        </div>
      )}
    </section>
  )
}
