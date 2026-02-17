'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { Play, Pause, SkipForward, SkipBack, Music } from 'lucide-react'
import { cn } from '@/utils/cn'
import { Song } from '@/types'

interface MusicPlayerProps {
  songs: Song[]
  defaultSong?: Song | null
  className?: string
}

export default function MusicPlayer({ songs, defaultSong, className }: MusicPlayerProps) {
  const [currentSongIndex, setCurrentSongIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isReady, setIsReady] = useState(false)
  const playerRef = useRef<any>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const activeSongs = songs.length > 0 ? songs : defaultSong ? [defaultSong] : []
  const currentSong = activeSongs[currentSongIndex]

  useEffect(() => {
    // Load YouTube IFrame API
    const tag = document.createElement('script')
    tag.src = 'https://www.youtube.com/iframe_api'
    const firstScriptTag = document.getElementsByTagName('script')[0]
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag)

    // Initialize player when API is ready
    ;(window as any).onYouTubeIframeAPIReady = () => {
      if (currentSong && containerRef.current) {
        initializePlayer(currentSong.youtube_id)
      }
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy()
      }
    }
  }, [])

  useEffect(() => {
    if (currentSong && (window as any).YT && (window as any).YT.Player) {
      initializePlayer(currentSong.youtube_id)
    }
  }, [currentSong])

  const initializePlayer = (videoId: string) => {
    if (playerRef.current) {
      playerRef.current.destroy()
    }

    playerRef.current = new (window as any).YT.Player('youtube-player', {
      videoId,
      playerVars: {
        autoplay: 0,
        controls: 0,
        disablekb: 1,
        fs: 0,
        loop: 1,
        playlist: videoId,
      },
      events: {
        onReady: () => {
          setIsReady(true)
        },
        onStateChange: (event: any) => {
          if (event.data === (window as any).YT.PlayerState.PLAYING) {
            setIsPlaying(true)
          } else if (event.data === (window as any).YT.PlayerState.PAUSED) {
            setIsPlaying(false)
          }
        },
      },
    })
  }

  const togglePlay = useCallback(() => {
    if (!playerRef.current || !isReady) return

    if (isPlaying) {
      playerRef.current.pauseVideo()
    } else {
      playerRef.current.playVideo()
    }
  }, [isPlaying, isReady])

  const nextSong = useCallback(() => {
    if (activeSongs.length <= 1) return
    setCurrentSongIndex((prev) => (prev + 1) % activeSongs.length)
  }, [activeSongs.length])

  const prevSong = useCallback(() => {
    if (activeSongs.length <= 1) return
    setCurrentSongIndex((prev) => (prev - 1 + activeSongs.length) % activeSongs.length)
  }, [activeSongs.length])

  if (activeSongs.length === 0) return null

  return (
    <div className={cn('fixed bottom-4 right-4 z-50', className)}>
      {/* Hidden YouTube Player */}
      <div id="youtube-player" className="hidden" />

      {/* Music Player UI */}
      <div className="bg-white/95 backdrop-blur-md rounded-full shadow-lg border border-primary-100 px-4 py-3 flex items-center gap-3">
        <div className="flex items-center gap-2">
          <Music className="w-5 h-5 text-primary-500 animate-pulse" />
          <span className="text-sm font-medium text-gray-700 max-w-[120px] truncate hidden sm:block">
            {currentSong?.title}
          </span>
        </div>

        <div className="flex items-center gap-1">
          {activeSongs.length > 1 && (
            <button
              onClick={prevSong}
              className="p-2 hover:bg-primary-50 rounded-full transition-colors"
              aria-label="Previous song"
            >
              <SkipBack className="w-4 h-4 text-primary-600" />
            </button>
          )}

          <button
            onClick={togglePlay}
            className="p-3 bg-primary-500 hover:bg-primary-600 rounded-full transition-colors shadow-md"
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 text-white" />
            ) : (
              <Play className="w-5 h-5 text-white ml-0.5" />
            )}
          </button>

          {activeSongs.length > 1 && (
            <button
              onClick={nextSong}
              className="p-2 hover:bg-primary-50 rounded-full transition-colors"
              aria-label="Next song"
            >
              <SkipForward className="w-4 h-4 text-primary-600" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

// Add TypeScript declarations for YouTube API
declare global {
  interface Window {
    YT: any
    onYouTubeIframeAPIReady: () => void
  }
}
