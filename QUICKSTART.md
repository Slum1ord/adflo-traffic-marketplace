# ADFLO Traffic Marketplace - Quick Start Guide

Get up and running with the ADFLO Traffic Marketplace front-end in minutes.

## 📋 Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Basic knowledge of React and Next.js

## 🚀 Installation

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env

# Run development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see your app.

## 📁 Project Overview

```
ADFLO Traffic Marketplace/
├── app/                    # Next.js 14 App Router pages
│   ├── page.tsx           # Home page
│   ├── layout.tsx         # Root layout
│   ├── auth/              # Authentication pages
│   ├── listings/          # Listing pages
│   ├── dashboard/         # User dashboard
│   ├── orders/            # Order management
│   └── ...
├── components/            # Reusable UI components
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── Navbar.tsx
│   └── ...
├── lib/                   # Utility functions
│   ├── utils.ts
│   ├── auth.ts
│   └── db.ts
├── types/                 # TypeScript type definitions
│   └── index.ts
└── prisma/               # Database schema
    └── schema.prisma
```

## 🎨 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL with Prisma
- **Authentication**: Custom JWT-based auth

## 📝 Development Workflow

### 1. Create a New Page

Create a new file in `app/your-page/page.tsx`:

```tsx
'use client'

export default function YourPage() {
  return (
    <div className="page-container">
      <h1>Your Page</h1>
    </div>
  )
}
```

### 2. Use Components

```tsx
import { Button, Input, Card } from '@/components'

<Card>
  <Input label="Email" />
  <Button>Submit</Button>
</Card>
```

### 3. Fetch Data

```tsx
'use client'

import { useEffect, useState } from 'react'

export default function DataPage() {
  const [data, setData] = useState([])
  
  useEffect(() => {
    fetch('/api/your-endpoint')
      .then(res => res.json())
      .then(setData)
  }, [])
  
  return <div>{/* render data */}</div>
}
```

### 4. Protected Routes

Wrap pages that require authentication:

```tsx
import ProtectedRoute from '@/components/ProtectedRoute'

export default function ProtectedPage() {
  return (
    <ProtectedRoute>
      <YourContent />
    </ProtectedRoute>
  )
}
```

## 🧩 Key Components

### Button
```tsx
<Button variant="primary" size="lg">Click me</Button>
```

### Input
```tsx
<Input 
  label="Email" 
  type="email" 
  error={errors.email}
/>
```

### Card
```tsx
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>Content</CardContent>
</Card>
```

### Alert
```tsx
<Alert type="success" title="Success!">
  Operation completed
</Alert>
```

## 🎯 Common Tasks

### Add a New Component

1. Create file in `components/YourComponent.tsx`
2. Define TypeScript interface for props
3. Implement component
4. Export from `components/index.ts`

```tsx
// components/YourComponent.tsx
interface YourComponentProps {
  title: string
}

export default function YourComponent({ title }: YourComponentProps) {
  return <div>{title}</div>
}

// components/index.ts
export { default as YourComponent } from './YourComponent'
```

### Style with Tailwind

Use Tailwind utility classes:

```tsx
<div className="bg-white rounded-lg shadow-md p-6">
  <h2 className="text-2xl font-bold text-gray-900 mb-4">
    Title
  </h2>
  <p className="text-gray-600">Content</p>
</div>
```

Custom classes are defined in `app/globals.css`:

```tsx
<div className="page-container">
  <button className="btn-primary">Button</button>
</div>
```

### Handle Forms

```tsx
const [formData, setFormData] = useState({ name: '' })
const [errors, setErrors] = useState({})

const handleSubmit = async (e: FormEvent) => {
  e.preventDefault()
  
  // Validate
  if (!formData.name) {
    setErrors({ name: 'Required' })
    return
  }
  
  // Submit
  const res = await fetch('/api/endpoint', {
    method: 'POST',
    body: JSON.stringify(formData),
  })
}

return (
  <form onSubmit={handleSubmit}>
    <Input
      value={formData.name}
      onChange={(e) => setFormData({ name: e.target.value })}
      error={errors.name}
    />
    <Button type="submit">Submit</Button>
  </form>
)
```

### Show Loading States

```tsx
import { Spinner } from '@/components'

if (loading) return <Spinner />

return <div>{data}</div>
```

### Display Notifications

```tsx
import { useToast } from '@/components/Toast'

const { addToast } = useToast()

const handleAction = () => {
  addToast({
    type: 'success',
    message: 'Action completed!',
  })
}
```

## 🎨 Styling Guide

### Colors

- **Primary**: Blue (`bg-primary-600`, `text-primary-600`)
- **Secondary**: Purple (`bg-secondary-600`)
- **Success**: Green (`bg-green-600`)
- **Warning**: Yellow (`bg-yellow-600`)
- **Danger**: Red (`bg-red-600`)

### Spacing

Use Tailwind's spacing scale:
- `p-4` = 1rem padding
- `m-8` = 2rem margin
- `gap-6` = 1.5rem gap

### Responsive Design

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
  {/* Mobile: 1 col, Tablet: 2 cols, Desktop: 3 cols */}
</div>
```

## 🔧 Utilities

```tsx
import { 
  formatCurrency, 
  formatDate, 
  truncate 
} from '@/lib/utils'

formatCurrency(1234.56)  // "$1,234.56"
formatDate(new Date())    // "Dec 27, 2025"
truncate("Long text", 10) // "Long text..."
```

## 📚 Resources

- [Component Guide](./COMPONENT_GUIDE.md) - Detailed component documentation
- [Frontend README](./FRONTEND_README.md) - Full frontend documentation
- [Component Showcase](/showcase) - Live component examples
- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)

## 🐛 Debugging

### Check Browser Console
Press F12 to open DevTools and check for errors

### API Errors
Check Network tab in DevTools for failed requests

### TypeScript Errors
Run `npm run type-check` to check for type errors

### Build Errors
Run `npm run build` to check for production build issues

## 📦 Build & Deploy

```bash
# Production build
npm run build

# Start production server
npm start

# Type checking
npm run type-check

# Linting
npm run lint
```

## 🤝 Contributing

1. Create a new branch for your feature
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## 💡 Tips

- Use TypeScript for better type safety
- Keep components small and focused
- Follow the existing code style
- Add loading states for async operations
- Display helpful error messages
- Test on different screen sizes
- Use semantic HTML for accessibility

## 🆘 Getting Help

- Check the [Component Guide](./COMPONENT_GUIDE.md)
- Visit `/showcase` for live examples
- Review existing pages for patterns
- Check console for error messages

---

Happy coding! 🚀
