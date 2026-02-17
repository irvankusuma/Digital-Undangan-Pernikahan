'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  Eye,
  MessageSquare,
  Mail,
  Music,
  CreditCard,
  TrendingUp,
  Users,
} from 'lucide-react'
import { getInvitations, getViewStats, getAllGuestMessages } from '@/services/invitation.service'
import { getAllSongs } from '@/services/song.service'
import { getAllPaymentMethods } from '@/services/payment.service'
import { Invitation } from '@/types'

interface DashboardStats {
  totalViews: number
  totalMessages: number
  visibleMessages: number
  hiddenMessages: number
  totalSongs: number
  totalPaymentMethods: number
  activeInvitation: Invitation | null
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalViews: 0,
    totalMessages: 0,
    visibleMessages: 0,
    hiddenMessages: 0,
    totalSongs: 0,
    totalPaymentMethods: 0,
    activeInvitation: null,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      const [invitations, songs, payments] = await Promise.all([
        getInvitations(),
        getAllSongs(),
        getAllPaymentMethods(),
      ])

      const activeInvitation = invitations.find((inv) => inv.is_active)

      let totalViews = 0
      let totalMessages = 0
      let visibleMessages = 0
      let hiddenMessages = 0

      if (activeInvitation) {
        const [views, messages] = await Promise.all([
          getViewStats(activeInvitation.id),
          getAllGuestMessages(activeInvitation.id),
        ])

        totalViews = views
        totalMessages = messages.length
        visibleMessages = messages.filter((m) => m.is_visible).length
        hiddenMessages = messages.filter((m) => !m.is_visible).length
      }

      setStats({
        totalViews,
        totalMessages,
        visibleMessages,
        hiddenMessages,
        totalSongs: songs.length,
        totalPaymentMethods: payments.length,
        activeInvitation: activeInvitation || null,
      })
    } catch (error) {
      console.error('Error loading stats:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const statCards = [
    {
      title: 'Total Views',
      value: stats.totalViews,
      icon: Eye,
      color: 'bg-blue-500',
      href: '/admin/invitations',
    },
    {
      title: 'Total Ucapan',
      value: stats.totalMessages,
      icon: MessageSquare,
      color: 'bg-green-500',
      href: '/admin/invitations',
    },
    {
      title: 'Ucapan Tampil',
      value: stats.visibleMessages,
      icon: Users,
      color: 'bg-purple-500',
      href: '/admin/invitations',
    },
    {
      title: 'Total Lagu',
      value: stats.totalSongs,
      icon: Music,
      color: 'bg-pink-500',
      href: '/admin/songs',
    },
  ]

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse text-center">
          <div className="w-8 h-8 bg-primary-400 rounded-full mx-auto animate-bounce" />
          <p className="mt-4 text-gray-600">Memuat statistik...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-500">Ringkasan data undangan digital</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon
          return (
            <Link
              key={card.title}
              href={card.href}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{card.title}</p>
                  <p className="text-2xl font-bold text-gray-800 mt-1">{card.value}</p>
                </div>
                <div className={`${card.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      {/* Active Invitation */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800">Undangan Aktif</h2>
        </div>
        <div className="p-6">
          {stats.activeInvitation ? (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                  <Mail className="w-8 h-8 text-primary-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">
                    {stats.activeInvitation.title}
                  </h3>
                  <p className="text-gray-500">
                    {stats.activeInvitation.bride_name} & {stats.activeInvitation.groom_name}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500">Tanggal</p>
                  <p className="font-medium text-gray-800">
                    {new Date(stats.activeInvitation.event_date).toLocaleDateString('id-ID')}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500">Waktu</p>
                  <p className="font-medium text-gray-800">{stats.activeInvitation.event_time}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500">Lokasi</p>
                  <p className="font-medium text-gray-800 truncate">
                    {stats.activeInvitation.location}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500">Tema</p>
                  <p className="font-medium text-gray-800 capitalize">
                    {stats.activeInvitation.theme}
                  </p>
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <Link
                  href="/admin/invitations"
                  className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Kelola Undangan
                </Link>
                <Link
                  href="/"
                  target="_blank"
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors"
                >
                  Lihat Undangan
                </Link>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <Mail className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Belum ada undangan aktif</p>
              <Link
                href="/admin/invitations"
                className="inline-block mt-4 bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Buat Undangan
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          href="/admin/songs"
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex items-center gap-4"
        >
          <div className="bg-pink-100 p-3 rounded-lg">
            <Music className="w-6 h-6 text-pink-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">Kelola Lagu</h3>
            <p className="text-sm text-gray-500">{stats.totalSongs} lagu tersimpan</p>
          </div>
        </Link>

        <Link
          href="/admin/payments"
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex items-center gap-4"
        >
          <div className="bg-green-100 p-3 rounded-lg">
            <CreditCard className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">Kelola Pembayaran</h3>
            <p className="text-sm text-gray-500">{stats.totalPaymentMethods} metode tersimpan</p>
          </div>
        </Link>

        <Link
          href="/admin/templates"
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex items-center gap-4"
        >
          <div className="bg-blue-100 p-3 rounded-lg">
            <TrendingUp className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">Template Caption</h3>
            <p className="text-sm text-gray-500">Generate caption otomatis</p>
          </div>
        </Link>
      </div>
    </div>
  )
}
