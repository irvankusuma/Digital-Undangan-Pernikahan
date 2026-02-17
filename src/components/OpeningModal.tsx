'use client'

import { useState, useEffect } from 'react'
import { Volume2, VolumeX } from 'lucide-react'
import { cn } from '@/utils/cn'

interface OpeningModalProps {
  brideName: string
  groomName: string
  onOpen: (withMusic: boolean) => void
  className?: string
}

export default function OpeningModal({ brideName, groomName, onOpen, className }: OpeningModalProps) {
  const [isVisible, setIsVisible] = useState(true)
  const [withMusic, setWithMusic] = useState(true)

  useEffect(() => {
    // Check if user has already opened the invitation
    const hasOpened = sessionStorage.getItem('invitation_opened')
    if (hasOpened) {
      setIsVisible(false)
      onOpen(false)
    }
  }, [onOpen])

  const handleOpen = () => {
    sessionStorage.setItem('invitation_opened', 'true')
    setIsVisible(false)
    onOpen(withMusic)
  }

  if (!isVisible) return null

  return (
    <div className={cn(
      'fixed inset-0 z-50 flex items-center justify-center',
      className
    )}>
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900" />
      
      {/* Decorative Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 border border-white rounded-full" />
        <div className="absolute bottom-20 right-10 w-48 h-48 border border-white rounded-full" />
        <div className="absolute top-1/3 right-1/4 w-24 h-24 border border-white rounded-full" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-md">
        <p className="text-white/80 text-sm uppercase tracking-[0.3em] mb-4">
          Undangan Pernikahan
        </p>
        
        <h1 className="text-4xl md:text-5xl font-serif text-white mb-2">
          {brideName}
        </h1>
        <span className="text-2xl text-white/60 font-serif">&</span>
        <h1 className="text-4xl md:text-5xl font-serif text-white mt-2">
          {groomName}
        </h1>

        <div className="mt-8 space-y-4">
          {/* Music Toggle */}
          <button
            onClick={() => setWithMusic(!withMusic)}
            className="flex items-center justify-center gap-2 text-white/80 hover:text-white transition-colors mx-auto"
          >
            {withMusic ? (
              <>
                <Volume2 className="w-5 h-5" />
                <span className="text-sm">Dengan Musik</span>
              </>
            ) : (
              <>
                <VolumeX className="w-5 h-5" />
                <span className="text-sm">Tanpa Musik</span>
              </>
            )}
          </button>

          {/* Open Button */}
          <button
            onClick={handleOpen}
            className="w-full bg-white text-primary-800 font-semibold py-4 px-8 rounded-full hover:bg-primary-50 transition-colors shadow-lg"
          >
            Buka Undangan
          </button>
        </div>

        <p className="text-white/60 text-sm mt-6">
          Klik tombol di atas untuk membuka undangan
        </p>
      </div>
    </div>
  )
}
