'use client'

import { useEffect, useState } from 'react'
import { Plus, Edit, Trash2, CreditCard, Wallet, Check } from 'lucide-react'
import { cn } from '@/utils/cn'
import {
  getAllPaymentMethods,
  createPaymentMethod,
  updatePaymentMethod,
  deletePaymentMethod,
} from '@/services/payment.service'
import { PaymentMethod } from '@/types'

export default function PaymentsPage() {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null)
  type PaymentType = 'bank' | 'ewallet'
  
  const [formData, setFormData] = useState<{
    type: PaymentType
    name: string
    account_number: string
    account_name: string
    logo_url: string
    is_active: boolean
  }>({
    type: 'bank',
    name: '',
    account_number: '',
    account_name: '',
    logo_url: '',
    is_active: true,
  })

  useEffect(() => {
    loadPaymentMethods()
  }, [])

  const loadPaymentMethods = async () => {
    try {
      const data = await getAllPaymentMethods()
      setPaymentMethods(data)
    } catch (error) {
      console.error('Error loading payment methods:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (selectedMethod) {
        await updatePaymentMethod(selectedMethod.id, formData)
      } else {
        await createPaymentMethod(formData)
      }
      setShowForm(false)
      setSelectedMethod(null)
      resetForm()
      loadPaymentMethods()
    } catch (error) {
      console.error('Error saving payment method:', error)
      alert('Gagal menyimpan metode pembayaran')
    }
  }

  const handleEdit = (method: PaymentMethod) => {
    setSelectedMethod(method)
    setFormData({
      type: method.type as PaymentType,
      name: method.name,
      account_number: method.account_number,
      account_name: method.account_name,
      logo_url: method.logo_url || '',
      is_active: method.is_active,
    })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus metode pembayaran ini?')) return
    try {
      await deletePaymentMethod(id)
      loadPaymentMethods()
    } catch (error) {
      console.error('Error deleting payment method:', error)
      alert('Gagal menghapus metode pembayaran')
    }
  }

  const handleToggleActive = async (method: PaymentMethod) => {
    try {
      await updatePaymentMethod(method.id, { is_active: !method.is_active })
      loadPaymentMethods()
    } catch (error) {
      console.error('Error toggling active status:', error)
    }
  }

  const resetForm = () => {
    setFormData({
      type: 'bank' as PaymentType,
      name: '',
      account_number: '',
      account_name: '',
      logo_url: '',
      is_active: true,
    })
  }

  const bankMethods = paymentMethods.filter((m) => m.type === 'bank')
  const ewalletMethods = paymentMethods.filter((m) => m.type === 'ewallet')

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

  const PaymentMethodCard = ({ method }: { method: PaymentMethod }) => (
    <div
      className={cn(
        'bg-white rounded-xl p-4 shadow-sm border transition-all',
        method.is_active ? 'border-gray-100' : 'border-gray-200 opacity-60'
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              'w-10 h-10 rounded-lg flex items-center justify-center',
              method.type === 'bank' ? 'bg-blue-100' : 'bg-green-100'
            )}
          >
            {method.type === 'bank' ? (
              <CreditCard className="w-5 h-5 text-blue-600" />
            ) : (
              <Wallet className="w-5 h-5 text-green-600" />
            )}
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">{method.name}</h3>
            <p className="text-sm text-gray-500">{method.account_name}</p>
          </div>
        </div>
        <div className="flex gap-1">
          <button
            onClick={() => handleEdit(method)}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            title="Edit"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDelete(method.id)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Hapus"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-3 mb-3">
        <code className="text-sm font-mono text-gray-700">{method.account_number}</code>
      </div>

      <div className="flex items-center justify-between">
        <button
          onClick={() => handleToggleActive(method)}
          className={cn(
            'text-xs px-2 py-1 rounded-full',
            method.is_active
              ? 'bg-green-100 text-green-700'
              : 'bg-gray-100 text-gray-600'
          )}
        >
          {method.is_active ? 'Aktif' : 'Nonaktif'}
        </button>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Kelola Pembayaran</h1>
          <p className="text-gray-500">Atur rekening bank dan e-wallet</p>
        </div>
        <button
          onClick={() => {
            setSelectedMethod(null)
            resetForm()
            setShowForm(true)
          }}
          className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Tambah</span>
        </button>
      </div>

      {/* Bank Transfer */}
      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <CreditCard className="w-5 h-5" />
          Transfer Bank
        </h2>
        {bankMethods.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {bankMethods.map((method) => (
              <PaymentMethodCard key={method.id} method={method} />
            ))}
          </div>
        ) : (
          <div className="bg-gray-50 rounded-xl p-8 text-center">
            <p className="text-gray-500">Belum ada rekening bank</p>
          </div>
        )}
      </div>

      {/* E-Wallet */}
      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Wallet className="w-5 h-5" />
          E-Wallet
        </h2>
        {ewalletMethods.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {ewalletMethods.map((method) => (
              <PaymentMethodCard key={method.id} method={method} />
            ))}
          </div>
        ) : (
          <div className="bg-gray-50 rounded-xl p-8 text-center">
            <p className="text-gray-500">Belum ada e-wallet</p>
          </div>
        )}
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-xl w-full max-w-md">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-800">
                {selectedMethod ? 'Edit' : 'Tambah'} Metode Pembayaran
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
                <label className="block text-sm text-gray-600 mb-2">Tipe</label>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, type: 'bank' })}
                    className={cn(
                      'flex-1 py-2 px-4 rounded-lg border-2 transition-colors flex items-center justify-center gap-2',
                      formData.type === 'bank'
                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                        : 'border-gray-200 text-gray-600'
                    )}
                  >
                    <CreditCard className="w-4 h-4" />
                    Bank
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, type: 'ewallet' })}
                    className={cn(
                      'flex-1 py-2 px-4 rounded-lg border-2 transition-colors flex items-center justify-center gap-2',
                      formData.type === 'ewallet'
                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                        : 'border-gray-200 text-gray-600'
                    )}
                  >
                    <Wallet className="w-4 h-4" />
                    E-Wallet
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  {formData.type === 'bank' ? 'Nama Bank' : 'Nama E-Wallet'}
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-400"
                  placeholder={formData.type === 'bank' ? 'BCA, BNI, Mandiri...' : 'DANA, OVO, GoPay...'}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Nomor Rekening / ID</label>
                <input
                  type="text"
                  required
                  value={formData.account_number}
                  onChange={(e) => setFormData({ ...formData, account_number: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-400"
                  placeholder="1234567890"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Nama Pemilik</label>
                <input
                  type="text"
                  required
                  value={formData.account_name}
                  onChange={(e) => setFormData({ ...formData, account_name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-400"
                  placeholder="Nama lengkap"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">URL Logo (opsional)</label>
                <input
                  type="url"
                  value={formData.logo_url}
                  onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-400"
                  placeholder="https://..."
                />
              </div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="w-4 h-4 text-primary-500 rounded"
                />
                <span className="text-sm text-gray-600">Aktif</span>
              </label>
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
                  {selectedMethod ? 'Simpan' : 'Tambah'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
