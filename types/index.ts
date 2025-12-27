// Type definitions for the ADFLO Traffic Marketplace

// Enums from Prisma
export enum Role {
  BUYER = 'BUYER',
  SELLER = 'SELLER',
  BOTH = 'BOTH',
  ADMIN = 'ADMIN',
}

export enum Lane {
  CLEAN = 'CLEAN',
  PRIVATE = 'PRIVATE',
}

export enum OrderStatus {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  DISPUTED = 'DISPUTED',
  CANCELLED = 'CANCELLED',
}

export enum DisputeStatus {
  OPEN = 'OPEN',
  RESOLVED = 'RESOLVED',
  REJECTED = 'REJECTED',
}

export enum TrafficType {
  EMAIL = 'EMAIL',
  SOCIAL = 'SOCIAL',
  NATIVE = 'NATIVE',
  DISPLAY = 'DISPLAY',
  PUSH = 'PUSH',
  MIXED = 'MIXED',
}

// User types
export interface User {
  id: string
  email: string
  role: Role
  laneAccess: Lane
  walletAddress?: string
  isApproved: boolean
  isBanned: boolean
  sellerProfile?: SellerProfile
  createdAt: Date | string
  updatedAt: Date | string
}

export interface SellerProfile {
  id: string
  userId: string
  displayName: string
  bio?: string
  trafficTypes: TrafficType[]
  allowedLanes: Lane[]
  complianceAgreed: boolean
  reputationClean: number
  reputationPrivate: number
  createdAt: Date | string
  updatedAt: Date | string
}

// Listing types
export interface Listing {
  id: string
  sellerId: string
  title: string
  description?: string
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
  createdAt: Date | string
  updatedAt: Date | string
}

export interface ListingWithSeller extends Listing {
  seller: SellerProfile
}

// Order types
export interface Order {
  id: string
  listingId: string
  buyerId: string
  sellerId: string
  quantity: number
  destinationUrl: string
  status: OrderStatus
  totalPrice: number
  platformFee: number
  sellerEarnings: number
  escrowReleased: boolean
  listing?: Listing
  buyer?: User
  seller?: User
  createdAt: Date | string
  updatedAt: Date | string
}

// Dispute types
export interface Dispute {
  id: string
  orderId: string
  reporterId: string
  reason: string
  evidence?: string
  status: DisputeStatus
  resolution?: string
  order?: Order
  reporter?: User
  createdAt: Date | string
  updatedAt: Date | string
}

// Referral types
export interface Referral {
  id: string
  referrerId: string
  referredId: string
  commission: number
  referrer?: User
  referred?: User
  createdAt: Date | string
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

// Form types
export interface LoginFormData {
  email: string
  password: string
}

export interface RegisterFormData {
  email: string
  password: string
  confirmPassword: string
  role: Role
  agreeToTerms: boolean
}

export interface ListingFormData {
  title: string
  description: string
  trafficType: TrafficType
  lane: Lane
  price: string
  minOrder: string
  maxDaily: string
}

export interface OrderFormData {
  quantity: string
  destinationUrl: string
}

export interface DisputeFormData {
  reason: string
  evidence?: string
}

// Dashboard Stats
export interface DashboardStats {
  totalOrders: number
  activeOrders: number
  completedOrders: number
  totalSpent: number
  totalEarned: number
  activeListings: number
  pendingDisputes: number
}

export interface SellerStats {
  totalListings: number
  activeListings: number
  totalSales: number
  totalRevenue: number
}

export interface BuyerStats {
  totalOrders: number
  totalSpent: number
  activeOrders: number
}

export interface AdminStats {
  users: number
  listings: number
  orders: number
  disputes: number
  revenue: number
}

// Filter/Search types
export interface ListingFilters {
  trafficType?: TrafficType | string
  lane?: Lane | string
  minPrice?: number | string
  maxPrice?: number | string
  search?: string
}

export interface OrderFilters {
  status?: OrderStatus | string
  buyer?: boolean
  seller?: boolean
}

// Component prop types
export interface SelectOption {
  value: string
  label: string
}

export interface TabItem {
  id: string
  label: string
  icon?: React.ReactNode
}

export interface StatItem {
  label: string
  value: string | number
  icon?: React.ReactNode
  trend?: {
    value: string
    isPositive: boolean
  }
}

// Utility types
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

export type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never }
export type XOR<T, U> = T | U extends object
  ? (Without<T, U> & U) | (Without<U, T> & T)
  : T | U
