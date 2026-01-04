# Typography Configuration

## Font Families

| Purpose | Font | Usage |
|---------|------|-------|
| **Headings** | Space Grotesk | Page titles, section headers, nav items |
| **Body** | Inter | Body text, form labels, descriptions |
| **Mono** | JetBrains Mono | Code snippets, technical content, timestamps |

## Google Fonts Import

Add to your HTML `<head>`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet">
```

Or import in CSS:

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&family=Space+Grotesk:wght@400;500;600;700&display=swap');
```

## Tailwind Configuration

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        heading: ['Space Grotesk', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
}
```

## Usage Patterns

### Headings

```html
<h1 class="text-3xl font-bold tracking-tight" style="font-family: 'Space Grotesk', sans-serif">
  Page Title
</h1>

<h2 class="text-xl font-semibold" style="font-family: 'Space Grotesk', sans-serif">
  Section Header
</h2>
```

Or with Tailwind config:

```html
<h1 class="font-heading text-3xl font-bold tracking-tight">
  Page Title
</h1>
```

### Body Text

```html
<p class="text-base" style="font-family: 'Inter', sans-serif">
  Regular body text and descriptions use Inter for optimal readability.
</p>
```

### Navigation Items

```html
<nav style="font-family: 'Space Grotesk', sans-serif">
  <a class="text-sm font-medium">Timeline</a>
  <a class="text-sm font-medium">Curate</a>
</nav>
```

### Code & Technical Content

```html
<code class="text-sm" style="font-family: 'JetBrains Mono', monospace">
  const timeline = new Timeline()
</code>

<span class="text-xs text-slate-500" style="font-family: 'JetBrains Mono', monospace">
  2024-01-15T10:30:00Z
</span>
```

## Font Weights

| Weight | Name | Usage |
|--------|------|-------|
| 400 | Regular | Body text, descriptions |
| 500 | Medium | Labels, nav items, buttons |
| 600 | Semibold | Subheadings, emphasis |
| 700 | Bold | Main headings, important text |

## Line Heights

- **Headings:** Use `leading-tight` (1.25) for compact headers
- **Body text:** Use `leading-relaxed` (1.625) for comfortable reading
- **UI labels:** Use default line height

## Letter Spacing

- **Headings:** Use `tracking-tight` (-0.025em) for Space Grotesk
- **Body text:** Default tracking
- **All caps labels:** Use `tracking-wide` (0.025em)
