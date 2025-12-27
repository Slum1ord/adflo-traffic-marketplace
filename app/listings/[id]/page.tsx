'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'

export default function ListingDetailPage() {
  const params = useParams()
  const router = useRouter()
  const listingId = (params?.id as string) || ''
  const [listing, setListing] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [purchasing, setPurchasing] = useState(false)
  const [orderForm, setOrderForm] = useState({ quantity: '', destinationUrl: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    fetchListing()
  }, [listingId])

  const fetchListing = async () => {
    try {
      const res = await fetch(`/api/listings/${listingId}`)
      if (res.ok) {
        const data = await res.json()
        setListing(data)
      } else {
        router.push('/listings')
      }
    } catch (error) {
      console.error('Failed to fetch listing:', error)
      router.push('/listings')
    } finally {
      setLoading(false)
    }
  }

  const handlePurchase = async (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors: Record<string, string> = {}
    const quantity = parseInt(orderForm.quantity)

    if (!quantity || quantity < listing.minOrder) {
      newErrors.quantity = `Minimum order is ${listing.minOrder} visitors`
    }
    if (quantity > listing.maxDaily) {
      newErrors.quantity = `Maximum daily is ${listing.maxDaily} visitors`
    }
    if (!orderForm.destinationUrl) {
      newErrors.destinationUrl = 'Destination URL is required'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setPurchasing(true)
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ listingId, quantity, destinationUrl: orderForm.destinationUrl }),
      })

      if (res.ok) {
        const data = await res.json()
        router.push(`/orders/${data.order.id}`)
      } else {
        const data = await res.json()
        alert(data.error || 'Failed to create order')
      }
    } catch (error) {
      alert('An error occurred')
    } finally {
      setPurchasing(false)
    }
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><div className="spinner h-12 w-12"></div></div>
  }

  if (!listing) return null

  const totalPrice = orderForm.quantity ? (parseFloat(orderForm.quantity) / 1000) * listing.price : 0

  return (
    <div className="page-container">
      <div className="max-w-5xl mx-auto">
        <Link href="/listings" className="text-primary-600 hover:text-primary-700 text-sm font-medium mb-6 block">
          &larr; Back to listings
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="card mb-6">
              <div className="card-content p-8">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{listing.title}</h1>
                    <p className="text-gray-600">by <span className="font-medium">{listing.seller.displayName}</span></p>
                  </div>
                  <span className={`badge ${listing.lane === 'CLEAN' ? 'badge-success' : 'badge-primary'}`}>
                    {listing.lane}
                  </span>
                </div>

                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-2">Description</h2>
                  <p className="text-gray-700 whitespace-pre-wrap">{listing.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">Traffic Type</p>
                    <p className="font-semibold text-gray-900">{listing.trafficType}</p>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">Price per 1000</p>
                    <p className="font-semibold text-primary-600 text-lg">${listing.price.toFixed(2)}</p>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">Minimum Order</p>
                    <p className="font-semibold text-gray-900">{listing.minOrder.toLocaleString()} visitors</p>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">Max Daily</p>
                    <p className="font-semibold text-gray-900">{listing.maxDaily.toLocaleString()} visitors</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="card sticky top-8">
              <div className="card-header">
                <h3 className="card-title text-lg">Purchase Traffic</h3>
              </div>
              <div className="card-content p-6">
                <form onSubmit={handlePurchase} className="space-y-4">
                  <div className="form-group">
                    <label className="label">Number of Visitors</label>
                    <input
                      type="number"
                      className={`input ${errors.quantity ? 'border-red-500' : ''}`}
                      placeholder={`Min: ${listing.minOrder}`}
                      value={orderForm.quantity}
                      onChange={(e) => {
                        setOrderForm(prev => ({ ...prev, quantity: e.target.value }))
                        setErrors(prev => ({ ...prev, quantity: '' }))
                      }}
                      disabled={purchasing || !listing.isActive}
                    />
                    {errors.quantity && <p className="form-error">{errors.quantity}</p>}
                  </div>

                  <div className="form-group">
                    <label className="label">Destination URL</label>
                    <input
                      type="url"
                      className={`input ${errors.destinationUrl ? 'border-red-500' : ''}`}
                      placeholder="https://example.com"
                      value={orderForm.destinationUrl}
                      onChange={(e) => {
                        setOrderForm(prev => ({ ...prev, destinationUrl: e.target.value }))
                        setErrors(prev => ({ ...prev, destinationUrl: '' }))
                      }}
                      disabled={purchasing || !listing.isActive}
                    />
                    {errors.destinationUrl && <p className="form-error">{errors.destinationUrl}</p>}
                  </div>

                  {totalPrice > 0 && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-600">Subtotal:</span>
                        <span className="font-semibold">${totalPrice.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-600">Platform Fee (5%):</span>
                        <span className="font-semibold">${(totalPrice * 0.05).toFixed(2)}</span>
                      </div>
                      <div className="border-t border-gray-300 pt-2 mt-2">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold">Total:</span>
                          <span className="text-xl font-bold text-primary-600">${(totalPrice * 1.05).toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  <button type="submit" disabled={purchasing || !listing.isActive} className="w-full btn-primary btn-lg disabled:opacity-50">
                    {purchasing ? <><div className="spinner h-5 w-5 mr-2"></div>Processing...</> : listing.isActive ? 'Place Order' : 'Listing Inactive'}
                  </button>

                  <p className="text-xs text-gray-500 text-center">Funds will be held in escrow until delivery is complete</p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
