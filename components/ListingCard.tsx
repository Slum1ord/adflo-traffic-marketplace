'use client'

import Link from 'next/link'
import { TrafficType, Lane } from '@prisma/client'

interface Listing {
  id: string
  title: string
  description?: string | null
  trafficType: TrafficType
  lane: Lane
  price: number
  minOrder: number
  maxDaily: number
  isActive: boolean
  seller: {
    displayName: string
    reputationClean: number
    reputationPrivate: number
  }
}

interface ListingCardProps {
  listing: Listing
}

const trafficTypeLabels: Record<TrafficType, string> = {
  EMAIL: 'Email',
  SOCIAL: 'Social Media',
  NATIVE: 'Native Ads',
  DISPLAY: 'Display Ads',
  PUSH: 'Push Notifications',
  MIXED: 'Mixed Sources',
}

const laneLabels: Record<Lane, string> = {
  CLEAN: 'Clean',
  PRIVATE: 'Private',
}

const laneBadgeColors: Record<Lane, string> = {
  CLEAN: 'bg-green-100 text-green-800',
  PRIVATE: 'bg-purple-100 text-purple-800',
}

export default function ListingCard({ listing }: ListingCardProps) {
  const reputation = listing.lane === 'CLEAN'
    ? listing.seller.reputationClean
    : listing.seller.reputationPrivate

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-200">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {listing.title}
            </h3>
            <p className="text-sm text-gray-600 mb-3">
              by <span className="font-medium">{listing.seller.displayName}</span>
            </p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${laneBadgeColors[listing.lane]}`}>
              {laneLabels[listing.lane]}
            </span>
            {!listing.isActive && (
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">
                Inactive
              </span>
            )}
          </div>
        </div>

        {listing.description && (
          <p className="text-gray-700 text-sm mb-4 line-clamp-2">
            {listing.description}
          </p>
        )}

        <div className="space-y-3 mb-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Traffic Type:</span>
            <span className="font-medium text-gray-900">
              {trafficTypeLabels[listing.trafficType]}
            </span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Price:</span>
            <span className="font-bold text-primary-600 text-lg">
              ${listing.price.toFixed(2)}
            </span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Min Order:</span>
            <span className="font-medium text-gray-900">
              {listing.minOrder.toLocaleString()} visitors
            </span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Max Daily:</span>
            <span className="font-medium text-gray-900">
              {listing.maxDaily.toLocaleString()} visitors
            </span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Seller Rating:</span>
            <div className="flex items-center">
              <span className="text-yellow-500 mr-1"></span>
              <span className="font-medium text-gray-900">
                {reputation > 0 ? reputation.toFixed(1) : 'New'}
              </span>
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <Link
            href={`/listings/${listing.id}`}
            className="flex-1 px-4 py-2 bg-primary-600 text-white text-center rounded-md hover:bg-primary-700 transition-colors font-medium"
          >
            View Details
          </Link>
          {listing.isActive && (
            <Link
              href={`/listings/${listing.id}?action=buy`}
              className="flex-1 px-4 py-2 bg-secondary-600 text-white text-center rounded-md hover:bg-secondary-700 transition-colors font-medium"
            >
              Buy Now
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
