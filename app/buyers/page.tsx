'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import ProtectedRoute from '@/components/ProtectedRoute'

export default function BuyersPage() {
  return (
    <ProtectedRoute>
      <BuyersContent />
    </ProtectedRoute>
  )
}

function BuyersContent() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ totalOrders: 0, totalSpent: 0, activeOrders: 0 })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [ordersRes, statsRes] = await Promise.all([
        fetch('/api/orders?buyer=true'),
        fetch('/api/buyers/stats'),
      ])

      if (ordersRes.ok) {
        const data = await ordersRes.json()
        setOrders(data.orders || [])
      }

      if (statsRes.ok) {
        const data = await statsRes.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Failed to fetch buyer data:', error)
    } finally {
      setLoading(false)
    }
  }

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner h-12 w-12"></div>
      </div>
    )
  }

  return (
    <div className="page-container">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Purchase History</h1>
        <p className="text-gray-600">View all your traffic purchases</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card">
          <div className="card-content p-6">
            <p className="text-sm text-gray-600 mb-1">Total Orders</p>
            <p className="text-3xl font-bold text-gray-900">{stats.totalOrders}</p>
          </div>
        </div>
        <div className="card">
          <div className="card-content p-6">
            <p className="text-sm text-gray-600 mb-1">Total Spent</p>
            <p className="text-3xl font-bold text-primary-600">${stats.totalSpent.toFixed(2)}</p>
          </div>
        </div>
        <div className="card">
          <div className="card-content p-6">
            <p className="text-sm text-gray-600 mb-1">Active Orders</p>
            <p className="text-3xl font-bold text-blue-600">{stats.activeOrders}</p>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h2 className="card-title">All Purchases</h2>
        </div>
        <div className="card-content">
          {orders.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">No purchases yet</p>
              <Link href="/listings" className="btn-primary btn-md">
                Browse Listings
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table">
                <thead className="table-header">
                  <tr>
                    <th className="px-6 py-3">Order ID</th>
                    <th className="px-6 py-3">Listing</th>
                    <th className="px-6 py-3">Quantity</th>
                    <th className="px-6 py-3">Total</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3">Date</th>
                    <th className="px-6 py-3">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order: any) => (
                    <tr key={order.id} className="table-row">
                      <td className="px-6 py-4 font-mono text-sm">{order.id.slice(0, 8)}</td>
                      <td className="px-6 py-4">{order.listing?.title || 'N/A'}</td>
                      <td className="px-6 py-4">{order.quantity.toLocaleString()}</td>
                      <td className="px-6 py-4 font-semibold">${order.totalPrice.toFixed(2)}</td>
                      <td className="px-6 py-4">
                        <span className={getStatusBadge(order.status)}>{order.status}</span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <Link
                          href={`/orders/${order.id}`}
                          className="text-primary-600 hover:text-primary-700 font-medium text-sm"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
