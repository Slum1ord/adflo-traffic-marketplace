'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import ListingCard from '@/components/ListingCard'

function ListingsContent() {
  const searchParams = useSearchParams()
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    trafficType: searchParams?.get('trafficType') || '',
    lane: searchParams?.get('lane') || '',
    minPrice: searchParams?.get('minPrice') || '',
    maxPrice: searchParams?.get('maxPrice') || '',
    search: searchParams?.get('search') || '',
  })

  useEffect(() => {
    fetchListings()
  }, [filters])

  const fetchListings = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value)
      })

      const res = await fetch(`/api/listings?${params.toString()}`)
      if (res.ok) {
        const data = await res.json()
        setListings(data.listings || [])
      }
    } catch (error) {
      console.error('Failed to fetch listings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const clearFilters = () => {
    setFilters({ trafficType: '', lane: '', minPrice: '', maxPrice: '', search: '' })
  }

  return (
    <div className="page-container">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Browse Listings</h1>
        <p className="text-gray-600">Find the perfect traffic source for your needs</p>
      </div>

      {/* Filters */}
      <div className="card mb-8">
        <div className="card-content p-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <label className="label">Search</label>
              <input
                type="text"
                className="input"
                placeholder="Search listings..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
              />
            </div>
            <div>
              <label className="label">Traffic Type</label>
              <select
                className="select"
                value={filters.trafficType}
                onChange={(e) => handleFilterChange('trafficType', e.target.value)}
              >
                <option value="">All Types</option>
                <option value="EMAIL">Email</option>
                <option value="SOCIAL">Social Media</option>
                <option value="NATIVE">Native Ads</option>
                <option value="DISPLAY">Display Ads</option>
                <option value="PUSH">Push Notifications</option>
                <option value="MIXED">Mixed</option>
              </select>
            </div>
            <div>
              <label className="label">Lane</label>
              <select
                className="select"
                value={filters.lane}
                onChange={(e) => handleFilterChange('lane', e.target.value)}
              >
                <option value="">All Lanes</option>
                <option value="CLEAN">Clean</option>
                <option value="PRIVATE">Private</option>
              </select>
            </div>
            <div>
              <label className="label">Min Price</label>
              <input
                type="number"
                className="input"
                placeholder="$0"
                value={filters.minPrice}
                onChange={(e) => handleFilterChange('minPrice', e.target.value)}
              />
            </div>
            <div>
              <label className="label">Max Price</label>
              <input
                type="number"
                className="input"
                placeholder="$999"
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
              />
            </div>
          </div>
          <div className="mt-4">
            <button onClick={clearFilters} className="btn-outline btn-sm">
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Listings Grid */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="spinner h-12 w-12"></div>
        </div>
      ) : listings.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-500 text-lg">No listings found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((listing: any) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      )}
    </div>
  )
}

export default function ListingsPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
      <ListingsContent />
    </Suspense>
  )
}

