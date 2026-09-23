# FancyHub.in 2.0 — Theme Engine & Design System Specification

## 1. Overview
The Theme Engine (`src/lib/theme-engine.ts`) converts database-stored tokens in `ThemeConfig` into dynamic CSS variables injected directly into `:root`.

## 2. 15 Global Color Tokens
- `--primary`: Royal Blue (`#0B2A63`)
- `--secondary`: Navy Blue (`#1E3A8A`)
- `--accent`: Festive Orange (`#FF6B00`)
- `--success`: Emerald Green (`#10B981`)
- `--warning`: Amber (`#F59E0B`)
- `--danger`: Red (`#EF4444`)
- `--info`: Sky Blue (`#3B82F6`)
- `--background`, `--surface`, `--card`, `--text`, `--muted`, `--border`, `--input`, `--button`

## 3. Visual Appearance Modes
1. **Light Mode**: High-contrast daylight readability with `#FFFFFF` cards and `#0F172A` deep typography.
2. **Dark Mode**: OLED-optimized deep-slate `#020617` palette with glowing neon accents.
3. **Glassy Mode**: Genuine Glassmorphism with hardware-accelerated `backdrop-blur` (8px to 40px), 68%-80% surface opacity, translucent frost borders, and ambient mesh gradient depth.

## 4. UI Subsystem Tokens
- **Typography**: Plus Jakarta Sans, Inter, Outfit, Poppins.
- **Corner Radius**: Sharp (0px), Small (6px), Medium (12px), Large (16px), 2XL (24px), Pill (9999px).
- **Shadows**: None, Soft Card, Elevated Float, Neon/Colored Glow.
- **Buttons & Cards**: Presets with micro-lift hover physics.
