import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useState, useRef } from "react"
import { toast } from "sonner"

export function FileUpload({ 
  label, 
  file, 
  onFileChange, 
  accept = "*/*",
  maxSize = 10 * 1024 * 1024
}: { 
  label: string
  file: File | null
  onFileChange: (file: File | null) => void
  accept?: string
  maxSize?: number
}) {
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const selectedFile = e.dataTransfer.files[0]
      if (selectedFile.size > maxSize) {
        toast.error(`File too large. Maximum size is ${maxSize / (1024 * 1024)}MB`)
        return
      }
      onFileChange(selectedFile)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0]
      if (selectedFile.size > maxSize) {
        toast.error(`File too large. Maximum size is ${maxSize / (1024 * 1024)}MB`)
        return
      }
      onFileChange(selectedFile)
    }
  }

  const handleRemove = () => {
    onFileChange(null)
  }

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`
          border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
          ${isDragging ? "border-accent bg-accent/10" : "border-[#2e2e38] hover:border-[#4a4a5a]"}
          bg-[#18181c]
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept={accept}
          onChange={handleFileSelect}
        />
        {file ? (
          <div className="space-y-2">
            <div className="text-sm text-accent flex items-center gap-2">
              <span className="text-lg">📄</span>
              {file.name}
            </div>
            <Button type="button" variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); handleRemove() }} className="text-red-500 hover:text-red-400 hover:bg-red-500/10">
              Remove file
            </Button>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Drag & drop or click to upload</p>
        )}
      </div>
      {file && (
        <p className="text-xs text-muted-foreground">
          Size: {(file.size / 1024).toFixed(0)} KB
        </p>
      )}
    </div>
  )
}
