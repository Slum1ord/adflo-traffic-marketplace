'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import ProtectedRoute from '@/components/ProtectedRoute'

export default function SellersPage() {
  return (
    <ProtectedRoute requiredRole="SELLER">
      <SellersContent />
    </ProtectedRoute>
  )
}

function SellersContent() {
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalListings: 0,
    activeListings: 0,
    totalSales: 0,
    totalRevenue: 0,
  })

  useEffect(() => {
    fetchSellerData()
  }, [])

  const fetchSellerData = async () => {
    try {
      const [listingsRes, statsRes] = await Promise.all([
        fetch('/api/listings/my-listings'),
        fetch('/api/sellers/stats'),
      ])

      if (listingsRes.ok) {
        const data = await listingsRes.json()
        setListings(data.listings || [])
      }

      if (statsRes.ok) {
        const data = await statsRes.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Failed to fetch seller data:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleListingStatus = async (listingId: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/listings/${listingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentStatus }),
      })

      if (res.ok) {
        fetchSellerData()
      }
    } catch (error) {
      console.error('Failed to toggle listing status:', error)
    }
  }

  const deleteListing = async (listingId: string) => {
    if (!confirm('Are you sure you want to delete this listing?')) {
      return
    }

    try {
      const res = await fetch(`/api/listings/${listingId}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        fetchSellerData()
      }
    } catch (error) {
      console.error('Failed to delete listing:', error)
    }
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
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Listings</h1>
          <p className="text-gray-600">Manage your traffic listings and track sales</p>
        </div>
        <Link href="/sellers/new" className="btn-primary btn-md">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Create Listing
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <div className="card-content p-6">
            <p className="text-sm text-gray-600 mb-1">Total Listings</p>
            <p className="text-3xl font-bold text-gray-900">{stats.totalListings}</p>
          </div>
        </div>
        <div className="card">
          <div className="card-content p-6">
            <p className="text-sm text-gray-600 mb-1">Active Listings</p>
            <p className="text-3xl font-bold text-green-600">{stats.activeListings}</p>
          </div>
        </div>
        <div className="card">
          <div className="card-content p-6">
            <p className="text-sm text-gray-600 mb-1">Total Sales</p>
            <p className="text-3xl font-bold text-gray-900">{stats.totalSales}</p>
          </div>
        </div>
        <div className="card">
          <div className="card-content p-6">
            <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
            <p className="text-3xl font-bold text-green-600">${stats.totalRevenue.toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* Listings Table */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">All Listings</h2>
        </div>
        <div className="card-content">
          {listings.length === 0 ? (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <p className="mt-4 text-sm text-gray-500">No listings yet</p>
              <Link href="/sellers/new" className="mt-4 inline-block btn-primary btn-md">
                Create Your First Listing
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table">
                <thead className="table-header">
                  <tr>
                    <th className="px-6 py-3">Title</th>
                    <th className="px-6 py-3">Type</th>
                    <th className="px-6 py-3">Lane</th>
                    <th className="px-6 py-3">Price</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3">Orders</th>
                    <th className="px-6 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {listings.map((listing: any) => (
                    <tr key={listing.id} className="table-row">
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium text-gray-900">{listing.title}</div>
                          <div className="text-sm text-gray-500">ID: {listing.id.slice(0, 8)}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm">{listing.trafficType}</td>
                      <td className="px-6 py-4">
                        <span className={`badge ${listing.lane === 'CLEAN' ? 'badge-success' : 'badge-primary'}`}>
                          {listing.lane}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-semibold">${listing.price.toFixed(2)}</td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => toggleListingStatus(listing.id, listing.isActive)}
                          className={`badge ${listing.isActive ? 'badge-success' : 'badge bg-gray-100 text-gray-800'}`}
                        >
                          {listing.isActive ? 'Active' : 'Inactive'}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-sm">{listing._count?.orders || 0}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/listings/${listing.id}`}
                            className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                          >
                            View
                          </Link>
                          <button
                            onClick={() => deleteListing(listing.id)}
                            className="text-red-600 hover:text-red-700 text-sm font-medium"
                          >
                            Delete
                          </button>
                        </div>
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
