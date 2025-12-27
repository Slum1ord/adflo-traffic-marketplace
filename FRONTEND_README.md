# ADFLO Traffic Marketplace - Front-End Documentation

A modern, responsive front-end for the ADFLO Traffic Marketplace built with Next.js 14, TypeScript, and Tailwind CSS.

## 🎨 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Custom component library
- **State Management**: React Hooks
- **API**: RESTful API routes

## 📁 Project Structure

```
app/
├── layout.tsx              # Root layout with navigation and footer
├── page.tsx                # Home/landing page
├── globals.css             # Global styles and Tailwind utilities
├── auth/
│   ├── login/              # Login page
│   └── register/           # Registration page
├── listings/
│   ├── page.tsx            # Browse all listings
│   └── [id]/page.tsx       # Individual listing details
├── dashboard/              # User dashboard
├── orders/
│   ├── page.tsx            # All orders
│   └── [id]/page.tsx       # Order details
├── sellers/
│   ├── page.tsx            # Seller's listings management
│   └── new/page.tsx        # Create new listing
├── buyers/                 # Buyer's dashboard
├── disputes/               # Dispute management
└── admin/                  # Admin panel

components/
├── Navbar.tsx              # Main navigation
├── ListingCard.tsx         # Listing display card
├── ProtectedRoute.tsx      # Route protection wrapper
├── Button.tsx              # Reusable button component
├── Input.tsx               # Form input component
├── Select.tsx              # Dropdown select component
├── Textarea.tsx            # Textarea component
├── Badge.tsx               # Status badges
├── Card.tsx                # Card components
├── Alert.tsx               # Alert/notification component
├── Modal.tsx               # Modal dialog
├── Spinner.tsx             # Loading spinner
├── Stats.tsx               # Statistics display
├── Tabs.tsx                # Tab navigation
├── Pagination.tsx          # Pagination controls
└── EmptyState.tsx          # Empty state placeholder
```

## 🎯 Key Features

### Pages

1. **Landing Page** (`/`)
   - Hero section with marketplace overview
   - Platform statistics
   - Feature highlights
   - Featured listings showcase
   - Call-to-action sections

2. **Authentication** (`/auth/login`, `/auth/register`)
   - User login with email/password
   - Registration with role selection (Buyer/Seller)
   - Form validation
   - Error handling
   - Redirect after authentication

3. **Listings** (`/listings`, `/listings/[id]`)
   - Browse all traffic listings
   - Filter by traffic type, lane, and price
   - Search functionality
   - View detailed listing information
   - Purchase flow with order creation

4. **Dashboard** (`/dashboard`)
   - User profile overview
   - Order statistics
   - Recent activity
   - Role-specific information
   - Quick actions

5. **Orders** (`/orders`, `/orders/[id]`)
   - View all orders (buyer and seller views)
   - Filter by status
   - Order details with tracking
   - Actions (confirm delivery, dispute, etc.)
   - Order history

6. **Seller Pages** (`/sellers`, `/sellers/new`)
   - Manage listings
   - Create new listings
   - Toggle listing status
   - View sales statistics
   - Revenue tracking

7. **Buyers Page** (`/buyers`)
   - Purchase history
   - Active orders
   - Spending statistics

8. **Disputes** (`/disputes`)
   - View all disputes
   - Create new disputes
   - Dispute status tracking

9. **Admin Panel** (`/admin`)
   - Platform statistics
   - Approve pending sellers
   - Resolve disputes
   - User management

### Components

#### UI Components
- **Button**: Multiple variants (primary, secondary, outline, danger, success)
- **Input/Textarea/Select**: Form inputs with validation states
- **Badge**: Status indicators with color variants
- **Card**: Flexible card container with header, content, footer
- **Alert**: Notification messages (success, warning, error, info)
- **Modal**: Dialog overlays
- **Spinner**: Loading indicators
- **Stats**: Statistics display cards
- **Tabs**: Tab navigation
- **Pagination**: Page navigation controls
- **EmptyState**: Placeholder for empty data states

#### Feature Components
- **Navbar**: Responsive navigation with user menu
- **ListingCard**: Traffic listing display
- **ProtectedRoute**: Authentication wrapper

## 🎨 Design System

### Colors

**Primary (Blue)**: Used for main actions, links, and branding
- 600: #0284c7 (main)
- 700: #0369a1 (hover)

**Secondary (Purple)**: Used for accent and secondary actions
- 600: #c026d3 (main)
- 700: #a21caf (hover)

