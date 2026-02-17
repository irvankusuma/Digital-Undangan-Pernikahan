'use client'

import { useEffect, useState } from 'react'
import { Plus, Edit, Trash2, Copy, Check, FileText } from 'lucide-react'
import { cn } from '@/utils/cn'
import {
  getTemplateCaptions,
  createTemplateCaption,
  updateTemplateCaption,
  deleteTemplateCaption,
  generateCaption,
} from '@/services/template.service'
import { getInvitations } from '@/services/invitation.service'
import { TemplateCaption, Invitation } from '@/types'

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<TemplateCaption[]>([])
  const [invitations, setInvitations] = useState<Invitation[]>([])
  const [selectedInvitation, setSelectedInvitation] = useState<Invitation | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateCaption | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [previewCaption, setPreviewCaption] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    template: '',
    is_default: false,
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [templatesData, invitationsData] = await Promise.all([
        getTemplateCaptions(),
        getInvitations(),
      ])
      setTemplates(templatesData)
      setInvitations(invitationsData)
      if (invitationsData.length > 0) {
        setSelectedInvitation(invitationsData[0])
      }
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (selectedTemplate && selectedInvitation) {
      setPreviewCaption(generateCaption(selectedTemplate.template, selectedInvitation))
    }
  }, [selectedTemplate, selectedInvitation])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (selectedTemplate) {
        await updateTemplateCaption(selectedTemplate.id, formData)
      } else {
        await createTemplateCaption(formData)
      }
      setShowForm(false)
      setSelectedTemplate(null)
      resetForm()
      loadData()
    } catch (error) {
      console.error('Error saving template:', error)
      alert('Gagal menyimpan template')
    }
  }

  const handleEdit = (template: TemplateCaption) => {
    setSelectedTemplate(template)
    setFormData({
      name: template.name,
      template: template.template,
      is_default: template.is_default,
    })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus template ini?')) return
    try {
      await deleteTemplateCaption(id)
      loadData()
    } catch (error) {
      console.error('Error deleting template:', error)
      alert('Gagal menghapus template')
    }
  }

  const handleCopy = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      template: '',
      is_default: false,
    })
  }

  const insertVariable = (variable: string) => {
    setFormData({
      ...formData,
      template: formData.template + variable,
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
          <h1 className="text-2xl font-bold text-gray-800">Template Caption</h1>
          <p className="text-gray-500">Buat template caption untuk undangan</p>
        </div>
        <button
          onClick={() => {
            setSelectedTemplate(null)
            resetForm()
            setShowForm(true)
          }}
          className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Tambah Template</span>
        </button>
      </div>

      {/* Preview Section */}
      {selectedTemplate && selectedInvitation && (
        <div className="bg-gradient-to-r from-primary-50 to-purple-50 rounded-xl p-6 border border-primary-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Preview</h2>
            <div className="flex items-center gap-3">
              <select
                value={selectedInvitation?.id}
                onChange={(e) => {
                  const inv = invitations.find((i) => i.id === e.target.value)
                  if (inv) setSelectedInvitation(inv)
                }}
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
              >
                {invitations.map((inv) => (
                  <option key={inv.id} value={inv.id}>
                    {inv.title}
                  </option>
                ))}
              </select>
              <button
                onClick={() => handleCopy(previewCaption, 'preview')}
                className={cn(
                  'px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2',
                  copiedId === 'preview'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-white text-primary-600 hover:bg-primary-50'
                )}
              >
                {copiedId === 'preview' ? (
                  <>
                    <Check className="w-4 h-4" />
                    Tersalin
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Salin
                  </>
                )}
              </button>
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 whitespace-pre-wrap text-gray-700">
            {previewCaption}
          </div>
        </div>
      )}

      {/* Templates List */}
      <div className="grid gap-4">
        {templates.map((template) => (
          <div
            key={template.id}
            onClick={() => setSelectedTemplate(template)}
            className={cn(
              'bg-white rounded-xl p-6 shadow-sm border cursor-pointer transition-all',
              selectedTemplate?.id === template.id
                ? 'border-primary-500 ring-2 ring-primary-100'
                : 'border-gray-100 hover:border-primary-300'
            )}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-semibold text-gray-800">{template.name}</h3>
                  {template.is_default && (
                    <span className="bg-primary-100 text-primary-700 text-xs px-2 py-1 rounded-full">
                      Default
                    </span>
                  )}
                </div>
                <p className="text-gray-600 text-sm line-clamp-2">{template.template}</p>
              </div>
              <div className="flex items-center gap-2 ml-4">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    const caption = selectedInvitation
                      ? generateCaption(template.template, selectedInvitation)
                      : template.template
                    handleCopy(caption, template.id)
                  }}
                  className={cn(
                    'p-2 rounded-lg transition-colors',
                    copiedId === template.id
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  )}
                  title="Salin caption"
                >
                  {copiedId === template.id ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleEdit(template)
                  }}
                  className="p-2 bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
                  title="Edit"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDelete(template.id)
                  }}
                  className="p-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                  title="Hapus"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {templates.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl">
          <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Belum ada template</p>
          <button
            onClick={() => setShowForm(true)}
            className="mt-4 text-primary-600 hover:text-primary-700"
          >
            Tambah template pertama
          </button>
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-800">
                {selectedTemplate ? 'Edit Template' : 'Tambah Template'}
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
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Nama Template</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-400"
                    placeholder="Contoh: Template WhatsApp"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-2">Variabel Tersedia</label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      '{{bride_name}}',
                      '{{groom_name}}',
                      '{{bride_full_name}}',
                      '{{groom_full_name}}',
                      '{{event_date}}',
                      '{{event_time}}',
                      '{{location}}',
                      '{{location_address}}',
                      '{{title}}',
                    ].map((variable) => (
                      <button
                        key={variable}
                        type="button"
                        onClick={() => insertVariable(variable)}
                        className="px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-xs text-gray-600 transition-colors"
                      >
                        {variable}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1">Template</label>
                  <textarea
                    required
                    rows={8}
                    value={formData.template}
                    onChange={(e) => setFormData({ ...formData, template: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-400 font-mono text-sm"
                    placeholder="Tulis template caption di sini..."
                  />
                </div>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.is_default}
                    onChange={(e) => setFormData({ ...formData, is_default: e.target.checked })}
                    className="w-4 h-4 text-primary-500 rounded"
                  />
                  <span className="text-sm text-gray-600">Jadikan default</span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-6">
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
                  {selectedTemplate ? 'Simpan' : 'Tambah'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
