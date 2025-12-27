'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import ProtectedRoute from '@/components/ProtectedRoute'

export default function NewListingPage() {
  return (
    <ProtectedRoute requiredRole="SELLER">
      <NewListingContent />
    </ProtectedRoute>
  )
}

function NewListingContent() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    trafficType: 'EMAIL',
    lane: 'CLEAN',
    price: '',
    minOrder: '',
    maxDaily: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [generalError, setGeneralError] = useState('')

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required'
    } else if (formData.title.length < 10) {
      newErrors.title = 'Title must be at least 10 characters'
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required'
    } else if (formData.description.length < 50) {
      newErrors.description = 'Description must be at least 50 characters'
    }

    const price = parseFloat(formData.price)
    if (!formData.price || isNaN(price) || price <= 0) {
      newErrors.price = 'Price must be a positive number'
    }

    const minOrder = parseInt(formData.minOrder)
    if (!formData.minOrder || isNaN(minOrder) || minOrder <= 0) {
      newErrors.minOrder = 'Minimum order must be a positive number'
    }

    const maxDaily = parseInt(formData.maxDaily)
    if (!formData.maxDaily || isNaN(maxDaily) || maxDaily <= 0) {
      newErrors.maxDaily = 'Maximum daily must be a positive number'
    }

    if (minOrder && maxDaily && minOrder > maxDaily) {
      newErrors.minOrder = 'Minimum order cannot exceed maximum daily'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setGeneralError('')

    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          minOrder: parseInt(formData.minOrder),
          maxDaily: parseInt(formData.maxDaily),
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setGeneralError(data.error || 'Failed to create listing')
        setLoading(false)
        return
      }

      router.push('/sellers')
    } catch (error) {
      setGeneralError('An unexpected error occurred')
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  return (
    <div className="page-container">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Listing</h1>
          <p className="text-gray-600">Add a new traffic source to the marketplace</p>
        </div>

        {generalError && (
          <div className="alert-error mb-6">
            <p>{generalError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="card">
          <div className="card-content p-6 space-y-6">
            <div className="form-group">
              <label htmlFor="title" className="label">
                Listing Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                className={`input ${errors.title ? 'border-red-500' : ''}`}
                placeholder="e.g., Premium Email Traffic - USA Tier 1"
                value={formData.title}
                onChange={handleChange}
                disabled={loading}
              />
              {errors.title && <p className="form-error">{errors.title}</p>}
            </div>

            <div className="form-group">
              <label htmlFor="description" className="label">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                rows={6}
                className={`textarea ${errors.description ? 'border-red-500' : ''}`}
                placeholder="Describe your traffic source, targeting options, delivery timeframes, and any special features..."
                value={formData.description}
                onChange={handleChange}
                disabled={loading}
              />
              {errors.description && <p className="form-error">{errors.description}</p>}
              <p className="text-xs text-gray-500 mt-1">
                {formData.description.length} characters (minimum 50)
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="form-group">
                <label htmlFor="trafficType" className="label">
                  Traffic Type *
                </label>
                <select
                  id="trafficType"
                  name="trafficType"
                  className="select"
                  value={formData.trafficType}
                  onChange={handleChange}
                  disabled={loading}
                >
                  <option value="EMAIL">Email Traffic</option>
                  <option value="SOCIAL">Social Media</option>
                  <option value="NATIVE">Native Ads</option>
                  <option value="DISPLAY">Display Ads</option>
                  <option value="PUSH">Push Notifications</option>
                  <option value="MIXED">Mixed Sources</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="lane" className="label">
                  Lane *
                </label>
                <select
                  id="lane"
                  name="lane"
                  className="select"
                  value={formData.lane}
                  onChange={handleChange}
                  disabled={loading}
                >
                  <option value="CLEAN">Clean (Mainstream)</option>
                  <option value="PRIVATE">Private (Restricted)</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Clean for mainstream offers, Private for restricted niches
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="form-group">
                <label htmlFor="price" className="label">
                  Price per 1000 visitors *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    step="0.01"
                    className={`input pl-8 ${errors.price ? 'border-red-500' : ''}`}
                    placeholder="0.00"
                    value={formData.price}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>
                {errors.price && <p className="form-error">{errors.price}</p>}
              </div>

              <div className="form-group">
                <label htmlFor="minOrder" className="label">
                  Minimum Order *
                </label>
                <input
                  type="number"
                  id="minOrder"
                  name="minOrder"
                  className={`input ${errors.minOrder ? 'border-red-500' : ''}`}
                  placeholder="1000"
                  value={formData.minOrder}
                  onChange={handleChange}
                  disabled={loading}
                />
                {errors.minOrder && <p className="form-error">{errors.minOrder}</p>}
                <p className="text-xs text-gray-500 mt-1">Visitors per order</p>
              </div>

              <div className="form-group">
                <label htmlFor="maxDaily" className="label">
                  Max Daily Capacity *
                </label>
                <input
                  type="number"
                  id="maxDaily"
                  name="maxDaily"
                  className={`input ${errors.maxDaily ? 'border-red-500' : ''}`}
                  placeholder="10000"
                  value={formData.maxDaily}
                  onChange={handleChange}
                  disabled={loading}
                />
                {errors.maxDaily && <p className="form-error">{errors.maxDaily}</p>}
                <p className="text-xs text-gray-500 mt-1">Max visitors/day</p>
              </div>
            </div>

            <div className="alert-info">
              <p className="text-sm">
                <strong>Note:</strong> Your listing will be reviewed by our team before going live.
                Make sure all information is accurate and compliant with our policies.
              </p>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="btn-primary btn-lg flex-1 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <div className="spinner h-5 w-5 mr-2"></div>
                    Creating...
                  </>
                ) : (
                  'Create Listing'
                )}
              </button>
              <button
                type="button"
                onClick={() => router.back()}
                className="btn-outline btn-lg"
                disabled={loading}
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
