'use client'

import { useEffect, useState } from 'react'
import { User, Calendar, CheckCircle, XCircle, HelpCircle } from 'lucide-react'
import { cn } from '@/utils/cn'
import { GuestMessage } from '@/types'
import { getGuestMessages } from '@/services/invitation.service'
import { formatDistanceToNow } from 'date-fns'
import { id } from 'date-fns/locale'

interface GuestbookListProps {
  invitationId: string
  refreshTrigger?: number
  className?: string
}

export default function GuestbookList({ invitationId, refreshTrigger = 0, className }: GuestbookListProps) {
  const [messages, setMessages] = useState<GuestMessage[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadMessages()
  }, [invitationId, refreshTrigger])

  const loadMessages = async () => {
    try {
      const data = await getGuestMessages(invitationId)
      setMessages(data)
    } catch (error) {
      console.error('Error loading messages:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getAttendanceIcon = (attendance: string) => {
    switch (attendance) {
      case 'attending':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'not_attending':
        return <XCircle className="w-4 h-4 text-red-500" />
      case 'maybe':
        return <HelpCircle className="w-4 h-4 text-yellow-500" />
      default:
        return null
    }
  }

  const getAttendanceLabel = (attendance: string) => {
    switch (attendance) {
      case 'attending':
        return 'Hadir'
      case 'not_attending':
        return 'Tidak Hadir'
      case 'maybe':
        return 'Mungkin'
      default:
        return ''
    }
  }

  if (isLoading) {
    return (
      <div className={cn('space-y-4', className)}>
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-gray-100 animate-pulse rounded-xl p-4 h-24" />
        ))}
      </div>
    )
  }

  if (messages.length === 0) {
    return (
      <div className={cn('text-center py-8', className)}>
        <div className="bg-primary-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
          <User className="w-8 h-8 text-primary-400" />
        </div>
        <p className="text-gray-500">Belum ada ucapan. Jadilah yang pertama!</p>
      </div>
    )
  }

  return (
    <div className={cn('space-y-4 max-h-[500px] overflow-y-auto pr-2', className)}>
      {messages.map((message) => (
        <div
          key={message.id}
          className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
        >
          <div className="flex items-start gap-3">
            <div className="bg-primary-100 rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0">
              <span className="text-primary-600 font-semibold text-sm">
                {message.guest_name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="font-semibold text-gray-800">{message.guest_name}</h4>
                <span className="text-xs text-gray-400">•</span>
                <span className="text-xs text-gray-500">
                  {formatDistanceToNow(new Date(message.created_at || ''), {
                    addSuffix: true,
                    locale: id,
                  })}
                </span>
              </div>
              <p className="text-gray-600 mt-2 text-sm leading-relaxed">{message.message}</p>
              <div className="flex items-center gap-1 mt-3">
                {getAttendanceIcon(message.attendance)}
                <span className={cn(
                  'text-xs font-medium',
                  message.attendance === 'attending' && 'text-green-600',
                  message.attendance === 'not_attending' && 'text-red-600',
                  message.attendance === 'maybe' && 'text-yellow-600'
                )}>
                  {getAttendanceLabel(message.attendance)}
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
