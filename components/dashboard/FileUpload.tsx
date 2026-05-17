'use client'

import { useState, useRef } from 'react'
import { motion } from 'framer-motion'

interface FileUploadProps {
  onExtracted: (text: string, filename: string, kind: 'document' | 'transcript') => void
}

const AUDIO_VIDEO_RE = /\.(mp3|mp4|m4a|wav|webm|mpga|mpeg|mov)$/i

export default function FileUpload({ onExtracted }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [isTranscribing, setIsTranscribing] = useState(false)
  const [filename, setFilename] = useState('')
  const [error, setError] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = async (file: File) => {
    setError('')
    setIsUploading(true)
    setIsTranscribing(AUDIO_VIDEO_RE.test(file.name))
    setFilename(file.name)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch('/api/pitch/extract', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to extract text')
      }

      onExtracted(data.text, data.filename, data.kind || 'document')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Upload failed')
      setFilename('')
    } finally {
      setIsUploading(false)
      setIsTranscribing(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }

  const handleClear = () => {
    setFilename('')
    setError('')
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div className="mb-3">
      <label
        onDragOver={(e) => {
          e.preventDefault()
          setIsDragging(true)
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 border-dashed cursor-pointer transition-all duration-150 ${
          isDragging
            ? 'border-brand-500 bg-brand-600/10'
            : filename
            ? 'border-green-500/30 bg-green-600/5'
            : 'border-white/15 bg-white/3 hover:border-brand-500/50 hover:bg-white/5'
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".txt,.md,.docx,.pdf,.mp3,.mp4,.m4a,.wav,.webm,.mov"
          onChange={handleChange}
          className="hidden"
          disabled={isUploading}
        />

        <div
          className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
            filename ? 'bg-green-600/20 text-green-400' : 'bg-brand-600/20 text-brand-400'
          }`}
        >
          {isUploading ? (
            <div className="w-4 h-4 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
          ) : filename ? (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          )}
        </div>

        <div className="flex-1 min-w-0">
          {isUploading ? (
            <>
              <p className="text-sm text-white/70">
                {isTranscribing ? '🎙️ Transcribiendo audio con Whisper...' : 'Extrayendo texto...'}
              </p>
              {isTranscribing && (
                <p className="text-xs text-white/40">Esto puede tomar 10-30s según la duración</p>
              )}
            </>
          ) : filename ? (
            <>
              <p className="text-sm text-white font-medium truncate">{filename}</p>
              <p className="text-xs text-green-400">✓ Texto extraído correctamente</p>
            </>
          ) : (
            <>
              <p className="text-sm text-white/80 font-medium">
                Arrastra un archivo o haz clic para subirlo
              </p>
              <p className="text-xs text-white/40">
                📄 .pdf, .docx, .txt · 🎙️ .mp3, .mp4, .m4a, .wav, .webm
              </p>
            </>
          )}
        </div>

        {filename && !isUploading && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault()
              handleClear()
            }}
            className="text-white/40 hover:text-white p-1 rounded transition-colors flex-shrink-0"
            aria-label="Clear file"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </label>

      {error && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-red-400 text-xs mt-2 flex items-center gap-1"
        >
          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </motion.p>
      )}
    </div>
  )
}
