'use client'

import { useState, useEffect } from 'react'
import { cn } from '@/utils/cn'

interface CountdownProps {
  targetDate: string
  targetTime?: string
  className?: string
}

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

export default function Countdown({ targetDate, targetTime = '00:00', className }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const [isExpired, setIsExpired] = useState(false)

  useEffect(() => {
    const calculateTimeLeft = () => {
      const targetDateTime = new Date(`${targetDate}T${targetTime}`)
      const now = new Date()
      const difference = targetDateTime.getTime() - now.getTime()

      if (difference <= 0) {
        setIsExpired(true)
        return { days: 0, hours: 0, minutes: 0, seconds: 0 }
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      }
    }

    setTimeLeft(calculateTimeLeft())

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)

    return () => clearInterval(timer)
  }, [targetDate, targetTime])

  const TimeUnit = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center">
      <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-4 min-w-[80px]">
        <span className="text-3xl md:text-4xl font-bold text-primary-600 font-serif">
          {value.toString().padStart(2, '0')}
        </span>
      </div>
      <span className="text-sm text-gray-600 mt-2 font-medium">{label}</span>
    </div>
  )

  if (isExpired) {
    return (
      <div className={cn('text-center py-8', className)}>
        <div className="bg-primary-500 text-white rounded-lg px-8 py-4 inline-block">
          <p className="text-xl font-serif">Acara Telah Dimulai!</p>
        </div>
      </div>
    )
  }

  return (
    <div className={cn('flex flex-wrap justify-center gap-4 md:gap-6', className)}>
      <TimeUnit value={timeLeft.days} label="Hari" />
      <TimeUnit value={timeLeft.hours} label="Jam" />
      <TimeUnit value={timeLeft.minutes} label="Menit" />
      <TimeUnit value={timeLeft.seconds} label="Detik" />
    </div>
  )
}
