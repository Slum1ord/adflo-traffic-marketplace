'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import ProtectedRoute from '@/components/ProtectedRoute'

export default function DisputesPage() {
  return (
    <ProtectedRoute>
      <DisputesContent />
    </ProtectedRoute>
  )
}

function DisputesContent() {
  const [disputes, setDisputes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDisputes()
  }, [])

  const fetchDisputes = async () => {
    try {
      const res = await fetch('/api/disputes')
      if (res.ok) {
        const data = await res.json()
        setDisputes(data.disputes || [])
      }
    } catch (error) {
      console.error('Failed to fetch disputes:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const badges: Record<string, string> = {
      OPEN: 'badge-warning',
      RESOLVED: 'badge-success',
      REJECTED: 'badge-danger',
    }
    return badges[status] || 'badge'
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><div className="spinner h-12 w-12"></div></div>
  }

  return (
    <div className="page-container">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Disputes</h1>
        <p className="text-gray-600">View and manage order disputes</p>
      </div>

      <div className="card">
        <div className="card-content">
          {disputes.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No disputes found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table">
                <thead className="table-header">
                  <tr>
                    <th className="px-6 py-3">Dispute ID</th>
                    <th className="px-6 py-3">Order</th>
                    <th className="px-6 py-3">Reason</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3">Opened</th>
                    <th className="px-6 py-3">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {disputes.map((dispute: any) => (
                    <tr key={dispute.id} className="table-row">
                      <td className="px-6 py-4 font-mono text-sm">{dispute.id.slice(0, 8)}</td>
                      <td className="px-6 py-4 font-mono text-sm">{dispute.orderId.slice(0, 8)}</td>
                      <td className="px-6 py-4 max-w-xs truncate">{dispute.reason}</td>
                      <td className="px-6 py-4">
                        <span className={getStatusBadge(dispute.status)}>{dispute.status}</span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(dispute.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <Link href={`/orders/${dispute.orderId}`} className="text-primary-600 hover:text-primary-700 font-medium text-sm">
                          View Order
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
