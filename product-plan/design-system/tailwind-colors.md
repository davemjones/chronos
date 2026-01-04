# Tailwind Color Configuration

## Color Choices

- **Primary:** `indigo` — Used for buttons, links, active states, and key interactive elements
- **Secondary:** `amber` — Used for tags, highlights, warnings, and secondary accents
- **Neutral:** `slate` — Used for backgrounds, text, borders, and general UI chrome

## Tailwind Configuration

If using Tailwind CSS, extend your config to use these color aliases:

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: colors.indigo,
        secondary: colors.amber,
        neutral: colors.slate,
      },
    },
  },
}
```

Or use the built-in color names directly in your classes.

## Usage Examples

### Buttons

```html
<!-- Primary button -->
<button class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg">
  Save Changes
</button>

<!-- Secondary/ghost button -->
<button class="text-indigo-600 hover:bg-indigo-50 px-4 py-2 rounded-lg dark:text-indigo-400 dark:hover:bg-indigo-950">
  Cancel
</button>
```

### Tags/Badges

```html
<!-- Tag badge -->
<span class="bg-amber-100 text-amber-800 px-2 py-1 rounded-full text-xs font-medium dark:bg-amber-900 dark:text-amber-200">
  Technology
</span>
```

### Text

```html
<!-- Heading -->
<h1 class="text-slate-900 dark:text-white font-semibold">
  Page Title
</h1>

<!-- Body text -->
<p class="text-slate-600 dark:text-slate-400">
  Description text here...
</p>

<!-- Muted text -->
<span class="text-slate-500 dark:text-slate-500">
  Secondary info
</span>
```

### Backgrounds

```html
<!-- Page background -->
<div class="bg-slate-50 dark:bg-slate-950">

<!-- Card background -->
<div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">

<!-- Hover state -->
<div class="hover:bg-slate-100 dark:hover:bg-slate-800">
```

### Borders

```html
<!-- Standard border -->
<div class="border border-slate-200 dark:border-slate-800">

<!-- Focus ring -->
<input class="focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20">
```

### Active/Selected States

```html
<!-- Active nav item -->
<button class="bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
  Timeline
</button>

<!-- Selected row -->
<tr class="bg-indigo-50 dark:bg-indigo-950/50">
```

## Dark Mode Pattern

All components support dark mode using Tailwind's `dark:` prefix. The pattern is:

| Element | Light | Dark |
|---------|-------|------|
| Page background | `bg-slate-50` | `dark:bg-slate-950` |
| Card background | `bg-white` | `dark:bg-slate-900` |
| Primary text | `text-slate-900` | `dark:text-white` |
| Secondary text | `text-slate-600` | `dark:text-slate-400` |
| Borders | `border-slate-200` | `dark:border-slate-800` |
| Active accent | `bg-indigo-50` | `dark:bg-indigo-950` |
