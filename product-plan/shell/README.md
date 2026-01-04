# Application Shell

## Overview

Chronos uses a top navigation layout with a horizontal header containing the logo, main navigation items, and user menu. On mobile devices, navigation moves to a bottom tab bar for easy thumb access.

## Navigation Structure

| Nav Item | Route | Description |
|----------|-------|-------------|
| Timeline | `/` | Default view — timeline browsing |
| Curate | `/curate` | Query builder and results |
| Discovery | `/discovery` | AI chat interface |
| Collaboration | `/collaboration` | Sharing and permissions |

## User Menu

Located in the top-right corner of the header. Contains:
- User avatar (or initials if no avatar)
- Display name
- Logout action in dropdown menu

## Layout Pattern

- **Header:** Sticky top navigation bar with logo, nav items, and user menu
- **Content:** Full-width main area below header (max-width: 7xl)
- **Mobile Nav:** Fixed bottom tab bar for section navigation

## Responsive Behavior

- **Desktop (≥768px):** Full horizontal navigation in header, user menu dropdown on right
- **Tablet:** Same as desktop with slightly condensed spacing
- **Mobile (<768px):** Minimal header with logo and user menu; bottom tab bar for section navigation

## Design Notes

- Primary color (indigo) used for active nav items and key interactive elements
- Secondary color (amber) available for highlights and hover states
- Neutral color (slate) for backgrounds, borders, and text
- Space Grotesk font for nav items and headings
- Inter font for body text
- Light/dark mode supported via Tailwind dark: variants

## Components Provided

- `AppShell.tsx` — Main layout wrapper with header, content area, and mobile nav
- `MainNav.tsx` — Desktop horizontal navigation
- `UserMenu.tsx` — User avatar and dropdown menu

## Props

### AppShell

| Prop | Type | Description |
|------|------|-------------|
| `children` | `ReactNode` | Content to render in main area |
| `navigationItems` | `NavigationItem[]` | Nav items with label, href, icon, isActive |
| `user` | `{ name, avatarUrl? }` | Current user info |
| `onNavigate` | `(href) => void` | Called when nav item clicked |
| `onLogout` | `() => void` | Called when logout clicked |

### NavigationItem

```typescript
interface NavigationItem {
  label: string      // Display text (e.g., "Timeline")
  href: string       // Route path (e.g., "/")
  icon?: ReactNode   // Icon for mobile tab bar
  isActive?: boolean // Whether this is the current route
}
```

## Usage Example

```tsx
import { AppShell } from './components/AppShell'
import { Clock, Filter, Sparkles, Users } from 'lucide-react'

function App() {
  const navigationItems = [
    { label: 'Timeline', href: '/', icon: <Clock />, isActive: true },
    { label: 'Curate', href: '/curate', icon: <Filter /> },
    { label: 'Discovery', href: '/discovery', icon: <Sparkles /> },
    { label: 'Collaboration', href: '/collaboration', icon: <Users /> },
  ]

  return (
    <AppShell
      navigationItems={navigationItems}
      user={{ name: 'John Doe', avatarUrl: null }}
      onNavigate={(href) => router.push(href)}
      onLogout={() => logout()}
    >
      <YourPageContent />
    </AppShell>
  )
}
```
