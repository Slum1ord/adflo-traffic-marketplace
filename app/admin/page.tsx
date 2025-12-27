'use client'

import { useEffect, useState } from 'react'
import ProtectedRoute from '@/components/ProtectedRoute'

export default function AdminPage() {
  return (
    <ProtectedRoute requiredRole="ADMIN">
      <AdminContent />
    </ProtectedRoute>
  )
}

function AdminContent() {
  const [stats, setStats] = useState({ users: 0, listings: 0, orders: 0, disputes: 0, revenue: 0 })
  const [pendingApprovals, setPendingApprovals] = useState([])
  const [pendingDisputes, setPendingDisputes] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    fetchAdminData()
  }, [])

  const fetchAdminData = async () => {
    try {
      const [statsRes, approvalsRes, disputesRes] = await Promise.all([
        fetch('/api/admin/stats'),
        fetch('/api/admin/pending-sellers'),
        fetch('/api/admin/disputes?status=OPEN'),
      ])

      if (statsRes.ok) {
        const data = await statsRes.json()
        setStats(data)
      }

      if (approvalsRes.ok) {
        const data = await approvalsRes.json()
        setPendingApprovals(data.sellers || [])
      }

      if (disputesRes.ok) {
        const data = await disputesRes.json()
        setPendingDisputes(data.disputes || [])
      }
    } catch (error) {
      console.error('Failed to fetch admin data:', error)
    } finally {
      setLoading(false)
    }
  }

  const approveSeller = async (userId: string) => {
    try {
      const res = await fetch(`/api/admin/approve-seller/${userId}`, { method: 'POST' })
      if (res.ok) {
        fetchAdminData()
      }
    } catch (error) {
      console.error('Failed to approve seller:', error)
    }
  }

  const resolveDispute = async (disputeId: string, resolution: string) => {
    try {
      const res = await fetch(`/api/admin/disputes/${disputeId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'RESOLVED', resolution }),
      })
      if (res.ok) {
        fetchAdminData()
      }
    } catch (error) {
      console.error('Failed to resolve dispute:', error)
    }
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><div className="spinner h-12 w-12"></div></div>
  }

  return (
    <div className="page-container">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Panel</h1>
        <p className="text-gray-600">Manage users, listings, and platform settings</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
        <div className="card">
          <div className="card-content p-6">
            <p className="text-sm text-gray-600 mb-1">Total Users</p>
            <p className="text-3xl font-bold text-gray-900">{stats.users}</p>
          </div>
        </div>
        <div className="card">
          <div className="card-content p-6">
            <p className="text-sm text-gray-600 mb-1">Active Listings</p>
            <p className="text-3xl font-bold text-primary-600">{stats.listings}</p>
          </div>
        </div>
        <div className="card">
          <div className="card-content p-6">
            <p className="text-sm text-gray-600 mb-1">Total Orders</p>
            <p className="text-3xl font-bold text-blue-600">{stats.orders}</p>
          </div>
        </div>
        <div className="card">
          <div className="card-content p-6">
            <p className="text-sm text-gray-600 mb-1">Open Disputes</p>
            <p className="text-3xl font-bold text-red-600">{stats.disputes}</p>
          </div>
        </div>
        <div className="card">
          <div className="card-content p-6">
            <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
            <p className="text-3xl font-bold text-green-600">${stats.revenue.toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'overview'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('approvals')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'approvals'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Pending Approvals ({pendingApprovals.length})
            </button>
            <button
              onClick={() => setActiveTab('disputes')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'disputes'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Open Disputes ({pendingDisputes.length})
            </button>
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="card">
          <div className="card-content p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Platform Overview</h2>
            <p className="text-gray-600">Welcome to the ADFLO admin panel. Use the tabs above to manage pending seller approvals and resolve disputes.</p>
          </div>
        </div>
      )}

      {activeTab === 'approvals' && (
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Pending Seller Approvals</h2>
          </div>
          <div className="card-content">
            {pendingApprovals.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No pending approvals</p>
            ) : (
              <div className="space-y-4">
                {pendingApprovals.map((seller: any) => (
                  <div key={seller.id} className="border border-gray-200 rounded-lg p-4 flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{seller.email}</p>
                      <p className="text-sm text-gray-600">Role: {seller.role}</p>
                      <p className="text-sm text-gray-600">Registered: {new Date(seller.createdAt).toLocaleDateString()}</p>
                    </div>
                    <button onClick={() => approveSeller(seller.id)} className="btn-primary btn-sm">
                      Approve
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'disputes' && (
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Open Disputes</h2>
          </div>
          <div className="card-content">
            {pendingDisputes.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No open disputes</p>
            ) : (
              <div className="space-y-4">
                {pendingDisputes.map((dispute: any) => (
                  <div key={dispute.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="mb-4">
                      <p className="font-medium text-gray-900">Order #{dispute.orderId.slice(0, 8)}</p>
                      <p className="text-sm text-gray-600 mt-1">Reason: {dispute.reason}</p>
                      <p className="text-sm text-gray-600">Opened: {new Date(dispute.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          const resolution = prompt('Enter resolution notes:')
                          if (resolution) resolveDispute(dispute.id, resolution)
                        }}
                        className="btn-primary btn-sm"
                      >
                        Resolve
                      </button>
                      <button
                        onClick={() => resolveDispute(dispute.id, 'Rejected by admin')}
                        className="btn-danger btn-sm"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
