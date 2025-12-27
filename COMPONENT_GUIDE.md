# Component Usage Guide

This guide provides detailed information on how to use each component in the ADFLO Traffic Marketplace UI library.

## Table of Contents

- [Buttons](#buttons)
- [Form Inputs](#form-inputs)
- [Badges](#badges)
- [Cards](#cards)
- [Alerts](#alerts)
- [Modals](#modals)
- [Loading States](#loading-states)
- [Navigation](#navigation)
- [Data Display](#data-display)

---

## Buttons

### Import
```tsx
import Button from '@/components/Button'
// or
import { Button } from '@/components'
```

### Basic Usage
```tsx
<Button>Click me</Button>
```

### Variants
```tsx
<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="danger">Danger</Button>
<Button variant="success">Success</Button>
```

### Sizes
```tsx
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>
```

### States
```tsx
<Button loading>Loading...</Button>
<Button disabled>Disabled</Button>
```

### Props
- `variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'success'`
- `size?: 'sm' | 'md' | 'lg'`
- `loading?: boolean`
- Plus all standard button HTML attributes

---

## Form Inputs

### Input

```tsx
import Input from '@/components/Input'

<Input
  label="Email"
  type="email"
  placeholder="you@example.com"
  error={errors.email}
  helperText="We'll never share your email"
  required
/>
```

### Select

```tsx
import Select from '@/components/Select'

<Select
  label="Country"
  options={[
    { value: 'us', label: 'United States' },
    { value: 'uk', label: 'United Kingdom' },
  ]}
  error={errors.country}
/>
```

### Textarea

```tsx
import Textarea from '@/components/Textarea'

<Textarea
  label="Description"
  rows={4}
  placeholder="Enter description..."
  error={errors.description}
/>
```

---

## Badges

```tsx
import Badge from '@/components/Badge'

<Badge variant="success">Active</Badge>
<Badge variant="warning">Pending</Badge>
<Badge variant="danger">Rejected</Badge>
<Badge variant="info">Processing</Badge>
<Badge variant="clean">Clean</Badge>
<Badge variant="private">Private</Badge>
```

---

## Cards

```tsx
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/Card'

<Card hover>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
  </CardHeader>
  <CardContent>
    <p>Card content goes here</p>
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>
```

### Props
- `padding?: boolean` - Add default padding
- `hover?: boolean` - Add hover effect

---

## Alerts

```tsx
import Alert from '@/components/Alert'

<Alert type="success" title="Success!">
  Your changes have been saved.
</Alert>

<Alert type="warning" title="Warning">
  Please review this information.
</Alert>

<Alert type="error" title="Error">
  Something went wrong.
</Alert>

<Alert 
  type="info" 
  title="Info" 
  onClose={() => console.log('closed')}
>
  Helpful information.
</Alert>
```

---

## Modals

```tsx
import Modal from '@/components/Modal'

const [isOpen, setIsOpen] = useState(false)

<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Modal Title"
  size="md"
>
  <p>Modal content</p>
  <div className="flex justify-end gap-3 mt-4">
    <Button variant="outline" onClick={() => setIsOpen(false)}>
      Cancel
    </Button>
    <Button onClick={handleSave}>Save</Button>
  </div>
</Modal>
```

### Props
- `isOpen: boolean`
- `onClose: () => void`
- `title: string`
- `size?: 'sm' | 'md' | 'lg' | 'xl'`

---

## Loading States

### Spinner

```tsx
import Spinner from '@/components/Spinner'

<Spinner size="sm" />
<Spinner size="md" />
<Spinner size="lg" />
```

### Skeleton

```tsx
import { Skeleton, SkeletonCard } from '@/components/Skeleton'

<Skeleton variant="text" width="60%" />
<Skeleton variant="circular" width={40} height={40} />
<Skeleton variant="rectangular" width="100%" height={200} />

// Pre-built card skeleton
<SkeletonCard />
```

### Progress Bar

```tsx
import ProgressBar from '@/components/ProgressBar'

<ProgressBar 
  value={75} 
  max={100}
  variant="primary"
  showLabel
  size="md"
/>
```

---

## Navigation

### Tabs

```tsx
import Tabs from '@/components/Tabs'

const [activeTab, setActiveTab] = useState('tab1')

const tabs = [
  { id: 'tab1', label: 'Overview' },
  { id: 'tab2', label: 'Settings' },
]

<Tabs 
  tabs={tabs} 
  activeTab={activeTab} 
  onChange={setActiveTab}
/>
```

### Pagination

```tsx
import Pagination from '@/components/Pagination'

const [page, setPage] = useState(1)

<Pagination
  currentPage={page}
  totalPages={10}
  onPageChange={setPage}
/>
```

---

## Data Display

### Stats

```tsx
import Stats from '@/components/Stats'

<Stats
  label="Total Revenue"
  value="$45,231"
  icon={<DollarIcon />}
  trend={{ value: '+12%', isPositive: true }}
/>
```

### Empty State

```tsx
import EmptyState from '@/components/EmptyState'

<EmptyState
  icon={<InboxIcon />}
  title="No items found"
  description="Get started by creating your first item"
  action={{
    label: 'Create Item',
    onClick: handleCreate
  }}
/>
```

---

## Advanced Components

### Toast Notifications

First, wrap your app with the ToastProvider:

```tsx
// app/layout.tsx
import { ToastProvider } from '@/components/Toast'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  )
}
```

Then use the toast hook:

```tsx
import { useToast } from '@/components/Toast'

function MyComponent() {
  const { addToast } = useToast()
  
  const handleSuccess = () => {
    addToast({
      type: 'success',
      message: 'Operation completed successfully!',
      duration: 3000
    })
  }
  
  return <Button onClick={handleSuccess}>Success</Button>
}
```

### Confirm Dialog

```tsx
import ConfirmDialog from '@/components/ConfirmDialog'

const [isOpen, setIsOpen] = useState(false)

<ConfirmDialog
  isOpen={isOpen}
  title="Confirm Delete"
  message="Are you sure you want to delete this item?"
  confirmLabel="Delete"
  cancelLabel="Cancel"
  type="danger"
  onConfirm={handleDelete}
  onCancel={() => setIsOpen(false)}
/>
```

---

## Utility Functions

### Import
```tsx
import {
  formatCurrency,
  formatNumber,
  formatDate,
  formatRelativeTime,
  truncate,
  calculateOrderTotal,
  cn,
} from '@/lib/utils'
```

### Usage Examples

```tsx
// Format currency
formatCurrency(1234.56) // "$1,234.56"

// Format numbers
formatNumber(1000000) // "1,000,000"

// Format dates
formatDate(new Date()) // "Dec 27, 2025"
formatRelativeTime(new Date(Date.now() - 3600000)) // "1 hour ago"

// Truncate text
truncate("Long text here...", 10) // "Long text..."

// Calculate order total
calculateOrderTotal(5000, 10.00, 0.05)
// { subtotal: 50.00, commission: 2.50, total: 52.50 }

// Combine class names
cn('base-class', condition && 'conditional-class', 'another-class')
```

---

## TypeScript Types

Import types for better type safety:

```tsx
import {
  User,
  Listing,
  Order,
  TrafficType,
  Lane,
  OrderStatus,
} from '@/types'

const listing: Listing = {
  id: '123',
  title: 'Premium Traffic',
  trafficType: TrafficType.EMAIL,
  lane: Lane.CLEAN,
  // ...
}
```

---

## Best Practices

1. **Always use TypeScript**: Define proper types for your props and state
2. **Handle loading states**: Show spinners or skeletons while fetching data
3. **Display errors gracefully**: Use Alert or Toast for error messages
4. **Validate forms**: Use the error prop on Input components
5. **Keep components small**: Break down large components into smaller ones
6. **Use semantic HTML**: Maintain accessibility
7. **Responsive design**: Test on different screen sizes
8. **Consistent spacing**: Use Tailwind's spacing scale

---

## Common Patterns

### Form with Validation

```tsx
const [formData, setFormData] = useState({ email: '', password: '' })
const [errors, setErrors] = useState<Record<string, string>>({})
const [loading, setLoading] = useState(false)

const handleSubmit = async (e: FormEvent) => {
  e.preventDefault()
  
  // Validate
  const newErrors: Record<string, string> = {}
  if (!formData.email) newErrors.email = 'Email is required'
  
  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors)
    return
  }
  
  // Submit
  setLoading(true)
  try {
    await submitForm(formData)
    addToast({ type: 'success', message: 'Success!' })
  } catch (error) {
    addToast({ type: 'error', message: 'Failed' })
  } finally {
    setLoading(false)
  }
}

return (
  <form onSubmit={handleSubmit}>
    <Input
      label="Email"
      value={formData.email}
      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
      error={errors.email}
    />
    <Button type="submit" loading={loading}>Submit</Button>
  </form>
)
```

### Data Fetching with Loading

```tsx
const [data, setData] = useState([])
const [loading, setLoading] = useState(true)

useEffect(() => {
  fetchData()
}, [])

const fetchData = async () => {
  setLoading(true)
  try {
    const res = await fetch('/api/data')
    const json = await res.json()
    setData(json.data)
  } catch (error) {
    console.error(error)
  } finally {
    setLoading(false)
  }
}

if (loading) return <Spinner />
if (data.length === 0) return <EmptyState title="No data" />

return <div>{/* render data */}</div>
```

---

For more examples, visit `/showcase` in your application.
