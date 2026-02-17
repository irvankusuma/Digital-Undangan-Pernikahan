'use client'

import { MapPin, Navigation } from 'lucide-react'
import { cn } from '@/utils/cn'

interface LocationMapProps {
  location: string
  address?: string
  mapUrl?: string
  className?: string
}

export default function LocationMap({ location, address, mapUrl, className }: LocationMapProps) {
  const openMap = () => {
    if (mapUrl) {
      window.open(mapUrl, '_blank')
    }
  }

  const getEmbedUrl = (url: string) => {
    // Convert Google Maps URL to embed URL
    if (url.includes('google.com/maps')) {
      const placeMatch = url.match(/place\/([^/@]+)/)
      if (placeMatch) {
        const place = decodeURIComponent(placeMatch[1].replace(/\+/g, ' '))
        return `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d500!2d0!3d0!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2z!5e0!3m2!1sen!2sid!4v1`
      }
    }
    return url
  }

  return (
    <div className={cn('py-8', className)}>
      <h3 className="text-2xl md:text-3xl font-serif text-center text-gray-800 mb-8">
        Lokasi Acara
      </h3>

      <div className="max-w-2xl mx-auto">
        {/* Location Info */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
          <div className="flex items-start gap-4">
            <div className="bg-primary-100 rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0">
              <MapPin className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 text-lg">{location}</h4>
              {address && (
                <p className="text-gray-600 mt-1">{address}</p>
              )}
            </div>
          </div>

          {mapUrl && (
            <button
              onClick={openMap}
              className="mt-4 w-full bg-primary-500 hover:bg-primary-600 text-white font-medium py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <Navigation className="w-4 h-4" />
              <span>Buka Google Maps</span>
            </button>
          )}
        </div>

        {/* Map Embed */}
        {mapUrl && (
          <div className="rounded-xl overflow-hidden shadow-lg border border-gray-200">
            <iframe
              src={getEmbedUrl(mapUrl)}
              width="100%"
              height="300"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full"
            />
          </div>
        )}
      </div>
    </div>
  )
}
