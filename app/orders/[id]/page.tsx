'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import ProtectedRoute from '@/components/ProtectedRoute'

export default function OrderDetailPage() {
  return (
    <ProtectedRoute>
      <OrderDetailContent />
    </ProtectedRoute>
  )
}

function OrderDetailContent() {
  const params = useParams()
  const router = useRouter()
  const orderId = params.id as string
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOrder()
  }, [orderId])

  const fetchOrder = async () => {
    try {
      const res = await fetch(`/api/orders/${orderId}`)
      if (res.ok) {
        const data = await res.json()
        setOrder(data)
      } else {
        router.push('/orders')
      }
    } catch (error) {
      console.error('Failed to fetch order:', error)
      router.push('/orders')
    } finally {
      setLoading(false)
    }
  }

  const handleAction = async (action: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      })

      if (res.ok) {
        fetchOrder()
      } else {
        const data = await res.json()
        alert(data.error || 'Action failed')
      }
    } catch (error) {
      alert('An error occurred')
    }
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><div className="spinner h-12 w-12"></div></div>
  }

  if (!order) return null

  const getStatusBadge = (status: string) => {
    const badges: Record<string, string> = {
      PENDING: 'badge-warning',
      ACTIVE: 'badge-info',
      COMPLETED: 'badge-success',
      DISPUTED: 'badge-danger',
      CANCELLED: 'badge bg-gray-100 text-gray-800',
    }
    return badges[status] || 'badge'
  }

  return (
    <div className="page-container">
      <div className="max-w-4xl mx-auto">
        <Link href="/orders" className="text-primary-600 hover:text-primary-700 text-sm font-medium mb-6 block">
          &larr; Back to orders
        </Link>

        <div className="card mb-6">
          <div className="card-header">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="card-title">Order #{order.id.slice(0, 8)}</h1>
                <p className="card-description">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
              </div>
              <span className={getStatusBadge(order.status)}>{order.status}</span>
            </div>
          </div>

          <div className="card-content space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Listing Information</h3>
                <p className="text-lg font-medium text-gray-900">{order.listing?.title || 'N/A'}</p>
                <p className="text-sm text-gray-600 mt-1">Traffic Type: {order.listing?.trafficType || 'N/A'}</p>
                <p className="text-sm text-gray-600">Lane: {order.lane}</p>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Order Details</h3>
                <p className="text-sm text-gray-600">Quantity: <span className="font-medium text-gray-900">{order.quantity?.toLocaleString() || 0} visitors</span></p>
                <p className="text-sm text-gray-600">Total Price: <span className="font-medium text-gray-900">${order.totalPrice?.toFixed(2) || '0.00'}</span></p>
                <p className="text-sm text-gray-600">Destination: <a href={order.destinationUrl} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">{order.destinationUrl}</a></p>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Parties</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">Buyer</p>
                  <p className="font-medium text-gray-900">{order.buyer?.email || 'N/A'}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">Seller</p>
                  <p className="font-medium text-gray-900">{order.seller?.email || 'N/A'}</p>
                </div>
              </div>
            </div>

            {order.trackingUrl && (
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Tracking</h3>
                <a href={order.trackingUrl} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">
                  {order.trackingUrl}
                </a>
              </div>
            )}

            <div className="border-t border-gray-200 pt-6 flex gap-4">
              {order.status === 'ACTIVE' && (
                <>
                  <button onClick={() => handleAction('complete')} className="btn-primary btn-md">
                    Mark Complete
                  </button>
                  <button onClick={() => {
                    const reason = prompt('Enter dispute reason:')
                    if (reason) {
                      fetch('/api/disputes', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ orderId: order.id, reason }),
                      }).then(() => fetchOrder())
                    }
                  }} className="btn-danger btn-md">
                    Open Dispute
                  </button>
                </>
              )}
              {order.status === 'PENDING' && (
                <button onClick={() => handleAction('cancel')} className="btn-outline btn-md">
                  Cancel Order
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
