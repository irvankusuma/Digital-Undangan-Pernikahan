'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  MapPin,
  Calendar,
  Clock,
  Check,
} from 'lucide-react'
import { cn } from '@/utils/cn'
import {
  getInvitations,
  createInvitation,
  updateInvitation,
  deleteInvitation,
  getAllGuestMessages,
  updateGuestMessageVisibility,
  deleteGuestMessage,
} from '@/services/invitation.service'
import { Invitation, GuestMessage } from '@/types'

export default function InvitationsPage() {
  const router = useRouter()
  const [invitations, setInvitations] = useState<Invitation[]>([])
  const [selectedInvitation, setSelectedInvitation] = useState<Invitation | null>(null)
  const [messages, setMessages] = useState<GuestMessage[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [showMessages, setShowMessages] = useState(false)
  const [formData, setFormData] = useState<Partial<Invitation>>({
    title: '',
    bride_name: '',
    groom_name: '',
    bride_full_name: '',
    groom_full_name: '',
    bride_parents: '',
    groom_parents: '',
    event_date: '',
    event_time: '',
    location: '',
    location_address: '',
    location_map_url: '',
    story: '',
    quote: '',
    gallery: [],
    theme: 'elegant',
    is_active: true,
  })

  useEffect(() => {
    loadInvitations()
  }, [])

  const loadInvitations = async () => {
    try {
      const data = await getInvitations()
      setInvitations(data)
    } catch (error) {
      console.error('Error loading invitations:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const loadMessages = async (invitationId: string) => {
    try {
      const data = await getAllGuestMessages(invitationId)
      setMessages(data)
    } catch (error) {
      console.error('Error loading messages:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (selectedInvitation) {
        await updateInvitation(selectedInvitation.id, formData)
      } else {
        await createInvitation(formData as Omit<Invitation, 'id' | 'created_at' | 'updated_at'>)
      }
      setShowForm(false)
      setSelectedInvitation(null)
      resetForm()
      loadInvitations()
    } catch (error) {
      console.error('Error saving invitation:', error)
      alert('Gagal menyimpan undangan')
    }
  }

  const handleEdit = (invitation: Invitation) => {
    setSelectedInvitation(invitation)
    setFormData({
      ...invitation,
      event_date: invitation.event_date.split('T')[0],
    })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus undangan ini?')) return
    try {
      await deleteInvitation(id)
      loadInvitations()
    } catch (error) {
      console.error('Error deleting invitation:', error)
      alert('Gagal menghapus undangan')
    }
  }

  const handleToggleActive = async (invitation: Invitation) => {
    try {
      await updateInvitation(invitation.id, { is_active: !invitation.is_active })
      loadInvitations()
    } catch (error) {
      console.error('Error toggling active status:', error)
    }
  }

  const handleViewMessages = (invitation: Invitation) => {
    setSelectedInvitation(invitation)
    loadMessages(invitation.id)
    setShowMessages(true)
  }

  const handleToggleMessageVisibility = async (message: GuestMessage) => {
    try {
      await updateGuestMessageVisibility(message.id, !message.is_visible)
      loadMessages(message.invitation_id)
    } catch (error) {
      console.error('Error toggling message visibility:', error)
    }
  }

  const handleDeleteMessage = async (messageId: string, invitationId: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus ucapan ini?')) return
    try {
      await deleteGuestMessage(messageId)
      loadMessages(invitationId)
    } catch (error) {
      console.error('Error deleting message:', error)
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      bride_name: '',
      groom_name: '',
      bride_full_name: '',
      groom_full_name: '',
      bride_parents: '',
      groom_parents: '',
      event_date: '',
      event_time: '',
      location: '',
      location_address: '',
      location_map_url: '',
      story: '',
      quote: '',
      gallery: [],
      theme: 'elegant',
      is_active: true,
    })
  }

  const addGalleryImage = () => {
    const url = prompt('Masukkan URL gambar:')
    if (url) {
      setFormData({
        ...formData,
        gallery: [...(formData.gallery || []), url],
      })
    }
  }

  const removeGalleryImage = (index: number) => {
    setFormData({
      ...formData,
      gallery: formData.gallery?.filter((_, i) => i !== index),
    })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse text-center">
          <div className="w-8 h-8 bg-primary-400 rounded-full mx-auto animate-bounce" />
          <p className="mt-4 text-gray-600">Memuat...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Kelola Undangan</h1>
          <p className="text-gray-500">Buat dan kelola undangan pernikahan</p>
        </div>
        <button
          onClick={() => {
            setSelectedInvitation(null)
            resetForm()
            setShowForm(true)
          }}
          className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Buat Undangan</span>
        </button>
      </div>

      {/* Invitations List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Undangan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Tanggal & Waktu
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {invitations.map((invitation) => (
                <tr key={invitation.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-800">{invitation.title}</p>
                      <p className="text-sm text-gray-500">
                        {invitation.bride_name} & {invitation.groom_name}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-600">
                      <p>{new Date(invitation.event_date).toLocaleDateString('id-ID')}</p>
                      <p>{invitation.event_time}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleToggleActive(invitation)}
                      className={cn(
                        'inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium transition-colors',
                        invitation.is_active
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-600'
                      )}
                    >
                      {invitation.is_active ? (
                        <>
                          <Eye className="w-3 h-3" />
                          <span>Aktif</span>
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-3 h-3" />
                          <span>Nonaktif</span>
                        </>
                      )}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleViewMessages(invitation)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Lihat ucapan"
                      >
                        <span className="sr-only">Ucapan</span>
                        <span className="text-xs font-medium">Ucapan</span>
                      </button>
                      <button
                        onClick={() => handleEdit(invitation)}
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(invitation.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Hapus"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {invitations.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Belum ada undangan</p>
          </div>
        )}
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-800">
                {selectedInvitation ? 'Edit Undangan' : 'Buat Undangan'}
              </h2>
              <button
                onClick={() => setShowForm(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <span className="sr-only">Tutup</span>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Basic Info */}
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-700">Informasi Dasar</h3>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Judul Acara</label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-400"
                      placeholder="Pernikahan..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Nama Pengantin Wanita</label>
                    <input
                      type="text"
                      required
                      value={formData.bride_name}
                      onChange={(e) => setFormData({ ...formData, bride_name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-400"
                      placeholder="Nama panggilan"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Nama Lengkap Pengantin Wanita</label>
                    <input
                      type="text"
                      value={formData.bride_full_name}
                      onChange={(e) => setFormData({ ...formData, bride_full_name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-400"
                      placeholder="Nama lengkap"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Nama Pengantin Pria</label>
                    <input
                      type="text"
                      required
                      value={formData.groom_name}
                      onChange={(e) => setFormData({ ...formData, groom_name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-400"
                      placeholder="Nama panggilan"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Nama Lengkap Pengantin Pria</label>
                    <input
                      type="text"
                      value={formData.groom_full_name}
                      onChange={(e) => setFormData({ ...formData, groom_full_name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-400"
                      placeholder="Nama lengkap"
                    />
                  </div>
                </div>

                {/* Event Details */}
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-700">Detail Acara</h3>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Tanggal</label>
                    <input
                      type="date"
                      required
                      value={formData.event_date}
                      onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Waktu</label>
                    <input
                      type="time"
                      required
                      value={formData.event_time}
                      onChange={(e) => setFormData({ ...formData, event_time: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Lokasi</label>
                    <input
                      type="text"
                      required
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-400"
                      placeholder="Nama tempat"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Alamat Lengkap</label>
                    <textarea
                      value={formData.location_address}
                      onChange={(e) => setFormData({ ...formData, location_address: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-400"
                      rows={2}
                      placeholder="Alamat lengkap..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">URL Google Maps</label>
                    <input
                      type="url"
                      value={formData.location_map_url}
                      onChange={(e) => setFormData({ ...formData, location_map_url: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-400"
                      placeholder="https://maps.google.com/..."
                    />
                  </div>
                </div>
              </div>

              {/* Story & Quote */}
              <div className="mt-6 space-y-4">
                <h3 className="font-medium text-gray-700">Cerita & Kutipan</h3>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Kutipan</label>
                  <input
                    type="text"
                    value={formData.quote}
                    onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-400"
                    placeholder="Kutipan romantis..."
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Cerita</label>
                  <textarea
                    value={formData.story}
                    onChange={(e) => setFormData({ ...formData, story: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-400"
                    rows={4}
                    placeholder="Cerita perjalanan cinta..."
                  />
                </div>
              </div>

              {/* Gallery */}
              <div className="mt-6">
                <h3 className="font-medium text-gray-700 mb-4">Galeri Foto</h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  {formData.gallery?.map((url, index) => (
                    <div key={index} className="relative">
                      <img
                        src={url}
                        alt={`Gallery ${index + 1}`}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeGalleryImage(index)}
                        className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full text-xs"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={addGalleryImage}
                  className="px-4 py-2 border border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-primary-400 hover:text-primary-600 transition-colors"
                >
                  + Tambah Gambar
                </button>
              </div>

              {/* Theme */}
              <div className="mt-6">
                <label className="block text-sm text-gray-600 mb-2">Tema</label>
                <div className="flex gap-3">
                  {['elegant', 'rustic', 'modern', 'traditional'].map((theme) => (
                    <button
                      key={theme}
                      type="button"
                      onClick={() => setFormData({ ...formData, theme: theme as any })}
                      className={cn(
                        'px-4 py-2 rounded-lg border-2 capitalize transition-colors',
                        formData.theme === theme
                          ? 'border-primary-500 bg-primary-50 text-primary-700'
                          : 'border-gray-200 text-gray-600 hover:border-primary-300'
                      )}
                    >
                      {theme}
                    </button>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="mt-8 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors"
                >
                  {selectedInvitation ? 'Simpan Perubahan' : 'Buat Undangan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Messages Modal */}
      {showMessages && selectedInvitation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-800">Ucapan Tamu</h2>
                <p className="text-sm text-gray-500">{selectedInvitation.title}</p>
              </div>
              <button
                onClick={() => setShowMessages(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <span className="sr-only">Tutup</span>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
              {messages.length === 0 ? (
                <p className="text-center text-gray-500 py-8">Belum ada ucapan</p>
              ) : (
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={cn(
                        'p-4 rounded-lg border',
                        message.is_visible
                          ? 'bg-white border-gray-200'
                          : 'bg-gray-50 border-gray-200 opacity-60'
                      )}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium text-gray-800">{message.guest_name}</p>
                          <p className="text-sm text-gray-500">
                            {new Date(message.created_at || '').toLocaleString('id-ID')}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleToggleMessageVisibility(message)}
                            className={cn(
                              'p-2 rounded-lg transition-colors',
                              message.is_visible
                                ? 'text-green-600 hover:bg-green-50'
                                : 'text-gray-400 hover:bg-gray-100'
                            )}
                            title={message.is_visible ? 'Sembunyikan' : 'Tampilkan'}
                          >
                            {message.is_visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                          </button>
                          <button
                            onClick={() => handleDeleteMessage(message.id, message.invitation_id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Hapus"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <p className="mt-3 text-gray-600">{message.message}</p>
                      <p className="mt-2 text-xs text-gray-500 capitalize">
                        Kehadiran: {message.attendance === 'attending' ? 'Hadir' : message.attendance === 'not_attending' ? 'Tidak Hadir' : 'Mungkin'}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
