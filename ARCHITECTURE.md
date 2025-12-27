# Component Architecture

Visual guide to the ADFLO component structure and relationships.

## Component Hierarchy

```
App Layout (layout.tsx)
│
├── Navbar
│   ├── Logo/Brand
│   ├── Navigation Links
│   └── User Menu
│
├── Main Content (pages)
│   │
│   ├── Home Page
│   │   ├── Hero Section
│   │   ├── Stats Cards
│   │   ├── Features Grid
│   │   └── Featured Listings
│   │       └── ListingCard[]
│   │
│   ├── Listings Page
│   │   ├── Filters (Select, Input)
│   │   ├── Search Bar (Input)
│   │   ├── Listings Grid
│   │   │   └── ListingCard[]
│   │   └── Pagination
│   │
│   ├── Listing Detail
│   │   ├── Listing Info Card
│   │   ├── Seller Info
│   │   ├── Purchase Form
│   │   │   ├── Input (quantity)
│   │   │   ├── Input (URL)
│   │   │   └── Button (submit)
│   │   └── Stats
│   │
│   ├── Dashboard
│   │   ├── Welcome Card
│   │   ├── Stats Grid
│   │   │   └── Stats[]
│   │   ├── Recent Orders
│   │   │   └── Order Cards[]
│   │   └── Quick Actions (Buttons)
│   │
│   ├── Orders Page
│   │   ├── Filter Tabs
│   │   ├── Orders List
│   │   │   └── Order Cards[]
│   │   └── Pagination
│   │
│   ├── Order Detail
│   │   ├── Order Info Card
│   │   ├── Status Badge
│   │   ├── Timeline
│   │   ├── Actions (Buttons)
│   │   └── Dispute Option
│   │
│   ├── Sellers Page
│   │   ├── Stats Cards
│   │   ├── My Listings Table
│   │   └── Create Button
│   │
│   ├── New Listing
│   │   └── Form Card
│   │       ├── Input (title)
│   │       ├── Textarea (description)
│   │       ├── Select (traffic type)
│   │       ├── Select (lane)
│   │       ├── Input (price)
│   │       └── Button (submit)
│   │
│   ├── Auth Pages
│   │   └── Auth Card
│   │       ├── Input (email)
│   │       ├── Input (password)
│   │       ├── Button (submit)
│   │       └── Alert (errors)
│   │
│   └── Admin Page
│       ├── Stats Grid
│       ├── Pending Approvals
│       ├── Open Disputes
│       └── Actions (Buttons)
│
└── Footer
    └── Footer Links
```

## Component Dependency Map

```
Core Components (No Dependencies)
│
├── Button
├── Input
├── Select
├── Textarea
├── Spinner
├── Badge
└── Alert

Composite Components (Use Core)
│
├── Card
│   └── Uses: (self-contained)
│
├── Modal
│   └── Uses: (self-contained)
│
├── Tabs
│   └── Uses: (self-contained)
│
├── Pagination
│   └── Uses: Button
│
├── EmptyState
│   └── Uses: Button
│
├── ConfirmDialog
│   └── Uses: Button, Modal concepts
│
├── ProgressBar
│   └── Uses: (self-contained)
│
├── Skeleton
│   └── Uses: (self-contained)
│
├── Stats
│   └── Uses: Card
│
└── Toast
    └── Uses: Alert concepts

Feature Components (Use Multiple)
│
├── Navbar
│   └── Uses: Links, User state
│
├── ListingCard
│   └── Uses: Card, Badge, Button
│
├── ProtectedRoute
│   └── Uses: Authentication state
│
└── Forms
    └── Uses: Input, Select, Textarea, Button, Alert
```

## Data Flow

