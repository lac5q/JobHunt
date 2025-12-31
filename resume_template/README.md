# Hero Section Design System

A reusable, production-ready hero component built with React. Features an outline card style, serif typography, and staggered fade animations.

---

## 📋 Design Specifications

### Layout
| Property | Value |
|----------|-------|
| Layout Type | List (vertically stacked) |
| Framing | Card with padding & shadow |
| Visual Style | Outline (1px borders, minimal fills) |
| Mode | Light |

### Colors
| Token | Value | Usage |
|-------|-------|-------|
| `background.page` | `#fafafa` | Page background |
| `background.card` | `#ffffff` | Card background |
| `text.primary` | `#18181b` | Headings, emphasis |
| `text.secondary` | `#71717a` | Body text |
| `border.default` | `#e4e4e7` | Card borders |
| `border.hover` | `#18181b` | Hover state borders |

### Typography
| Element | Font | Size | Weight | Letter Spacing |
|---------|------|------|--------|----------------|
| Heading (H1) | Playfair Display | 32-40px | 500 (medium) | 0.025em (wide) |
| Subheading (H2) | Playfair Display | 20-24px | 500 (medium) | normal |
| Body | Lora | 14-16px | 400 (regular) | normal |

### Animation
| Property | Value |
|----------|-------|
| Type | Fade up (opacity + translateY) |
| Duration | 0.8s |
| Easing | cubic-bezier(0.16, 1, 0.3, 1) |
| Stagger Delay | 0.1s per item |
| Iteration | Once |
| Direction | Normal |
| Fill Mode | Forwards |

---

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install react
```

### 2. Add Google Fonts

Add to your `index.html` or import in CSS:

```html
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600&family=Lora:wght@400;500&display=swap" rel="stylesheet">
```

### 3. Import Component

```jsx
import HeroSection from './HeroSection';

function App() {
  return <HeroSection />;
}
```

---

## 📁 File Structure

```
├── HeroSection.jsx      # Main React component
├── designTokens.js      # Design system tokens
└── README.md            # This file
```

---

## 🎨 Component API

### HeroSection Props (Customizable)

```jsx
const heroData = {
  image: 'https://example.com/photo.jpg',
  name: 'Your Name',
  title: 'Your Title | Your Role',
  bio: {
    intro: 'Opening statement',
    highlights: 'Key achievements',
    current: 'Current role description',
    expertise: 'Areas of expertise',
  },
  socials: [
    { icon: 'mail', href: 'mailto:you@example.com', label: 'Email' },
    { icon: 'linkedin', href: 'https://linkedin.com/in/you', label: 'LinkedIn' },
    { icon: 'location', href: '#', label: 'Location' },
  ],
};
```

### Reusable Subcomponents

| Component | Description |
|-----------|-------------|
| `OutlineCard` | Card wrapper with outline style and hover effects |
| `AnimatedItem` | Wrapper that applies staggered fade animation |
| `ProfileImage` | Image with grayscale-to-color hover effect |
| `SocialButton` | Icon button with hover state |

---

## 🔧 Customization

### Using Design Tokens

```jsx
import { designTokens } from './designTokens';

// Access colors
const primaryColor = designTokens.colors.text.primary;

// Access typography
const headingStyle = designTokens.typography.presets.heading;

// Access animation config
const animationDuration = designTokens.animation.fadeUp.duration;
```

### CSS Variables

The `designTokens.js` exports CSS custom properties:

```css
:root {
  --color-bg-page: #fafafa;
  --color-text-primary: #18181b;
  --font-heading: "Playfair Display", serif;
  --animation-duration: 0.8s;
  /* ... */
}
```

### Tailwind Integration

```js
// tailwind.config.js
import { tailwindExtend } from './designTokens';

export default {
  theme: {
    extend: tailwindExtend,
  },
};
```

---

## 📱 Responsive Behavior

The component is mobile-first with the following breakpoints:

| Breakpoint | Behavior |
|------------|----------|
| < 768px | Single column, reduced padding |
| ≥ 768px | Full layout, larger image |

---

## ♿ Accessibility

- Semantic HTML structure (`h1`, `h2`, `p`)
- ARIA labels on interactive elements
- Sufficient color contrast (WCAG AA)
- Reduced motion support (add `prefers-reduced-motion` media query)

---

## 🎯 Usage Examples

### Basic Usage
```jsx
<HeroSection />
```

### With Custom Data
```jsx
<HeroSection 
  data={{
    name: "Jane Doe",
    title: "Software Engineer",
    // ...
  }}
/>
```

### Standalone Components
```jsx
import { OutlineCard, AnimatedItem } from './HeroSection';

<OutlineCard>
  <AnimatedItem index={0} isVisible={true}>
    <p>Your content here</p>
  </AnimatedItem>
</OutlineCard>
```

---

## 📄 License

MIT - Use freely in personal and commercial projects.
