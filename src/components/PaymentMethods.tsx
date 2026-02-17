'use client'

import { useState, useEffect } from 'react'
import { Copy, Check, CreditCard, Wallet } from 'lucide-react'
import { cn } from '@/utils/cn'
import { PaymentMethod } from '@/types'
import { getActivePaymentMethods } from '@/services/payment.service'

interface PaymentMethodsProps {
  className?: string
}

export default function PaymentMethods({ className }: PaymentMethodsProps) {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([])
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadPaymentMethods()
  }, [])

  const loadPaymentMethods = async () => {
    try {
      const data = await getActivePaymentMethods()
      setPaymentMethods(data)
    } catch (error) {
      console.error('Error loading payment methods:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  if (isLoading) return null
  if (paymentMethods.length === 0) return null

  const bankAccounts = paymentMethods.filter((p) => p.type === 'bank')
  const ewallets = paymentMethods.filter((p) => p.type === 'ewallet')

  return (
    <div className={cn('py-8', className)}>
      <h3 className="text-2xl md:text-3xl font-serif text-center text-gray-800 mb-4">
        Amplop Digital
      </h3>
      <p className="text-center text-gray-600 mb-8 max-w-md mx-auto">
        Doa restu Anda merupakan karunia yang sangat berarti bagi kami. 
        Namun jika Anda ingin memberikan tanda kasih, Anda dapat menggunakan fitur di bawah ini.
      </p>

      <div className="max-w-md mx-auto space-y-6">
        {/* Bank Accounts */}
        {bankAccounts.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              Transfer Bank
            </h4>
            <div className="space-y-3">
              {bankAccounts.map((method) => (
                <PaymentCard
                  key={method.id}
                  method={method}
                  copiedId={copiedId}
                  onCopy={copyToClipboard}
                />
              ))}
            </div>
          </div>
        )}

        {/* E-Wallets */}
        {ewallets.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Wallet className="w-4 h-4" />
              E-Wallet
            </h4>
            <div className="space-y-3">
              {ewallets.map((method) => (
                <PaymentCard
                  key={method.id}
                  method={method}
                  copiedId={copiedId}
                  onCopy={copyToClipboard}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

interface PaymentCardProps {
  method: PaymentMethod
  copiedId: string | null
  onCopy: (text: string, id: string) => void
}

function PaymentCard({ method, copiedId, onCopy }: PaymentCardProps) {
  const isCopied = copiedId === method.id

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-semibold text-gray-800">{method.name}</p>
          <p className="text-sm text-gray-500">{method.account_name}</p>
        </div>
        {method.logo_url && (
          <div className="w-12 h-12 relative">
            <img
              src={method.logo_url}
              alt={method.name}
              className="w-full h-full object-contain"
            />
          </div>
        )}
      </div>
      <div className="mt-3 flex items-center gap-2">
        <code className="flex-1 bg-gray-50 px-3 py-2 rounded-lg text-sm font-mono text-gray-700">
          {method.account_number}
        </code>
        <button
          onClick={() => onCopy(method.account_number, method.id)}
          className={cn(
            'p-2 rounded-lg transition-colors flex items-center gap-1 text-sm font-medium',
            isCopied
              ? 'bg-green-100 text-green-700'
              : 'bg-primary-50 text-primary-600 hover:bg-primary-100'
          )}
        >
          {isCopied ? (
            <>
              <Check className="w-4 h-4" />
              <span>Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
    </div>
  )
}