**Status Colors**:
- Success: Green (#10b981)
- Warning: Yellow (#f59e0b)
- Error: Red (#ef4444)
- Info: Blue (#3b82f6)

**Lane Colors**:
- Clean: Green (#10b981)
- Private: Purple (#a855f7)

### Typography
- Font Family: Inter (sans-serif)
- Headings: Bold, various sizes (h1: 4xl, h2: 3xl, h3: 2xl, etc.)
- Body: Base size (16px)

### Spacing
- Consistent use of Tailwind spacing scale (4px base unit)
- Page container: max-w-7xl with responsive padding
- Component spacing: 4, 6, 8 units

## 🔧 Utility Classes

### Custom Tailwind Classes
```css
.btn-primary          # Primary button
.btn-secondary        # Secondary button
.btn-outline          # Outline button
.badge-success        # Success badge
.badge-warning        # Warning badge
.card                 # Card container
.page-container       # Page wrapper
.spinner              # Loading spinner
```

### Animations
- `animate-fade-in`: Fade in animation
- `animate-slide-up`: Slide up animation
- `animation-delay-200/400/600`: Animation delays

## 🚀 Usage

### Creating a New Page

```tsx
'use client'

import ProtectedRoute from '@/components/ProtectedRoute'

export default function MyPage() {
  return (
    <ProtectedRoute>
      <div className="page-container">
        <h1>My Page</h1>
        {/* Your content */}
      </div>
    </ProtectedRoute>
  )
}
```

### Using Components

```tsx
import Button from '@/components/Button'
import Input from '@/components/Input'
import Alert from '@/components/Alert'

<Button variant="primary" size="lg">
  Click Me
</Button>

<Input
  label="Email"
  type="email"
  error={errors.email}
  required
/>

<Alert type="success" title="Success!">
  Your action was completed.
</Alert>
```

### Form Handling

```tsx
const [formData, setFormData] = useState({ email: '', password: '' })
const [errors, setErrors] = useState<Record<string, string>>({})

const handleSubmit = async (e: FormEvent) => {
  e.preventDefault()
  // Validate and submit
}

<form onSubmit={handleSubmit}>
  <Input
    label="Email"
    name="email"
    value={formData.email}
    onChange={(e) => setFormData({...formData, email: e.target.value})}
    error={errors.email}
  />
  <Button type="submit" loading={submitting}>
    Submit
  </Button>
</form>
```

## 📱 Responsive Design

All pages and components are fully responsive:
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

Uses Tailwind's responsive prefixes (sm:, md:, lg:, xl:)

## ♿ Accessibility

- Semantic HTML elements
- ARIA labels where needed
- Keyboard navigation support
- Focus states on interactive elements
- Color contrast compliance

## 🔒 Route Protection

Pages requiring authentication use the `ProtectedRoute` component:

```tsx
<ProtectedRoute requiredRole="SELLER">
  <YourComponent />
</ProtectedRoute>
```

## 📊 State Management

- Local state with `useState`
- Side effects with `useEffect`
- Form handling with controlled components
- API calls with `fetch`

## 🎯 Best Practices

1. **Component Organization**: One component per file
2. **Type Safety**: Use TypeScript interfaces for props
3. **Error Handling**: Display user-friendly error messages
4. **Loading States**: Show spinners during async operations
5. **Validation**: Client-side form validation before submission
6. **Accessibility**: Use semantic HTML and ARIA attributes
7. **Responsive**: Mobile-first approach
8. **Performance**: Use Next.js Image optimization
9. **Code Splitting**: Leverage Next.js automatic code splitting

## 🔄 API Integration

All API routes follow the pattern `/api/[resource]`:
- GET: Fetch data
- POST: Create new resource
- PATCH: Update resource
- DELETE: Remove resource

Example:
```tsx
const fetchListings = async () => {
  const res = await fetch('/api/listings')
  if (res.ok) {
    const data = await res.json()
    setListings(data.listings)
  }
}
```

## 🧪 Testing Considerations

- Test user flows (login, purchase, create listing)
- Validate form inputs
- Test responsive layouts
- Check accessibility
- Verify error handling

## 📝 Future Enhancements

- [ ] Dark mode support
- [ ] Advanced search/filtering
- [ ] Real-time notifications
- [ ] Chart visualizations
- [ ] Export functionality
- [ ] Internationalization (i18n)
- [ ] PWA support
- [ ] Performance monitoring

## 🤝 Contributing

When adding new components:
1. Create TypeScript interfaces for props
2. Add proper documentation
3. Follow existing styling patterns
4. Ensure responsive design
5. Add loading and error states

---

Built with ❤️ for ADFLO Traffic Marketplace
