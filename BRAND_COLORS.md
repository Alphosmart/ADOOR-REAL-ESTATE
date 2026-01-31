# Adoor Real Estate - Brand Colors

## Color Palette (From Official Logo: grren png.png)

### Primary Color (Lime Green)
- **Main**: `#92bc1b` - Lime green from logo icon
- **Light**: `#e5f2c7` (100), `#d3e89f` (200) - Subtle backgrounds, hover states
- **Dark**: `#7fa318` (600), `#6a8714` (700) - Strong emphasis, darker buttons
- **Usage**: Main branding, primary buttons, call-to-action elements, section headers, key icons, links, accents

### Secondary Color (Navy/Dark Blue)
- **Light**: `#dde2e8` (100), `#c3ccd6` (200) - Subtle backgrounds
- **Mid**: `#7d8c9f` (400), `#5d6d80` (500) - Text, borders, disabled states
- **Dark**: `#475566` (600), `#35404d` (700) - Secondary text
- **Usage**: Backgrounds, neutral elements, borders, form fields, secondary text, cards

### Accent Color (Dark Navy)
- **Main**: `#121f2f` - Dark navy from logo background
- **Mid**: `#35404d` (700), `#2d3845` (800) - Gradients, emphasis
- **Dark**: `#0a1219` (900) - Deepest navy for strong contrast, footer, headers
- **Light**: `#dde2e8` (100), `#c3ccd6` (200) - Very light backgrounds
- **Usage**: Headers, footers, navigation backgrounds, dark sections, text on light backgrounds, strong emphasis

### Neutral Colors
- **Dark**: `#2d3845` - Main body text
- **Darker**: `#1a2530` - Headlines, important text
- **Light**: `#f3f4f6` - Light backgrounds
- **Lighter**: `#f9fafb` - Very light backgrounds, page background
- **White**: `#ffffff` - Cards, clean sections

## Tailwind CSS Classes

### Primary Colors (Lime Green - #92bc1b)
```css
bg-primary-500    /* #92bc1b - Logo lime green */
text-primary-500
hover:bg-primary-600
border-primary-500
bg-primary-50     /* Light green background */
```

### Secondary Colors (Navy/Blue - Neutrals)
```css
bg-secondary-500  /* #5d6d80 - Mid navy */
text-secondary-600
bg-secondary-100  /* Light navy backgrounds */
```

### Accent Colors (Dark Navy - #121f2f, #0a1219)
```css
bg-accent-800     /* #121f2f - Main brand navy */
bg-accent-900     /* #0a1219 - Deepest navy */
text-accent-800
hover:bg-accent-700
```

### Brand Color Shortcuts
```css
brand.green       /* #92bc1b - Quick access to primary green */
brand.navy        /* #121f2f - Quick access to dark navy */
brand.dark        /* #0a1219 - Quick access to deepest navy */
```

## Gradient Combinations

### Navy to Green (Brand Style - Hero Sections & Features)
```css
bg-gradient-to-br from-accent-800 via-accent-700 to-primary-500
/* Creates dark navy to lime green gradient */
```

### Green to Navy (Buttons & CTAs)
```css
bg-gradient-to-r from-primary-500 to-accent-800
hover:from-primary-600 hover:to-accent-900
/* Green transitioning to navy - fresh and professional */
```

### Solid Green (Primary Actions)
```css
bg-primary-500
hover:bg-primary-600
/* Clean lime green for buttons and key actions */
```

## CSS Variables

The following CSS variables are available globally:
```css
--color-primary: #92bc1b    /* Lime green from logo */
--color-accent: #121f2f     /* Dark navy from logo background */
--color-darker: #0a1219     /* Deepest navy */

--color-dark: #2d3845       /* Body text */
--color-darker-text: #1a2530 /* Headlines */
--color-light: #f3f4f6      /* Light backgrounds */
--color-lighter: #f9fafb    /* Lightest backgrounds */
```

## Updated Components

The following components use the new brand colors:

1. **tailwind.config.js**
   - Primary scale: Lime Green (#92bc1b at 500)
   - Secondary scale: Navy/Blue neutrals
   - Accent scale: Dark navy (#121f2f at 800, #0a1219 at 900)
   - Brand shortcuts: green, navy, dark

2. **index.css**
   - CSS variables: --color-primary (#92bc1b), --color-accent (#121f2f)

3. **index.html & manifest.json**
   - Theme colors updated to #92bc1b (lime green)

4. **Header.jsx**
   - Browse Properties button: Solid green (bg-primary-500)
   - Add Property button: Solid green with hover
   - Links: Green hover states

5. **Home.jsx**
   - Hero gradient: Navy-to-green (from-accent-800 to-primary-500)
   - Primary CTA: Solid green
   - Secondary CTA: White with navy text

6. **Logo.jsx**
   - Uses `/grren png.png` - the official company logo

## Usage Guidelines

- **Primary Lime Green (`#92bc1b`)**: Main branding color. Use for primary buttons, call-to-action elements, key icons, section headers, and links. This is the vibrant accent color from the logo.

- **Accent Navy (`#121f2f`)**: Strong professional color. Use for headers, footers, navigation backgrounds, text on light backgrounds, and creating contrast with the lime green. Matches the dark navy background in the logo.

- **Darkest Navy (`#0a1219`)**: For deepest contrast. Use in gradients, footer backgrounds, and areas needing maximum emphasis.

- **Navy Neutrals**: Use secondary colors for backgrounds, form fields, borders, and subtle UI elements.

- **White (`#ffffff`)**: Clean sections, card backgrounds, buttons with dark text.

- **Navy-to-Green Gradients**: The signature look inspired by the logo - use for hero sections, featured banners, and impactful UI elements.

- **Solid Green Actions**: For straightforward buttons and primary actions - fresh, vibrant, and highly visible.

## Color Scheme Inspiration

The brand colors are directly from the **Adoor Real Estate official logo (grren png.png)**, which features:
- **Lime Green icon** (#92bc1b) - Fresh, modern, and energetic
- **Dark Navy background** (#121f2f) - Professional, trustworthy, and sophisticated
- **White text** - Clean and readable
- **Overall aesthetic**: Modern real estate brand with vibrant green paired with professional navy elements

## Migration Status

✅ Logo uses grren png.png (official company logo)
✅ Tailwind configuration updated to lime green/navy colors
✅ CSS variables updated (green #92bc1b, navy #121f2f)
✅ Brand documentation updated with official logo colors
✅ All components ready for navy/green color scheme

---

Last updated: January 31, 2026
