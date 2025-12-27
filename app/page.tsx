'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import ListingCard from '@/components/ListingCard'

export default function HomePage() {
  const [featuredListings, setFeaturedListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalListings: 0,
    activeSellers: 0,
    totalOrders: 0,
  })

  useEffect(() => {
    fetchFeaturedListings()
    fetchStats()
  }, [])

  const fetchFeaturedListings = async () => {
    try {
      const res = await fetch('/api/listings?limit=6&featured=true')
      if (res.ok) {
        const data = await res.json()
        setFeaturedListings(data.listings || [])
      }
    } catch (error) {
      console.error('Failed to fetch featured listings:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/stats')
      if (res.ok) {
        const data = await res.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    }
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="text-center animate-fade-in">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Welcome to <span className="text-yellow-400">ADFLO</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-100 max-w-3xl mx-auto">
              The Premium Traffic Marketplace for Serious Marketers
            </p>
            <p className="text-lg mb-10 text-primary-200 max-w-2xl mx-auto">
              Buy and sell high-quality traffic from verified sources. Access Clean and Private lanes with full escrow protection.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/listings"
                className="btn-lg bg-white text-primary-700 hover:bg-primary-50 px-8 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
              >
                Browse Listings
              </Link>
              <Link
                href="/auth/register"
                className="btn-lg bg-secondary-600 text-white hover:bg-secondary-700 px-8 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white py-12 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="animate-slide-up">
              <div className="text-4xl font-bold text-primary-600 mb-2">
                {stats.totalListings.toLocaleString()}+
              </div>
              <div className="text-gray-600 font-medium">Active Listings</div>
            </div>
            <div className="animate-slide-up animation-delay-200">
              <div className="text-4xl font-bold text-primary-600 mb-2">
                {stats.activeSellers.toLocaleString()}+
              </div>
              <div className="text-gray-600 font-medium">Verified Sellers</div>
            </div>
            <div className="animate-slide-up animation-delay-400">
              <div className="text-4xl font-bold text-primary-600 mb-2">
                {stats.totalOrders.toLocaleString()}+
              </div>
              <div className="text-gray-600 font-medium">Orders Completed</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose ADFLO?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Built for marketers who demand quality, security, and results.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Secure Escrow</h3>
              <p className="text-gray-600">
                All transactions protected by smart escrow system. Your funds are safe until delivery is confirmed.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-secondary-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-secondary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Quality Traffic</h3>
              <p className="text-gray-600">
                Verified sources only. Choose between Clean lane (mainstream) or Private lane (restricted niches).
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Fair Pricing</h3>
              <p className="text-gray-600">
                Competitive rates with transparent pricing. No hidden fees. Only 5% platform commission.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Listings Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                Featured Listings
              </h2>
              <p className="text-lg text-gray-600">
                Top-rated traffic sources from verified sellers
              </p>
            </div>
            <Link
              href="/listings"
              className="btn-outline hidden sm:inline-flex px-6 py-2 rounded-md font-medium"
            >
              View All
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="spinner h-12 w-12"></div>
            </div>
          ) : featuredListings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredListings.map((listing: any) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg mb-4">No featured listings available at the moment.</p>
              <Link href="/listings" className="btn-primary px-6 py-2 rounded-md">
                Browse All Listings
              </Link>
            </div>
          )}

          <div className="text-center mt-12">
            <Link
              href="/listings"
              className="btn-primary sm:hidden px-6 py-3 rounded-md font-medium"
            >
              View All Listings
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Scale Your Traffic?
          </h2>
          <p className="text-xl mb-8 text-primary-100">
            Join thousands of marketers buying and selling premium traffic on ADFLO
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/register?role=buyer"
              className="btn-lg bg-white text-primary-700 hover:bg-primary-50 px-8 py-3 rounded-lg font-semibold shadow-lg"
            >
              Start Buying
            </Link>
            <Link
              href="/auth/register?role=seller"
              className="btn-lg bg-secondary-800 text-white hover:bg-secondary-900 px-8 py-3 rounded-lg font-semibold shadow-lg"
            >
              Become a Seller
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