```
User Action
    │
    ├──> Form Input
    │      │
    │      └──> State Update
    │             │
    │             └──> Validation
    │                    │
    │                    └──> API Call
    │                           │
    │                           ├──> Success
    │                           │      └──> Toast/Alert
    │                           │            └──> Navigate
    │                           │
    │                           └──> Error
    │                                  └──> Error Alert
    │                                        └──> Stay on page
    │
    └──> Button Click
           │
           └──> Confirm Dialog?
                  │
                  ├──> Yes ──> Execute Action
                  │
                  └──> No ──> Cancel
```

## Page Components Breakdown

### Landing Page Components Used:
- Hero section (custom)
- Stats (custom component)
- Card
- ListingCard
- Button

### Dashboard Components Used:
- ProtectedRoute
- Card
- Stats
- Badge
- Button
- Alert
- Tabs

### Listings Page Components Used:
- Input (search)
- Select (filters)
- ListingCard
- Pagination
- EmptyState
- Spinner

### Forms Components Used:
- Input
- Select
- Textarea
- Button
- Alert
- Spinner

### Admin Components Used:
- ProtectedRoute
- Card
- Stats
- Button
- Badge
- Tabs
- ConfirmDialog

## Styling Architecture

```
Tailwind CSS
    │
    ├── Base Styles (globals.css @layer base)
    │   ├── Typography
    │   ├── Colors
    │   └── Resets
    │
    ├── Component Styles (@layer components)
    │   ├── .btn-*
    │   ├── .badge-*
    │   ├── .card-*
    │   ├── .alert-*
    │   └── .input
    │
    ├── Utility Classes (@layer utilities)
    │   ├── .page-container
    │   ├── .spinner
    │   └── .animation-delay-*
    │
    └── Component Files
        └── Tailwind Classes (inline)
```

## State Management

```
Local State (useState)
    │
    ├── Form Data
    ├── Loading States
    ├── Error States
    └── UI State (modals, tabs, etc.)

Context (Future Enhancement)
    │
    └── Toast Provider
        └── Global Notifications

Server State (API)
    │
    ├── User Data
    ├── Listings
    ├── Orders
    └── Statistics
```

## Component Size Guide

**Tiny** (< 50 lines)
- Badge
- Spinner
- Button

**Small** (50-100 lines)
- Input
- Select
- Textarea
- Alert
- Stats

**Medium** (100-200 lines)
- Card
- Modal
- Tabs
- Pagination
- EmptyState
- ProgressBar
- Skeleton
- ConfirmDialog

**Large** (200-300 lines)
- Navbar
- ListingCard
- Toast

## Reusability Score

**High** (Used in 5+ places)
- Button ⭐⭐⭐⭐⭐
- Card ⭐⭐⭐⭐⭐
- Badge ⭐⭐⭐⭐⭐
- Input ⭐⭐⭐⭐⭐
- Alert ⭐⭐⭐⭐

**Medium** (Used in 2-4 places)
- Select ⭐⭐⭐
- Tabs ⭐⭐⭐
- Spinner ⭐⭐⭐
- Modal ⭐⭐⭐

**Specific** (Feature-specific)
- ListingCard ⭐⭐
- ProtectedRoute ⭐⭐
- Navbar ⭐
- Toast ⭐

## Testing Strategy

```
Component Level
    │
    ├── Unit Tests
    │   ├── Props validation
    │   ├── State changes
    │   └── Event handlers
    │
    ├── Integration Tests
    │   ├── Form submissions
    │   ├── API calls
    │   └── Navigation
    │
    └── E2E Tests
        ├── User flows
        ├── Purchase flow
        └── Admin actions
```

## Performance Optimization

```
Component Level
    │
    ├── React.memo for expensive renders
    ├── useMemo for calculations
    ├── useCallback for functions
    └── Lazy loading for routes

Build Level
    │
    ├── Code splitting (Next.js automatic)
    ├── Tree shaking
    ├── Image optimization
    └── CSS purging (Tailwind)
```

---

This architecture provides a scalable, maintainable foundation for the ADFLO Traffic Marketplace.
