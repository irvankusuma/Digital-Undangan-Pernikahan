'use client'

import { useState, useEffect, useCallback } from 'react'
import { Calendar, Clock, Heart } from 'lucide-react'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'

import OpeningModal from '@/components/OpeningModal'
import Countdown from '@/components/Countdown'
import MusicPlayer from '@/components/MusicPlayer'
import Gallery from '@/components/Gallery'
import GuestbookForm from '@/components/GuestbookForm'
import GuestbookList from '@/components/GuestbookList'
import LocationMap from '@/components/LocationMap'
import PaymentMethods from '@/components/PaymentMethods'

import { getActiveInvitation, logView } from '@/services/invitation.service'
import { getSongs, getDefaultSong } from '@/services/song.service'
import { Invitation, Song } from '@/types'

export default function InvitationPage() {
  const [invitation, setInvitation] = useState<Invitation | null>(null)
  const [songs, setSongs] = useState<Song[]>([])
  const [defaultSong, setDefaultSong] = useState<Song | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showModal, setShowModal] = useState(true)
  const [refreshMessages, setRefreshMessages] = useState(0)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [invitationData, songsData, defaultSongData] = await Promise.all([
        getActiveInvitation(),
        getSongs(),
        getDefaultSong(),
      ])

      setInvitation(invitationData)
      setSongs(songsData)
      setDefaultSong(defaultSongData)

      // Log view if invitation exists
      if (invitationData) {
        await logView({
          invitation_id: invitationData.id,
          visitor_name: undefined,
          ip_address: undefined,
          user_agent: typeof window !== 'undefined' ? navigator.userAgent : undefined,
        })
      }
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleOpen = useCallback((withMusic: boolean) => {
    setShowModal(false)
    // Music will be handled by MusicPlayer component
  }, [])

  const handleMessageSubmitted = () => {
    setRefreshMessages((prev) => prev + 1)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-center">
          <Heart className="w-12 h-12 text-primary-400 mx-auto animate-bounce" />
          <p className="mt-4 text-gray-600">Memuat undangan...</p>
        </div>
      </div>
    )
  }

  if (!invitation) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Heart className="w-12 h-12 text-gray-300 mx-auto" />
          <h1 className="mt-4 text-2xl font-serif text-gray-800">Undangan Tidak Ditemukan</h1>
          <p className="mt-2 text-gray-600">Maaf, undangan yang Anda cari tidak tersedia.</p>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-primary-50 via-white to-primary-50">
      {/* Opening Modal */}
      {showModal && (
        <OpeningModal
          brideName={invitation.bride_name}
          groomName={invitation.groom_name}
          onOpen={handleOpen}
        />
      )}

      {/* Music Player */}
      {!showModal && <MusicPlayer songs={songs} defaultSong={defaultSong} />}

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 py-20">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary-100/50 via-transparent to-primary-200/30" />
          <div className="absolute top-20 left-10 w-64 h-64 bg-primary-200/20 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary-300/20 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 text-center max-w-3xl mx-auto">
          <p className="text-primary-600 text-sm uppercase tracking-[0.3em] mb-6">
            Undangan Pernikahan
          </p>

          <h1 className="text-5xl md:text-7xl font-serif text-gray-800 mb-4">
            {invitation.bride_name}
          </h1>
          <span className="text-3xl md:text-4xl text-primary-400 font-serif">&</span>
          <h1 className="text-5xl md:text-7xl font-serif text-gray-800 mt-4">
            {invitation.groom_name}
          </h1>

          {invitation.quote && (
            <p className="mt-8 text-gray-600 italic max-w-lg mx-auto">
              &ldquo;{invitation.quote}&rdquo;
            </p>
          )}

          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-gray-600">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary-500" />
              <span>
                {format(new Date(invitation.event_date), 'EEEE, d MMMM yyyy', { locale: id })}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary-500" />
              <span>{invitation.event_time}</span>
            </div>
          </div>

          {/* Countdown */}
          <div className="mt-12">
            <Countdown
              targetDate={invitation.event_date}
              targetTime={invitation.event_time}
            />
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-primary-300 rounded-full flex justify-center pt-2">
            <div className="w-1.5 h-3 bg-primary-400 rounded-full" />
          </div>
        </div>
      </section>

      {/* Couple Info Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-serif text-center text-gray-800 mb-12">
            Mempelai
          </h2>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Bride */}
            <div className="text-center">
              <div className="w-32 h-32 mx-auto mb-6 bg-primary-100 rounded-full flex items-center justify-center">
                <span className="text-4xl font-serif text-primary-600">
                  {invitation.bride_name.charAt(0)}
                </span>
              </div>
              <h3 className="text-2xl font-serif text-gray-800">
                {invitation.bride_full_name || invitation.bride_name}
              </h3>
              {invitation.bride_parents && (
                <p className="mt-2 text-gray-500 text-sm">
                  Putri dari<br />
                  {invitation.bride_parents}
                </p>
              )}
            </div>

            {/* Groom */}
            <div className="text-center">
              <div className="w-32 h-32 mx-auto mb-6 bg-primary-100 rounded-full flex items-center justify-center">
                <span className="text-4xl font-serif text-primary-600">
                  {invitation.groom_name.charAt(0)}
                </span>
              </div>
              <h3 className="text-2xl font-serif text-gray-800">
                {invitation.groom_full_name || invitation.groom_name}
              </h3>
              {invitation.groom_parents && (
                <p className="mt-2 text-gray-500 text-sm">
                  Putra dari<br />
                  {invitation.groom_parents}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      {invitation.story && (
        <section className="py-20 px-4 bg-white">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-serif text-gray-800 mb-8">
              Cerita Kami
            </h2>
            <p className="text-gray-600 leading-relaxed whitespace-pre-line">
              {invitation.story}
            </p>
          </div>
        </section>
      )}

      {/* Event Details Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-serif text-center text-gray-800 mb-12">
            Detail Acara
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Akad */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-primary-100 text-center">
              <div className="w-16 h-16 mx-auto mb-6 bg-primary-100 rounded-full flex items-center justify-center">
                <Heart className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-serif text-gray-800 mb-4">Akad Nikah</h3>
              <p className="text-gray-600">
                {format(new Date(invitation.event_date), 'EEEE, d MMMM yyyy', { locale: id })}
              </p>
              <p className="text-primary-600 font-medium mt-2">{invitation.event_time}</p>
              <p className="text-gray-500 mt-4">{invitation.location}</p>
            </div>

            {/* Resepsi */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-primary-100 text-center">
              <div className="w-16 h-16 mx-auto mb-6 bg-primary-100 rounded-full flex items-center justify-center">
                <Calendar className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-serif text-gray-800 mb-4">Resepsi</h3>
              <p className="text-gray-600">
                {format(new Date(invitation.event_date), 'EEEE, d MMMM yyyy', { locale: id })}
              </p>
              <p className="text-primary-600 font-medium mt-2">{invitation.event_time}</p>
              <p className="text-gray-500 mt-4">{invitation.location}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Location Section */}
      <LocationMap
        location={invitation.location}
        address={invitation.location_address}
        mapUrl={invitation.location_map_url}
      />

      {/* Gallery Section */}
      {invitation.gallery && invitation.gallery.length > 0 && (
        <section className="py-20 px-4 bg-white">
          <div className="max-w-6xl mx-auto">
            <Gallery images={invitation.gallery} />
          </div>
        </section>
      )}

      {/* Payment Methods Section */}
      <section className="py-20 px-4 bg-primary-50">
        <div className="max-w-4xl mx-auto">
          <PaymentMethods />
        </div>
      </section>

      {/* Guestbook Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-serif text-center text-gray-800 mb-4">
            Buku Tamu
          </h2>
          <p className="text-center text-gray-600 mb-12">
            Tinggalkan ucapan dan doa untuk mempelai
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Form */}
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-gray-100">
              <h3 className="text-xl font-semibold text-gray-800 mb-6">Kirim Ucapan</h3>
              <GuestbookForm
                invitationId={invitation.id}
                onMessageSubmitted={handleMessageSubmitted}
              />
            </div>

            {/* List */}
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-gray-100">
              <h3 className="text-xl font-semibold text-gray-800 mb-6">Ucapan Tamu</h3>
              <GuestbookList
                invitationId={invitation.id}
                refreshTrigger={refreshMessages}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-primary-900 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <Heart className="w-8 h-8 mx-auto mb-4 text-primary-400" />
          <p className="text-lg font-serif mb-2">
            Terima Kasih
          </p>
          <p className="text-primary-200 text-sm">
            Atas kehadiran dan doa restunya
          </p>
          <div className="mt-8 pt-8 border-t border-primary-800">
            <p className="text-primary-300 text-xs">
              Dibuat dengan ❤️ menggunakan Digital Invitation
            </p>
          </div>
        </div>
      </footer>
    </main>
  )
}
