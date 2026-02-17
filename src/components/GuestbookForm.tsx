'use client'

import { useState } from 'react'
import { Send, User, MessageSquare, CheckCircle } from 'lucide-react'
import { cn } from '@/utils/cn'
import { createGuestMessage } from '@/services/invitation.service'

interface GuestbookFormProps {
  invitationId: string
  onMessageSubmitted?: () => void
  className?: string
}

export default function GuestbookForm({ invitationId, onMessageSubmitted, className }: GuestbookFormProps) {
  const [formData, setFormData] = useState({
    guest_name: '',
    message: '',
    attendance: 'attending' as const,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    try {
      await createGuestMessage({
        invitation_id: invitationId,
        guest_name: formData.guest_name,
        message: formData.message,
        attendance: formData.attendance,
        is_visible: true,
      })

      setIsSuccess(true)
      setFormData({ guest_name: '', message: '', attendance: 'attending' })
      
      setTimeout(() => {
        setIsSuccess(false)
        onMessageSubmitted?.()
      }, 2000)
    } catch (err) {
      setError('Gagal mengirim ucapan. Silakan coba lagi.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
        <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
        <h4 className="text-lg font-semibold text-green-800">Terima Kasih!</h4>
        <p className="text-green-600">Ucapan Anda telah terkirim.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className={cn('space-y-4', className)}>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Nama Anda
        </label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            required
            value={formData.guest_name}
            onChange={(e) => setFormData({ ...formData, guest_name: e.target.value })}
            placeholder="Masukkan nama Anda"
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Ucapan & Doa
        </label>
        <div className="relative">
          <MessageSquare className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <textarea
            required
            rows={4}
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            placeholder="Tulis ucapan dan doa untuk mempelai..."
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all resize-none"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Konfirmasi Kehadiran
        </label>
        <div className="flex flex-wrap gap-3">
          {[
            { value: 'attending', label: 'Hadir', color: 'bg-green-500' },
            { value: 'maybe', label: 'Mungkin', color: 'bg-yellow-500' },
            { value: 'not_attending', label: 'Tidak Hadir', color: 'bg-red-500' },
          ].map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setFormData({ ...formData, attendance: option.value as any })}
              className={cn(
                'px-4 py-2 rounded-lg border-2 transition-all text-sm font-medium',
                formData.attendance === option.value
                  ? `border-transparent text-white ${option.color}`
                  : 'border-gray-200 text-gray-600 hover:border-primary-300'
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-primary-500 hover:bg-primary-600 disabled:bg-primary-300 text-white font-medium py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
      >
        {isSubmitting ? (
          <span>Mengirim...</span>
        ) : (
          <>
            <Send className="w-4 h-4" />
            <span>Kirim Ucapan</span>
          </>
        )}
      </button>
    </form>
  )
}
