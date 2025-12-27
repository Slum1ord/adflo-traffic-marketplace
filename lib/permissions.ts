import { Role, Lane } from '@prisma/client'

export interface User {
  id: string
  email: string
  role: Role
  laneAccess: Lane
  isApproved: boolean
  isBanned: boolean
  sellerProfile?: any
}

export function canAccessLane(user: User, lane: Lane): boolean {
  if (user.isBanned) return false
  if (user.role === 'ADMIN') return true

  // Clean lane is accessible to everyone
  if (lane === 'CLEAN') return true

  // Private lane requires PRIVATE lane access
  if (lane === 'PRIVATE') {
    return user.laneAccess === 'PRIVATE'
  }

  return false
}

export function canCreateListing(user: User): boolean {
  if (user.isBanned) return false
  if (user.role === 'ADMIN') return true

  return (user.role === 'SELLER' || user.role === 'BOTH') &&
         user.isApproved &&
         user.sellerProfile !== null
}

export function canPurchase(user: User): boolean {
  if (user.isBanned) return false

  return user.role === 'BUYER' || user.role === 'BOTH' || user.role === 'ADMIN'
}

export function canManageOrder(user: User, order: any): boolean {
  if (user.isBanned) return false
  if (user.role === 'ADMIN') return true

  return order.buyerId === user.id || order.sellerId === user.id
}

export function canOpenDispute(user: User, order: any): boolean {
  if (user.isBanned) return false
  if (user.role === 'ADMIN') return true

  return (order.buyerId === user.id || order.sellerId === user.id) &&
         order.status === 'ACTIVE'
}

export function canResolveDispute(user: User): boolean {
  return user.role === 'ADMIN' && !user.isBanned
}

export function canApproveSeller(user: User): boolean {
  return user.role === 'ADMIN' && !user.isBanned
}

export function canAccessAdminPanel(user: User): boolean {
  return user.role === 'ADMIN' && !user.isBanned
}

export function canEditListing(user: User, listing: any): boolean {
  if (user.isBanned) return false
  if (user.role === 'ADMIN') return true

  return listing.seller?.userId === user.id
}

export function canViewOrder(user: User, order: any): boolean {
  if (user.isBanned) return false
  if (user.role === 'ADMIN') return true

  return order.buyerId === user.id || order.sellerId === user.id
}

export function getLaneAccessLabel(lane: Lane): string {
  return lane === 'CLEAN' ? 'Clean Traffic' : 'Private Traffic'
}

export function getRoleLabel(role: Role): string {
  const labels: Record<Role, string> = {
    BUYER: 'Buyer',
    SELLER: 'Seller',
    BOTH: 'Buyer & Seller',
    ADMIN: 'Administrator',
  }
  return labels[role]
}
