# WildGuard Design Guidelines

## Design Approach
**Reference-Based**: Drawing from iNaturalist's identification UI, National Geographic's wildlife storytelling, and Apple Maps' interactive exploration. Dual-nature theme celebrating both wildlife and botanical elements equally.

## Typography System
- **Primary**: Inter or DM Sans (clean, modern readability)
- **Accent**: Crimson Pro or Merriweather (conservation editorial content)
- **Hierarchy**: h1(3.5rem/bold), h2(2.5rem/semibold), h3(1.75rem/medium), body(1rem/regular), caption(0.875rem)

## Layout & Spacing
**Core Units**: Tailwind 4, 6, 8, 12, 16, 24 for consistent rhythm
- Section padding: py-16 md:py-24 lg:py-32
- Container: max-w-7xl with px-6
- Component gaps: gap-6 for cards, gap-8 for sections
- Grid layouts: grid-cols-1 md:grid-cols-2 lg:grid-cols-3

## Page Structure

### Hero Section (Full viewport ~90vh)
Large background image showcasing Karnataka's dual identity: split composition with wildlife (tiger/elephant) on left, lush botanical garden/Western Ghats flora on right. Centered overlay with blurred-background buttons (CTA: "Identify Species", Secondary: "Explore Conservation").

### AI Identification Showcase (2-column desktop)
Split interface preview: Left shows wildlife identification demo, right shows plant identification. Each with upload zone, sample results, and confidence indicators.

### Conservation Impact Dashboard
3-column stats grid: Species Protected, Hectares Preserved, Community Members. Below: 2-column layout with deforestation tracking visualization + habitat recovery map.

### Interactive Map Preview
Full-width embedded map teaser showing wildlife centers (shield pins) and botanical gardens (leaf pins) across Karnataka. CTA to full map experience.

### Features Grid (3-column desktop, stacked mobile)
6 feature cards with shield/leaf iconography: AI Identification, Conservation Status, Wildlife Centers Map, Botanical Gardens, Educational Library, Deforestation Alerts.

### Educational Resources (2-column)
Featured article cards with nature photography, conservation topics specific to Karnataka/India biodiversity.

### Footer
4-column: About (conservation mission), Resources (guides/articles), Community (partnerships), Connect (social/contact). Newsletter signup with nature-themed illustration.

## Component Library

**Cards**: Rounded-2xl, with image headers, shield/leaf badges for category, hover lift effect
**Buttons**: Rounded-full, blurred backgrounds on images (backdrop-blur-md), solid elsewhere
**Navigation**: Sticky header with theme toggle (sun/moon icons), wildlife/plant category filters
**Icons**: Heroicons for UI, custom shield for wildlife, leaf for botanical throughout
**Badges**: Pill-shaped status indicators (Endangered/Threatened/Stable) with appropriate urgency
**Map Pins**: Custom markers - shield for wildlife centers, leaf for gardens

## Images Strategy
**Hero**: Large dual-composition Karnataka wildlife/flora (2400x1200)
**Identification Demo**: Sample species photos in UI mockups
**Feature Cards**: Representative wildlife and botanical photography
**Conservation Impact**: Data visualization graphics, satellite imagery for deforestation
**Educational**: Article header images showcasing biodiversity
**Footer**: Subtle pattern/texture of leaves and animal tracks

## Iconography
Shield motif for wildlife protection, leaf/sprout for botanical, map marker variations, camera for identification, graph for tracking data - consistent line weight throughout.

## Dark/Light Mode Approach
Seamless toggle without page reload. Shared component structure with theme-aware classes. Maintain shield/leaf icon consistency across themes. High contrast ratios in both modes (WCAG AAA where possible).

## Accessibility Requirements
- Minimum 4.5:1 contrast for all text
- 3:1 for UI components and graphics
- Focus indicators on all interactive elements
- Alt text for all wildlife/plant imagery with species names
- Keyboard navigation for map interactions
- Screen reader labels for icon-only buttons

**Animation Budget**: Minimal - smooth theme transitions, subtle card hovers, map pin reveals only.