'use client'

import { useEffect, useState } from 'react'
import { Plus, Edit, Trash2, Play, Check } from 'lucide-react'
import { cn } from '@/utils/cn'
import { getAllSongs, createSong, updateSong, deleteSong, extractYoutubeId } from '@/services/song.service'
import { Song } from '@/types'

export default function SongsPage() {
  const [songs, setSongs] = useState<Song[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [selectedSong, setSelectedSong] = useState<Song | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    artist: '',
    youtube_url: '',
    is_default: false,
    is_active: true,
  })

  useEffect(() => {
    loadSongs()
  }, [])

  const loadSongs = async () => {
    try {
      const data = await getAllSongs()
      setSongs(data)
    } catch (error) {
      console.error('Error loading songs:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const youtubeId = extractYoutubeId(formData.youtube_url)
    if (!youtubeId) {
      alert('URL YouTube tidak valid')
      return
    }

    try {
      if (selectedSong) {
        await updateSong(selectedSong.id, {
          ...formData,
          youtube_id: youtubeId,
        })
      } else {
        await createSong({
          ...formData,
          youtube_id: youtubeId,
        })
      }
      setShowForm(false)
      setSelectedSong(null)
      resetForm()
      loadSongs()
    } catch (error) {
      console.error('Error saving song:', error)
      alert('Gagal menyimpan lagu')
    }
  }

  const handleEdit = (song: Song) => {
    setSelectedSong(song)
    setFormData({
      title: song.title,
      artist: song.artist || '',
      youtube_url: song.youtube_url,
      is_default: song.is_default,
      is_active: song.is_active,
    })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus lagu ini?')) return
    try {
      await deleteSong(id)
      loadSongs()
    } catch (error) {
      console.error('Error deleting song:', error)
      alert('Gagal menghapus lagu')
    }
  }

  const handleSetDefault = async (song: Song) => {
    try {
      await updateSong(song.id, { is_default: !song.is_default })
      loadSongs()
    } catch (error) {
      console.error('Error setting default:', error)
    }
  }

  const handleToggleActive = async (song: Song) => {
    try {
      await updateSong(song.id, { is_active: !song.is_active })
      loadSongs()
    } catch (error) {
      console.error('Error toggling active status:', error)
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      artist: '',
      youtube_url: '',
      is_default: false,
      is_active: true,
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
          <h1 className="text-2xl font-bold text-gray-800">Kelola Lagu</h1>
          <p className="text-gray-500">Tambahkan lagu dari YouTube</p>
        </div>
        <button
          onClick={() => {
            setSelectedSong(null)
            resetForm()
            setShowForm(true)
          }}
          className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Tambah Lagu</span>
        </button>
      </div>

      {/* Songs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {songs.map((song) => (
          <div
            key={song.id}
            className={cn(
              'bg-white rounded-xl p-4 shadow-sm border transition-all',
              song.is_active ? 'border-gray-100' : 'border-gray-200 opacity-60'
            )}
          >
            {/* Thumbnail */}
            <div className="relative aspect-video rounded-lg overflow-hidden mb-4 bg-gray-100">
              <img
                src={`https://img.youtube.com/vi/${song.youtube_id}/mqdefault.jpg`}
                alt={song.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 hover:opacity-100 transition-opacity">
                <a
                  href={song.youtube_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/90 p-3 rounded-full hover:bg-white transition-colors"
                >
                  <Play className="w-6 h-6 text-primary-600" />
                </a>
              </div>
              {song.is_default && (
                <div className="absolute top-2 left-2 bg-primary-500 text-white text-xs px-2 py-1 rounded-full">
                  Default
                </div>
              )}
            </div>

            {/* Info */}
            <div className="mb-4">
              <h3 className="font-semibold text-gray-800 truncate">{song.title}</h3>
              {song.artist && (
                <p className="text-sm text-gray-500">{song.artist}</p>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <button
                  onClick={() => handleSetDefault(song)}
                  className={cn(
                    'p-2 rounded-lg transition-colors',
                    song.is_default
                      ? 'bg-primary-100 text-primary-600'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  )}
                  title={song.is_default ? 'Default' : 'Jadikan default'}
                >
                  <Check className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleEdit(song)}
                  className="p-2 bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
                  title="Edit"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(song.id)}
                  className="p-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                  title="Hapus"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <button
                onClick={() => handleToggleActive(song)}
                className={cn(
                  'text-xs px-2 py-1 rounded-full',
                  song.is_active
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-600'
                )}
              >
                {song.is_active ? 'Aktif' : 'Nonaktif'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {songs.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl">
          <p className="text-gray-500">Belum ada lagu</p>
          <button
            onClick={() => setShowForm(true)}
            className="mt-4 text-primary-600 hover:text-primary-700"
          >
            Tambah lagu pertama
          </button>
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-xl w-full max-w-md">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-800">
                {selectedSong ? 'Edit Lagu' : 'Tambah Lagu'}
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
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Judul Lagu</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-400"
                  placeholder="Judul lagu"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Artis (opsional)</label>
                <input
                  type="text"
                  value={formData.artist}
                  onChange={(e) => setFormData({ ...formData, artist: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-400"
                  placeholder="Nama artis"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">URL YouTube</label>
                <input
                  type="url"
                  required
                  value={formData.youtube_url}
                  onChange={(e) => setFormData({ ...formData, youtube_url: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-400"
                  placeholder="https://youtube.com/watch?v=..."
                />
                <p className="text-xs text-gray-500 mt-1">
                  Contoh: https://www.youtube.com/watch?v=xxxxx
                </p>
              </div>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.is_default}
                    onChange={(e) => setFormData({ ...formData, is_default: e.target.checked })}
                    className="w-4 h-4 text-primary-500 rounded"
                  />
                  <span className="text-sm text-gray-600">Jadikan default</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="w-4 h-4 text-primary-500 rounded"
                  />
                  <span className="text-sm text-gray-600">Aktif</span>
                </label>
              </div>
              <div className="flex justify-end gap-3 pt-4">
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
                  {selectedSong ? 'Simpan' : 'Tambah'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
