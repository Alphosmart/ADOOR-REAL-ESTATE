# Adoor Real Estate - Brand Colors

## Color Palette (From Logo: adoor.jpeg)

### Primary Color (Orange/Gold)
- **Main**: `#d89439` - Orange/gold from "ADOO" text in logo
- **Light**: `#fef3c7` (50), `#fde68a` (100) - Subtle backgrounds, hover states
- **Dark**: `#b87729` (600), `#975a16` (700) - Strong emphasis, darker buttons
- **Usage**: Main branding, primary buttons, call-to-action elements, section headers, key icons, links

### Secondary Color (Gray/Neutral)
- **Light**: `#f3f4f6` (100), `#e5e7eb` (200) - Subtle backgrounds
- **Mid**: `#9ca3af` (400), `#6b7280` (500) - Text, borders, disabled states
- **Dark**: `#4b5563` (600), `#374151` (700) - Secondary text
- **Usage**: Backgrounds, neutral elements, borders, form fields, secondary text

### Accent Color (Dark Gray/Black)
- **Main**: `#2d2d2d` - Dark gray from house roofs and "REAL ESTATE LIMITED" text
- **Mid**: `#525252` (700), `#404040` (800) - Gradients, emphasis
- **Dark**: `#1a1a1a` (900) - Deepest black for strong contrast, footer, headers
- **Light**: `#e5e5e5` (100), `#d4d4d4` (200) - Very light backgrounds
- **Usage**: Gradients (dark-to-orange), text on light backgrounds, strong emphasis, footer, navigation backgrounds

### Neutral Colors
- **Dark**: `#1f2937` - Main body text
- **Darker**: `#111827` - Headlines, important text
- **Light**: `#f3f4f6` - Light backgrounds
- **Lighter**: `#f9fafb` - Very light backgrounds, page background
- **White**: `#ffffff` - Cards, clean sections (like house walls in logo)

## Tailwind CSS Classes

### Primary Colors (Orange/Gold - #d89439)
```css
bg-primary-500    /* #d89439 - Logo orange */
text-primary-500
hover:bg-primary-600
border-primary-500
bg-primary-50     /* Light orange background */
```

### Secondary Colors (Gray - Neutrals)
```css
bg-secondary-500  /* #9a9a9a - Gray */
text-secondary-600
bg-secondary-100  /* Light gray backgrounds */
```

### Accent Colors (Dark Gray/Black - #2d2d2d, #1a1a1a)
```css
bg-accent-800     /* #2d2d2d - Logo dark */
bg-accent-900     /* #1a1a1a - Deepest black */
text-accent-800
hover:bg-accent-700
```

### Brand Color Shortcuts
```css
brand.orange      /* #d89439 - Quick access to primary orange */
brand.dark        /* #2d2d2d - Quick access to dark accent */
brand.darker      /* #1a1a1a - Quick access to deepest black */
```

## Gradient Combinations

### Dark to Orange (Logo Style - Hero Sections & Features)
```css
bg-gradient-to-br from-accent-800 via-accent-700 to-primary-500
/* Creates dark gray to orange gradient like logo aesthetic */
```

### Orange to Dark (Buttons & CTAs)
```css
bg-gradient-to-r from-primary-500 to-accent-800
hover:from-primary-600 hover:to-accent-900
/* Orange transitioning to dark - subtle and professional */
```

### Solid Orange (Primary Actions)
```css
bg-primary-500
hover:bg-primary-600
/* Clean, simple orange for buttons and key actions */
```

## CSS Variables

The following CSS variables are available globally:
```css
--color-primary: #d89439    /* Orange from logo text */
--color-accent: #2d2d2d     /* Dark from logo roofs/text */
--color-darker: #1a1a1a     /* Deepest black */

--color-dark: #1f2937       /* Body text */
--color-darker-text: #111827 /* Headlines */
--color-light: #f3f4f6      /* Light backgrounds */
--color-lighter: #f9fafb    /* Lightest backgrounds */
```

## Updated Components

The following components have been updated with the actual logo colors:

1. **tailwind.config.js**
   - Primary scale: Orange (#d89439 at 500)
   - Secondary scale: Gray neutrals
   - Accent scale: Dark grays/blacks (#2d2d2d at 800, #1a1a1a at 900)
   - Brand shortcuts: orange, dark, darker

2. **index.css**
   - CSS variables: --color-primary (#d89439), --color-accent (#2d2d2d)

3. **index.html & manifest.json**
   - Theme colors updated to #d89439 (orange)

4. **Header.jsx**
   - Browse Properties button: Solid orange (bg-primary-500)
   - Add Property button: Solid orange with hover
   - Links: Orange hover states

5. **Home.jsx**
   - Hero gradient: Dark-to-orange (from-accent-800 to-primary-500)
   - Primary CTA: Solid orange
   - Secondary CTA: White with dark text

6. **AboutUs.jsx**
   - Hero: Dark-to-orange gradient
   - All icon backgrounds: Light orange (bg-primary-50)
   - All icons: Orange (text-primary-500)

7. **AddProduct.jsx**
   - Section headers: Orange (text-primary-500)
   - Submit button: Orange-to-dark gradient (from-primary-500 to-accent-500)

8. **Logo.jsx**
   - Uses `/adoor.jpeg` - the actual logo image

## Usage Guidelines

- **Primary Orange (`#d89439`)**: Main branding color. Use for primary buttons, call-to-action elements, key icons, section headers, and links. This is the dominant color from the "ADOO" text in the logo.

- **Accent Dark (`#2d2d2d`)**: Strong emphasis color. Use for gradients with orange, text on light backgrounds, navigation backgrounds, and professional contrast elements. Matches the house roofs and "REAL ESTATE LIMITED" text.

- **Darkest Black (`#1a1a1a`)**: For deepest contrast. Use in gradients, footer backgrounds, and areas needing maximum emphasis.

- **Gray Neutrals**: Use secondary colors for backgrounds, form fields, disabled states, and subtle borders.

- **White (`#ffffff`)**: Clean sections, card backgrounds, buttons with dark text. Matches the house walls and background of the logo.

- **Dark-to-Orange Gradients**: The signature look inspired by the logo's color scheme - use for hero sections, featured banners, and impactful UI elements.

- **Solid Orange Actions**: For straightforward buttons and primary actions - clean, professional, and highly visible.

## Color Scheme Inspiration

The brand colors are directly extracted from the **Adoor Real Estate logo (adoor.jpeg)**, which features:
- **Orange/Gold "ADOO" text** (#d89439) - Bold, warm, and inviting
- **Dark gray/black house roofs and company text** (#2d2d2d, #1a1a1a) - Professional and grounded
- **White background and house walls** - Clean and modern
- **Overall aesthetic**: Professional real estate brand with warm, approachable orange paired with sophisticated dark elements

## Migration Status

✅ Logo uses adoor.jpeg (actual brand logo)
✅ Tailwind configuration updated to orange/dark colors
✅ CSS variables updated (orange #d89439, dark #2d2d2d)
✅ Theme colors in manifest/HTML updated (#d89439)
✅ Header component updated (orange buttons, dark-to-orange gradient removed for simplicity)
✅ Home page hero updated (dark-to-orange gradient)
✅ AboutUs page updated (all icon colors to orange, hero to dark-to-orange)
✅ AddProduct form updated (section headers orange, button gradient orange-to-dark)
✅ All gradients now use orange and dark (logo color scheme)
✅ Brand documentation updated with actual logo colors
---

Last updated: October 31, 2025
