import { supabase, supabaseAdmin } from '@/lib/supabase'
import { PaymentMethod } from '@/types'
import { v4 as uuidv4 } from 'uuid'

export async function getActivePaymentMethods() {
  const { data, error } = await supabase
    .from('payment_methods')
    .select('*')
    .eq('is_active', true)
    .order('type', { ascending: true })

  if (error) throw error
  return data as PaymentMethod[]
}

export async function getAllPaymentMethods() {
  const { data, error } = await supabaseAdmin
    .from('payment_methods')
    .select('*')
    .order('type', { ascending: true })

  if (error) throw error
  return data as PaymentMethod[]
}

export async function createPaymentMethod(paymentMethod: Omit<PaymentMethod, 'id' | 'created_at'>) {
  const { data, error } = await supabaseAdmin
    .from('payment_methods')
    .insert([{ ...paymentMethod, id: uuidv4() }])
    .select()
    .single()

  if (error) throw error
  return data as PaymentMethod
}

export async function updatePaymentMethod(id: string, paymentMethod: Partial<PaymentMethod>) {
  const { data, error } = await supabaseAdmin
    .from('payment_methods')
    .update(paymentMethod)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data as PaymentMethod
}

export async function deletePaymentMethod(id: string) {
  const { error } = await supabaseAdmin
    .from('payment_methods')
    .delete()
    .eq('id', id)

  if (error) throw error
}
