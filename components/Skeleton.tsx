import React from 'react'

interface SkeletonProps {
  variant?: 'text' | 'circular' | 'rectangular'
  width?: string | number
  height?: string | number
  className?: string
}

export default function Skeleton({
  variant = 'text',
  width,
  height,
  className = '',
}: SkeletonProps) {
  const baseClasses = 'animate-pulse bg-gray-200'

  const variantClasses = {
    text: 'h-4 rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-md',
  }

  const style: React.CSSProperties = {}
  if (width) style.width = typeof width === 'number' ? `${width}px` : width
  if (height) style.height = typeof height === 'number' ? `${height}px` : height

  if (variant === 'circular' && !height && width) {
    style.height = style.width
  }

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={style}
    />
  )
}

export function SkeletonCard() {
  return (
    <div className="card p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <Skeleton width="60%" height={24} className="mb-2" />
          <Skeleton width="40%" height={16} />
        </div>
        <Skeleton variant="circular" width={40} height={40} />
      </div>
      <Skeleton width="100%" height={60} className="mb-4" />
      <div className="space-y-2">
        <Skeleton width="100%" height={16} />
        <Skeleton width="100%" height={16} />
        <Skeleton width="80%" height={16} />
      </div>
      <div className="flex gap-3 mt-6">
        <Skeleton width="48%" height={40} />
        <Skeleton width="48%" height={40} />
      </div>
    </div>
  )
}
