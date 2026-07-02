# JiTpro Current Design Audit

Scope: current JiTpro website/application React codebase. This is an audit only; no source-code changes are recommended or made here.

Primary files inspected:
- `package.json`, `package-lock.json`, `vite.config.ts`, `tailwind.config.js`, `postcss.config.js`, `src/index.css`, `src/App.tsx`, `src/main.tsx`
- All `src/pages/**/*.tsx`, `src/components/**/*.tsx`, `src/content/**/*.ts`
- Public assets under `public/assets/**` and `public/*.svg`

Current working tree note: before this audit was written, the repo already contained modified/untracked files in `package-lock.json`, `src/App.tsx`, `src/components/Navigation.tsx`, `src/pages/Home.tsx`, `src/pages/roles/GeneralContractors.tsx`, and several untracked docs/pages. This audit adds only `docs/design/current-design-audit.md`.

---

## 1. Technology Stack

### Core application stack

- React: installed `react@18.3.1`, `react-dom@18.3.1`
- Vite: installed `vite@5.4.21`; `package.json` declares `^5.4.2`
- TypeScript: installed `typescript@5.9.3`; `package.json` declares `^5.5.3`
- React Router: installed `react-router-dom@7.13.1`; `package.json` declares `^7.13.0`
- Tailwind CSS: installed `tailwindcss@3.4.19`; `package.json` declares `^3.4.1`
- PostCSS: installed `postcss@8.5.8`, `autoprefixer@10.4.27`
- Supabase client: `@supabase/supabase-js@2.99.1`
- Markdown rendering: `react-markdown@10.1.0`

### shadcn/ui usage

No shadcn/ui implementation was found.

Evidence:
- No `components.json`
- No `src/components/ui/*` inventory
- No `@radix-ui/*`, `class-variance-authority`, `clsx`, or `tailwind-merge` dependencies in `package.json`
- No detected shadcn-specific imports or generated component structure

### Component libraries

- No general-purpose component library is used.
- Components are custom React components styled directly with Tailwind utility classes.
- There are some stub-like investor components (`AppendixTable`, `CalloutPanel`, `CitationBadge`, `InvestorChartWrapper`) that currently render placeholder markup rather than a complete design-system implementation.

### Icon libraries

- `lucide-react@0.344.0` is the primary icon library.
- Imported icons include: `ArrowRight`, `CheckCircle2`, `ChevronRight`, `ChevronDown`, `ChevronLeft`, `Clock`, `DollarSign`, `Download`, `FastForward`, `Flame`, `Menu`, `Pause`, `Play`, `Pointer`, `Repeat`, `Settings`, `Shield`, `ShieldCheck`, `TrendingDown`, `X`, `Eye`.
- A LinkedIn icon is manually represented as a text `in` glyph inside a blue square in `src/components/Footer.tsx`.
- The JiTpro wordmark is implemented both as image assets and as a custom inline SVG React component.

### Animation libraries

- `framer-motion@12.40.0` is installed and used.
- Framer Motion usage appears primarily in:
  - `src/components/hero/ProcurementFlowHero.tsx`
  - `src/components/hero/MobileHeroSequence.tsx`
  - `src/components/hero/ProcurementFlowHero.legacy.tsx`
- Additional animations are built with:
  - CSS keyframes in `src/index.css`
  - Tailwind transition utilities
  - `requestAnimationFrame` state loops in hero components
  - `IntersectionObserver` reveal in `InvestorStatCard`

### Typography packages

No typography package was found.

- No Google Fonts import
- No `@font-face`
- No `next/font`
- No installed font package
- The site uses the browser/Tailwind default sans-serif stack.

### Theme packages

No theme package was found.

- No CSS variable theme plugin
- No `next-themes`
- No Tailwind theme extension beyond the default config
- No Radix/shadcn color-variable layer
- The theme is expressed directly through Tailwind classes and a few inline color literals.

---

## 2. Tailwind Configuration

File: `tailwind.config.js`

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

### Custom colors

No custom colors are defined in Tailwind config.

The project relies on:
- Tailwind default palette classes, especially `slate`, `amber`, and `red`
- Arbitrary hex utility classes such as `bg-[#030a19]`, `bg-[#0A66C2]`, and `bg-[#0f172a]`
- Inline CSS color values in complex custom illustrations and animation components

Common color families in use:
- Slate: `slate-50` through `slate-950`, plus opacity variants
- Amber: `amber-50`, `amber-100`, `amber-200/95`, `amber-300`, `amber-400`, `amber-500`, `amber-600`, `amber-700`, plus opacity variants
- Red: `red-50`, `red-100`, `red-200`, `red-300`, `red-400`, `red-500`, `red-800`, plus opacity variants
- White/black opacity overlays: `white/[0.06]`, `white/10`, `white/20`, `white/45`, `black/30`, `black/55`, `black/75`
- Occasional blue/emerald/cyan literals in charts or older visual paths

Notable arbitrary/static colors:
- `#030a19` — deep hero navy, heavily used in hero animation and homepage backgrounds
- `#0f172a` — equivalent to slate-900-ish usage in some areas
- `#0A66C2` and `#004182` — LinkedIn footer button
- `#f59e0b` — amber 500, also embedded in SVG/inline styles
- `#f97316`, `#ea580c`, `#dc2626`, `#c1121f`, `#ff0000` — pressure/escalation chain colors
- `#1e293b` — slate wordmark variant
- `#34d399`, `#6ee7b7`, `#38bdf8` — legacy/chart accent literals

### Font definitions

No custom font family is defined in Tailwind config.

Current behavior:
- Tailwind default `fontFamily.sans` is used implicitly.
- Global base styles apply `font-bold` to all headings.
- No `font-serif`, `font-mono`, custom heading font, or brand font is configured.

### Breakpoints

No custom breakpoints are defined.

The project uses Tailwind default breakpoints:
- `sm` 640px
- `md` 768px
- `lg` 1024px
- `xl` 1280px
- `2xl` 1536px

Common responsive patterns observed:
- `md:` for two-column grids, larger headings, wider spacing
- `lg:` for desktop hero, nav dropdown visibility, 3/4/6-column layouts
- Mobile and desktop hero split at `lg`: `MobileHeroSequence` is shown below `lg`, desktop `ProcurementFlowHero` above `lg`

### Container settings

No Tailwind `container` customization is defined.

Instead, layout uses direct max-width utilities:
- `max-w-2xl`
- `max-w-3xl`
- `max-w-4xl`
- `max-w-5xl`
- `max-w-6xl`
- `max-w-7xl`
- `max-w-lg`, `max-w-md`, `max-w-sm`, `max-w-xs`
- Arbitrary widths such as `max-w-[1080px]`, `max-w-[42rem]`, `max-w-48`

Typical wrapper pattern:
- `max-w-7xl mx-auto px-6`
- `max-w-6xl mx-auto px-6`
- `max-w-3xl mx-auto text-center`

### Shadows

No custom shadows are defined.

Observed shadow utilities:
- `shadow-sm`
- `shadow-lg`
- `shadow-xl`
- `shadow-2xl`
- `shadow-amber-500/10`
- Arbitrary shadow: `shadow-[0_4px_14px_rgba(0,0,0,0.35)]`

### Border radius

No custom radii are defined.

Observed radius utilities:
- `rounded-sm`
- `rounded`
- `rounded-md`
- `rounded-lg`
- `rounded-xl`
- `rounded-2xl`
- `rounded-3xl`
- `rounded-full`
- Arbitrary: `rounded-[2px]`, `rounded-[3px]`

Most common design language:
- Buttons/forms: often `rounded` or `rounded-lg`
- Cards: `rounded-lg`, `rounded-xl`, `rounded-2xl`
- Pills/badges: `rounded-full`
- Investor area: generally tighter `rounded`/`rounded-lg`
- Newer marketing/homepage areas: larger `rounded-2xl`/`rounded-3xl`

### Spacing scale

No custom spacing scale is defined.

Common spacing utilities:
- Section vertical spacing: `py-16`, `py-20`, `py-24`, `md:py-28`, `md:py-32`
- Horizontal page padding: `px-6`, sometimes `px-4` or `px-8`
- Component padding: `p-4`, `p-5`, `p-6`, `p-7`, `p-8`, `p-10`, `md:p-8`, `md:p-9`, `md:p-12`
- Gaps: `gap-2`, `gap-3`, `gap-4`, `gap-5`, `gap-6`, `gap-8`, `gap-10`, `gap-12`
- Vertical rhythm: `space-y-2`, `space-y-3`, `space-y-4`, `space-y-5`, `space-y-6`, `space-y-8`, `space-y-10`, `space-y-12`

Spacing is coherent at a utility level but not centralized as section/container/component tokens.

### Plugins

No Tailwind plugins are configured.

Not present:
- `@tailwindcss/forms`
- `@tailwindcss/typography`
- `@tailwindcss/aspect-ratio`
- `tailwindcss-animate`

### Custom utilities

`src/index.css` defines one Tailwind utility layer animation:

- `@keyframes bubble-in`
- `.animate-bubble-in`

Other keyframes are global, not inside a Tailwind utility class:
- `heroPulse1`
- `heroPulse2`
- `heroPulse3`
- `heroNodeSlow`
- `heroNodeMed`
- `heroNodeFast`
- `heroHouseBuild`
- `heroWindowPulse`
- `heroAmbientGlow`
- `heroFlowMove`

Global base styles:
- `html { scroll-behavior: smooth; }`
- `body` gets `antialiased`, font feature settings, `text-rendering: optimizeLegibility`, and base color `rgb(30, 41, 59)`
- All headings get `font-bold` and `letter-spacing: -0.02em`
- Paragraphs get `leading-relaxed`

---

## 3. Current Theme

### Theme structure

There is no formal theme system.

Current theme behavior is emergent from repeated utility classes:
- Main marketing pages are partly dark, partly legacy light.
- Investor pages have the clearest consistent dark theme.
- Forms/contact and older informational pages are still light-themed.
- No CSS variables define semantic color roles.
- No dark/light mode toggle exists.
- No separate token file exists for background/surface/border/text/accent semantics.

### CSS variables

No project-specific CSS variables were found for design tokens.

The code relies on:
- Tailwind utility classes
- Inline `style={{ ... }}` objects
- SVG attributes and inline color constants
- Arbitrary Tailwind values

### Dark theme values currently in use

Dark surfaces:
- Deep page/hero background: `bg-[#030a19]`, `bg-slate-950`
- Primary dark section: `bg-slate-900`
- Card/surface: `bg-slate-800`, `bg-slate-800/50`, `bg-slate-800/60`, `bg-slate-800/90`
- Elevated/nav: `bg-slate-900/95`, `bg-slate-800`, `bg-slate-700`
- Dark translucent panel: `bg-white/[0.06]`, `bg-slate-950/40`, `bg-slate-900/40`, `bg-slate-900/60`, `bg-[#030a19]/40`

Dark text:
- Primary: `text-white`, `text-slate-100`
- Secondary: `text-slate-300`, `text-slate-400`
- Muted: `text-slate-500`
- Accent: `text-amber-300`, `text-amber-500`
- Danger: `text-red-300`, `text-red-400`, `text-red-100`

Dark borders:
- `border-slate-800`, `border-slate-700`, `border-slate-600`
- Accent borders: `border-amber-500/30`, `border-amber-500/40`, `border-amber-400/30`, `border-amber-300/30`
- Warning/error borders: `border-red-400/30`, `border-red-500/30`, `border-red-300/20`
- Glass/hero borders: `border-white/10`, `border-white/20`

Dark accents:
- Amber CTA: `bg-amber-500 text-slate-950 hover:bg-amber-400`
- Amber outline/ghost: `border-amber-500/40 text-amber-500 hover:bg-amber-500/10`
- Active nav: `text-amber-500 bg-slate-800`
- Risk chain: amber/orange/red progression

### Light theme values currently in use

Light surfaces:
- Page base: `bg-white`
- Secondary page/footer: `bg-slate-50`
- Light cards: `bg-white`, `bg-slate-50`, `bg-red-50`, `bg-amber-50`, `bg-blue-50`

Light text:
- Primary: `text-slate-900`
- Secondary: `text-slate-600`, `text-slate-700`, `text-slate-800`
- Muted: `text-slate-400`, `text-slate-500`
- Accent: `text-amber-600`, `text-amber-700`
- Error: `text-red-800`

Light borders:
- `border-slate-100`, `border-slate-200`, `border-slate-300`
- `border-red-200`, `border-amber-500`, `border-amber-700`

Light CTAs:
- Primary: `bg-slate-900 text-white hover:bg-slate-800`
- Secondary/outline: `border border-slate-300 text-slate-900 hover:border-slate-900`
- Some newer pages use amber CTAs instead.

### Background colors

Current background families:
- Deep navy: `#030a19`, `slate-950`
- Slate dark: `slate-900`, `slate-800`, `slate-700`
- Light neutrals: `white`, `slate-50`, `slate-100`
- Semantic/tint backgrounds: `amber-500/10`, `red-500/10`, `amber-50`, `red-50`, `blue-50`
- Gradients: radial hero gradients and linear overlays from deep navy to transparent

### Surface colors

Surface patterns:
- Dark card: `bg-slate-800 border border-slate-700`
- Dark elevated card: `bg-slate-900 border border-slate-800`
- Dark glass panel: `bg-white/[0.06] border-white/10 backdrop-blur-sm`
- Light card: `bg-white border border-slate-200`
- Light muted card: `bg-slate-50`
- Accent callout: `bg-amber-500/10 border-amber-400/30`
- Error/risk callout: `bg-red-500/10 border-red-400/30`

### Border colors

Border system is not tokenized but clusters around:
- Light neutrals: `slate-100`, `slate-200`, `slate-300`
- Dark neutrals: `slate-600`, `slate-700`, `slate-800`
- Glass: `white/10`, `white/20`
- Accent: `amber-300/30`, `amber-400/30`, `amber-500/30`, `amber-500/40`, `amber-500/50`
- Danger: `red-200`, `red-300/20`, `red-400/30`, `red-500/20`, `red-500/30`, `red-500/50`

### Text colors

Text hierarchy is mostly utility-driven:
- Dark-theme headings: `text-white`, `text-slate-100`
- Dark-theme body: `text-slate-300`, `text-slate-400`
- Dark-theme muted labels: `text-slate-500`
- Light-theme headings: `text-slate-900`
- Light-theme body: `text-slate-600`, `text-slate-700`
- Accent labels: `text-amber-500`, `text-amber-600`, `text-amber-300`
- Risk labels: `text-red-300`, `text-red-400`, `text-red-100`

### Semantic colors

Semantic usage is implied, not defined:
- Brand/accent: amber, primarily `amber-500` / `amber-300`
- Risk/warning/escalation: amber/orange/red
- Critical/error: red variants
- Success/verification: some green/emerald remnants exist in older/chart code, but green is not currently a consistent brand semantic
- Neutral/inactive: slate variants
- External/social: LinkedIn blue `#0A66C2`

### Accent colors

Primary accent is amber:
- `amber-500` for CTAs, metrics, active nav, labels, icons
- `amber-300` for dark-theme labels, glows, and softer highlights
- Inline amber/yellow values in animation: `rgb(245,158,11)`, `rgb(251,191,36)`, `rgb(252,211,77)`, `rgb(253,224,71)`

Secondary accent/risk colors:
- Orange/red chain: `#f97316`, `#ea580c`, `#dc2626`, `#c1121f`, `#ff0000`
- Red utility colors for risk panels and failure states
- Occasional blue/emerald/cyan in legacy/chart contexts

---

## 4. Typography

### Fonts currently installed

No custom font packages are installed.

### Fonts currently used

The project uses the default Tailwind/browser sans-serif stack.

There are isolated inline SVG/text font references in animation contexts such as `fontFamily="system-ui,sans-serif"`, but there is no branded typography layer.

### Font loading method

No external font loading method exists.

Not found:
- Google Fonts stylesheet
- Adobe Fonts
- self-hosted font files
- `@font-face`
- package-provided font

### Typography scale

The typography scale is Tailwind default, used directly.

Common heading/body sizes observed:
- Eyebrow/label: `text-xs`, `text-sm`, sometimes `text-[8px]`, `text-[9px]`, `text-[10px]`, `text-[11px]`
- Body: `text-base`, `text-lg`, `md:text-xl`
- Large body/quote: `text-xl`, `text-2xl`
- Section heading: `text-2xl`, `text-3xl`, `md:text-4xl`, `md:text-5xl`
- Hero heading: `text-4xl`, `md:text-6xl`, `lg:text-7xl`
- Investor heading: typically `text-4xl md:text-5xl`

Common typographic utilities:
- Weight: `font-medium`, `font-semibold`, `font-bold`
- Tracking: `tracking-tight`, `tracking-wider`, `tracking-wide`, plus arbitrary `tracking-[0.16em]`, `tracking-[0.18em]`, `tracking-[0.2em]`, `tracking-[0.22em]`, `tracking-[0.24em]`, `tracking-[0.25em]`
- Leading: global paragraph `leading-relaxed`; frequent `leading-tight`, `leading-snug`, `leading-[1.02]`, `leading-[1.05]`, `leading-[1.08]`

### Heading styles

Global heading base:
- All `h1`–`h6`: `font-bold` and `letter-spacing: -0.02em`

Actual page headings are styled inline per component, commonly:
- Marketing hero: `text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.02]`
- Marketing section: `text-3xl md:text-5xl font-bold tracking-tight leading-tight`
- Legacy/light pages: `text-4xl md:text-5xl font-bold text-slate-900`
- Investor pages: `text-4xl md:text-5xl font-bold text-slate-100 leading-tight`
- Cards: `text-xl font-bold`, `text-2xl font-bold`

There is no reusable heading component or heading token set.

### Paragraph styles

Global paragraph base:
- `leading-relaxed`

Common body styles:
- Light body: `text-lg text-slate-600 leading-relaxed`, `text-xl text-slate-600 leading-relaxed`
- Dark body: `text-lg md:text-xl text-slate-400 leading-relaxed`, `text-slate-300 leading-relaxed`
- Muted captions: `text-sm text-slate-500`, `text-xs text-slate-500`

Paragraph styles are generally coherent but repeated manually.

### Button styles

There is no `Button` component.

Repeated button/link-button patterns include:
- Dark primary on light pages: `inline-flex items-center gap-2 bg-slate-900 text-white px-8 py-4 text-lg font-medium hover:bg-slate-800 transition-colors`
- Amber primary on dark pages: `bg-amber-500 text-slate-950 px-6/8 py-3/4 rounded-lg font-semibold/bold hover:bg-amber-400 transition-colors`
- Dark secondary on dark pages: `border border-white/20 text-white px-7 py-4 rounded-lg hover:border-white/45 transition-colors`
- Investor primary: `px-6 py-3 bg-amber-500 text-slate-900 font-semibold rounded hover:bg-amber-400 transition-colors`
- Investor secondary: `border border-slate-600 text-slate-300 rounded hover:border-slate-400 hover:text-slate-100`
- Form submit buttons: full-width variants, either dark (`bg-slate-900 text-white`) or amber (`bg-amber-500 text-slate-950`)
- Tiny animation controls: pill buttons with `text-[11px] uppercase tracking-[0.18em]`, `border-white/10`, and deep navy translucent background

Inconsistency: radius, weight, color, and padding vary across pages without formal variants.

### Table typography

Tables are used mainly in admin/investor appendix/economic pages.

Observed table typography:
- Headers: `text-slate-500 font-medium`, often `text-xs`/`text-sm`, uppercase in some legends
- Cells: `text-sm`, `text-slate-300`/`text-slate-400` on dark pages, with amber values for emphasis
- Admin tables: dark theme, compact cell padding (`px-4 py-3`), action buttons in small text
- Investor appendix tables: dark theme, amber metric/value highlights

There is no reusable table component or table typography token.

### Code typography

No dedicated code typography system was found.

- No `prose`/Typography plugin usage
- No `font-mono` styling detected as a standardized pattern
- No code block component or documentation code style system found

---

## 5. Layout System

### Grid system

The layout uses Tailwind CSS Grid directly.

Common grid patterns:
- `grid md:grid-cols-2`
- `grid md:grid-cols-3`
- `grid lg:grid-cols-3`
- `grid lg:grid-cols-4`
- `grid lg:grid-cols-[0.8fr_1.2fr]`
- `grid lg:grid-cols-[0.9fr_1.1fr]`
- `grid lg:grid-cols-[0.95fr_1.05fr]`
- `hidden lg:grid grid-cols-6` for desktop chain visuals
- Footer: `grid md:grid-cols-4`

No formal 12-column grid abstraction exists.

### Max widths

Max widths are manually applied per section:
- Site shell/nav/footer: `max-w-7xl`
- Main page content: `max-w-6xl`, `max-w-5xl`, `max-w-4xl`, `max-w-3xl`
- Narrow forms: `max-w-2xl`
- Founder image: `max-w-sm`
- Hero copy: `max-w-5xl`, `max-w-3xl`

The pattern is consistent enough to extract into layout tokens but not currently centralized.

### Section spacing

Common section pattern:
- `px-6 py-20`
- `py-20 md:py-28`
- Hero: `pt-24 pb-16 md:pt-32 md:pb-20 lg:pt-36`
- Investor sections: typically `py-20` or similar
- Footer: `py-16`

There is no `Section` component or spacing scale abstraction.

### Container spacing

Common container pattern:
- `max-w-7xl mx-auto px-6`
- `max-w-6xl mx-auto`
- `max-w-3xl mx-auto text-center`

`px-6` is the dominant page gutter. Some components use `px-4` for mobile or compact pages.

### Responsive behavior

Responsive behavior is mostly straightforward Tailwind breakpoints:
- Mobile-first stacked sections
- `md:` converts many cards/forms into 2-column grids
- `lg:` introduces desktop hero, wider grids, dropdown nav, and complex timeline/chain visuals
- Navigation switches from desktop dropdowns to accordion-like mobile dropdowns
- Investor nav switches at `md`
- Main nav switches at `lg`

The hero has separate mobile and desktop implementations, which gives better tuned visuals but increases design-system complexity.

### Navigation layout

Main navigation:
- File: `src/components/Navigation.tsx`
- Sticky top nav: `border-b border-slate-700 bg-slate-800 sticky top-0 z-50`
- Wrapper: `max-w-7xl mx-auto px-6`
- Height: `h-20`
- Logo: image `JiTpro_Amber.svg`, class `h-28`, visually larger than nav height
- Desktop: dropdown groups for How It Works, Why JiTpro, About, Contact
- Mobile: accordion-style menu using `Menu`, `X`, `ChevronDown`
- Active state: white or amber depending level

Investor navigation:
- File: `src/components/investor/InvestorNav.tsx`
- Sticky, translucent dark nav: `bg-slate-900/95 backdrop-blur border-b border-slate-800`
- Height: `h-28`
- Logo: `JiTpro_Amber_white_text.svg`, `h-20`
- Desktop dropdowns: Investor Brief, Data Room, Appendix link, conditional Download button
- Mobile menu uses grouped sections

Assessment: both navs use similar mechanics but different breakpoints, heights, logo assets, active-state styles, and dropdown interaction models.

### Footer layout

Main footer:
- File: `src/components/Footer.tsx`
- Light theme: `border-t border-slate-200 bg-slate-50`
- Four-column desktop layout
- Uses inline SVG `JiTproWordmark` in slate variant
- Links are slate text with hover darkening
- LinkedIn button is custom blue square
- Investor link appears in bottom bar

Investor footer:
- File: `src/components/investor/InvestorFooter.tsx`
- Dark theme: `bg-slate-900 border-t border-slate-800`
- Contains a centered dashboard CTA panel
- Bottom bar returns to main site

Assessment: footer design differs strongly between main and investor experiences, reinforcing the split-theme state of the codebase.

---

## 6. Component Inventory

### Application shell and routing

- `src/App.tsx`
  - Defines routes and layout boundaries.
  - Main routes use `MainLayout`.
  - Investor routes use `InvestorLayout`.
  - Admin and some unlisted landing pages bypass main layout.

- `src/components/MainLayout.tsx`
  - Main site shell: `Navigation`, `Outlet`, `Footer`.
  - Light base: `bg-white`.

- `src/components/ScrollToTop.tsx`
  - Route-change scroll behavior component.

### Navigation

- `src/components/Navigation.tsx`
  - Main sticky navigation with desktop dropdowns and mobile accordion menu.

- `src/components/investor/InvestorNav.tsx`
  - Investor sticky navigation with dropdowns, mobile grouping, and conditional download button.

### Footer

- `src/components/Footer.tsx`
  - Main light footer with four columns and LinkedIn button.

- `src/components/investor/InvestorFooter.tsx`
  - Investor dark footer with dashboard CTA panel.

### Brand/logo components and assets

- `src/components/JiTproWordmark.tsx`
  - Inline SVG JiTpro wordmark.
  - Supports `amber` and `slate` variants.
  - Exports `brandText()` helper for replacing text with wordmark.

Logo assets:
- `public/jitpro-logo_(1).svg`
- `public/assets/logo/jitpro-logo.png`
- `public/assets/logo/jitpro_logo_with_plan.png`
- `public/assets/logo/jitpro_clean.png`
- `public/assets/logo/JiTpro_Amber.svg`
- `public/assets/logo/JiTpro_Amber_white_text.svg`

### Hero components

- `src/components/hero/ProcurementFlowHero.tsx`
  - Desktop animated procurement-failure hero.
  - Uses `framer-motion`, `requestAnimationFrame`, and shared data from `heroAnimationData`.
  - Includes skip/replay controls and reduced-motion handling.

- `src/components/hero/MobileHeroSequence.tsx`
  - Mobile-specific animated hero.
  - Uses Framer Motion, rAF, mobile Gantt math, and shared hero data.
  - Includes skip/replay controls and reduced-motion handling.

- `src/components/hero/ProcurementFlowHero.legacy.tsx`
  - Legacy hero implementation retained in source.

- `src/components/hero/_archive/JitproGanttAnimation.tsx`
  - Archived/standalone detailed Gantt animation.

- `src/components/hero/ArchitecturalOutcome.tsx`
  - Custom SVG/animated architectural outcome illustration.

- `src/components/hero/ProcurementNetwork.tsx`
  - Custom SVG/network visual component.

- `src/components/hero/ProcurementItemCard.tsx`
  - SVG/card visual element for hero context.

### Timeline / schedule / visual-system components

- `src/components/timeline/TimelineShow.tsx`
  - Complex interactive/animated timeline presentation.
  - Uses Tailwind classes, custom state, and `animate-bubble-in`.

- `src/components/InteractiveProcurementSchedule.tsx`
  - Interactive procurement schedule/table-like Gantt view.
  - Includes resizing interactions, hover states, tooltips, grid/timeline layout.

- `src/components/TypicalScheduleSection.tsx`
  - Large schedule/storytelling section with play/pause/pointer icons and custom media-like controls.

- `src/components/ControlledProcurementSection.tsx`
  - Procurement control visualization section with custom schedule/chart-like UI.

### FAQ components

- `src/components/faq/FaqAccordionItem.tsx`
  - Reusable FAQ accordion item.
  - Uses grid-row transition for open/close animation and lucide chevron.

### Investor components

- `src/components/investor/InvestorLayout.tsx`
  - Auth-gated investor shell using Supabase edge verification and `AccessRequestForm` fallback.

- `src/components/investor/AccessRequestForm.tsx`
  - Dark themed investor access form.
  - Uses logo asset with fallback image path.

- `src/components/investor/InvestorSectionHeader.tsx`
  - Reusable investor section heading/subtitle component.

- `src/components/investor/InvestorStatCard.tsx`
  - Reusable stat card with IntersectionObserver reveal animation.

- `src/components/investor/InvestorChartWrapper.tsx`
  - Placeholder/stub component rendering `InvestorChartWrapper`.

- `src/components/investor/AppendixTable.tsx`
  - Placeholder/stub component rendering `AppendixTable`.

- `src/components/investor/CalloutPanel.tsx`
  - Placeholder/stub component rendering `CalloutPanel`.

- `src/components/investor/CitationBadge.tsx`
  - Placeholder/stub component rendering `CitationBadge`.

Investor chart components:
- `src/components/investor/charts/ControlComparison.tsx`
- `src/components/investor/charts/FragmentationPyramid.tsx`
- `src/components/investor/charts/LeadTimeVolatility.tsx`
- `src/components/investor/charts/MarginLeakageFunnel.tsx`
- `src/components/investor/charts/MarketSizeChart.tsx`
- `src/components/investor/charts/RiskTimeline.tsx`

These chart components are custom SVG/chart visualizations rather than components from a chart library.

### Forms and inputs

There is no reusable form-field/input component.

Form implementations:
- `src/pages/Demo.tsx`
  - Demo request form with local state.
- `src/pages/contact/ContractorContact.tsx`
  - Protected contact form using `submitContactForm`, honeypot, and Turnstile.
- `src/pages/contact/OwnerContact.tsx`
  - Protected contact form using similar styling/pattern.
- `src/pages/contact/ArchitectContact.tsx`
  - Protected contact form using similar styling/pattern.
- `src/components/investor/AccessRequestForm.tsx`
  - Investor access form.
- `src/pages/Home.tsx`
  - Conceptual next-project review form that only sets local submitted state.
- `src/pages/HomepageConcept.tsx`
  - Conceptual form variant.

Common form styles:
- Light inputs: `w-full px-4 py-3 border-2 border-slate-300 text-slate-900 focus:border-slate-900 focus:outline-none text-lg`
- Dark inputs: `w-full px-4 py-3 border-2 border-slate-600 rounded-lg bg-slate-900 text-slate-100 focus:border-amber-500 focus:outline-none`
- Labels: `block text-sm font-bold ... mb-2`

### Buttons

There is no reusable `Button` component.

Button/link-button styles are duplicated across pages with variants for:
- Dark primary
- Amber primary
- Outline/secondary
- Full-width form submit
- Investor nav/download button
- Tiny hero skip/replay control
- Admin approve/revoke controls

### Cards

There is no generic `Card` component.

Card patterns are duplicated in:
- Homepage chain cards, constraints cards, feature cards, founder card, CTA panel
- Role pages
- Investor stat cards and chart panels
- FAQ category/accordion containers
- Admin/investor panels

Common card styles:
- Dark: `rounded-2xl border border-slate-700 bg-slate-800 p-6`
- Dark elevated: `rounded-lg bg-slate-800 border border-slate-700 p-6`
- Light: `border border-slate-200 rounded-xl p-8 bg-white`
- Accent: `rounded-2xl border border-amber-400/30 bg-amber-500/10 p-6`
- Risk: `rounded-xl bg-red-500/10 border border-red-400/30 p-4`

### Tables

No table component abstraction exists.

Table-like implementations appear in:
- `src/pages/Admin.tsx`
- `src/pages/investor/InvestorAppendix.tsx`
- `src/pages/investor/EconomicCase.tsx`
- `src/components/InteractiveProcurementSchedule.tsx` uses table/Gantt-like structure but not semantic table markup in the same way

### Feature cards

Feature-card patterns are mostly page-local:
- Homepage `controlItems` cards
- Role landing cards in `src/pages/Roles.tsx`
- Role-specific pages (`ArchitectsEngineers`, `Subcontractors`, `OwnersDevelopers`, `ProjectManagers`, `GeneralContractors`)
- Investor pages with stat/chart cards

No standardized feature-card component exists.

### CTA sections

CTA sections are page-local and inconsistent:
- Main footer-like CTA patterns on Product/Roles/ThankYou pages use dark button on light background.
- Homepage final CTA uses dark section with amber form button.
- Investor footer uses disabled/coming-soon CTA panel.
- Unlisted landing pages use amber CTA buttons on dark backgrounds.

No reusable CTA section component exists.

### Timeline components

- `TimelineShow`
- `InteractiveProcurementSchedule`
- `TypicalScheduleSection`
- `ControlledProcurementSection`
- `ProcurementFlowHero` / `MobileHeroSequence`
- `TheRealProcurementTimeline` page-local timeline components

These are visually rich but bespoke. They share conceptual language but not a common timeline primitive set.

### Icons

Icons are generally imported directly from `lucide-react` where needed. There is no icon wrapper component, icon sizing scale, or semantic icon mapping.

### Modals / dialogs

No modal or dialog component was found.

### Custom components summary

Reusable/custom components found:
- `Navigation`
- `Footer`
- `MainLayout`
- `ScrollToTop`
- `Turnstile`
- `JiTproWordmark`
- `ProcurementFlowHero`
- `MobileHeroSequence`
- `ArchitecturalOutcome`
- `ProcurementNetwork`
- `ProcurementItemCard`
- `ControlledProcurementSection`
- `TypicalScheduleSection`
- `InteractiveProcurementSchedule`
- `TimelineShow`
- `FaqAccordionItem`
- `InvestorLayout`
- `InvestorNav`
- `InvestorFooter`
- `AccessRequestForm`
- `InvestorSectionHeader`
- `InvestorStatCard`
- investor chart components listed above
- placeholder investor components listed above

---

## 7. Motion

### Animation libraries

- Framer Motion is installed and used in hero components.
- No additional animation library was found.
- No `tailwindcss-animate` plugin is configured.

### Hover effects

Common hover effects:
- Text color shifts: `hover:text-*`
- Background shifts: `hover:bg-*`
- Border shifts: `hover:border-*`
- Button hover states usually use `transition-colors`
- Card hover states often change border color, e.g. `hover:border-amber-500/50`
- Dropdown chevrons rotate with `transition-transform`

Hover effects are subtle and consistent in tone, but variants are manually repeated.

### Page transitions

No route-level/page transition system was found.

- `ScrollToTop` controls scroll position on route changes.
- Pages mount normally through React Router.
- Investor stat cards animate on scroll, but pages themselves do not transition.

### Scroll animations

- `InvestorStatCard` uses `IntersectionObserver` to animate opacity/translate on reveal.
- No general scroll-animation framework was found.
- Some timeline/storytelling sections have internally animated progression, but not generic scroll-triggered animation.

### Loading animations

No standardized loading animation/spinner was found.

Observed loading states:
- Investor access verification shows text `Verifying access...`
- Form buttons use disabled states/opacity where implemented
- Hero animations have skip/replay controls rather than loading states

### Custom animation/keyframes

Defined in `src/index.css`:
- `bubble-in` utility used in timeline bubble behavior
- Hero ambient keyframes for pulse/node/house/flow effects

Hero-specific motion:
- Desktop and mobile hero use `requestAnimationFrame` to drive elapsed time.
- Reduced motion is detected via `prefers-reduced-motion` and skips to final state.
- Framer Motion handles opacity/y transitions and image opacity.

Assessment: motion is strong in hero/storytelling areas but not systematized. There are multiple timing/easing approaches: CSS keyframes, Framer Motion, Tailwind transitions, rAF, and IntersectionObserver.

---

## 8. Icons

### Icon library

Primary icon library: `lucide-react`.

Strengths:
- Consistent line icon style
- Simple size props, mostly 14–48px
- Good match for SaaS/technical marketing UI

Current limitations:
- Icons are imported and styled ad hoc.
- No design-system icon scale exists.
- No semantic icon aliases exist, such as `RiskIcon`, `ControlIcon`, `ScheduleIcon`.
- Stroke width is left to lucide defaults.

### Custom SVGs

Custom SVGs/components:
- `JiTproWordmark` inline SVG
- Hero/network/architectural visuals use inline SVG and animated SVG paths/shapes
- Investor chart components appear to be custom SVG/HTML visualizations

### Logo assets

Logo/brand assets in `public`:
- `public/jitpro-logo_(1).svg`
- `public/assets/logo/jitpro-logo.png`
- `public/assets/logo/jitpro_logo_with_plan.png`
- `public/assets/logo/jitpro_clean.png`
- `public/assets/logo/JiTpro_Amber.svg`
- `public/assets/logo/JiTpro_Amber_white_text.svg`

Logo usage inconsistency:
- Main nav uses `JiTpro_Amber.svg` at `h-28` inside an `h-20` nav.
- Investor nav uses `JiTpro_Amber_white_text.svg` at `h-20` inside `h-28` nav.
- Footer uses inline `JiTproWordmark` in slate.
- Some components reference `/JiTpro-Website/...` paths with fallback to `/assets/...`; others use `import.meta.env.BASE_URL`.

---

## 9. Images

### Hero imagery

Hero image asset:
- `public/assets/hero/house-render.png`

Usage:
- Homepage hero background image, blended with `mix-blend-lighten`
- Desktop `ProcurementFlowHero` background, opacity-controlled and masked
- Mobile `MobileHeroSequence` background, fades in during resolve
- `HomepageConcept` also uses it

Style:
- Dark architectural/rendered imagery
- Low-opacity, atmospheric, technical/construction-adjacent
- Works well with navy/amber palette

### Background graphics

Background graphics are mostly CSS/SVG driven:
- Radial gradients in homepage hero
- Gradient overlays for readability
- Inline SVG networks, Gantt bars, timeline tracks, chart visuals
- Translucent/glass panels

### Illustration style

Current illustration style is mixed but converging around:
- Dark technical dashboards
- Procurement/Gantt/timeline visuals
- Amber/yellow signal paths and red failure escalation
- Slate grid/chart surfaces
- House/architecture render as brand/world context

There are also older/light-page patterns with simple cards and text blocks, making the full site feel less unified.

### Image optimization

No image optimization pipeline is evident.

- Images are served from `public/assets` directly.
- No responsive `srcset` detected.
- No image component abstraction.
- No lazy loading pattern observed in inspected image tags.
- Vite will not transform files served from `public`.
- Video asset `public/assets/video/hero-bg.mp4` exists but no current inspected usage was identified.

---

## 10. Overall Design Assessment

### Strengths

1. Strong emerging dark brand direction
   - The homepage and investor section share a compelling dark navy/slate foundation with amber accents.
   - This direction feels appropriate for a serious construction-control SaaS: sober, technical, high-stakes, and premium.

2. Clear visual metaphor around timing/control
   - Gantt bars, timelines, sequence chains, and schedule compression visuals reinforce the product thesis visually.
   - The hero animation is highly specific to JiTpro rather than generic SaaS decoration.

3. Amber accent is memorable and mostly well-used
   - Amber works as a control/signal/attention color.
   - It pairs well with slate/navy and feels warmer than generic blue SaaS branding.

4. Good responsive ambition
   - The mobile hero is not merely a shrunken desktop version; it has a dedicated mobile storytelling model.
   - Most layouts stack cleanly at mobile widths.

5. Reusable content/data separation exists in places
   - `heroAnimationData`, `faqData`, `investorStats`, `timelineData`, and similar files show a useful pattern of separating content/data from UI.

6. Accessibility-aware motion handling in hero
   - Hero components inspect `prefers-reduced-motion` and skip animation when appropriate.

7. Investor section is the most cohesive subsystem
   - Investor pages use a consistent dark shell, nav, footer, stat-card direction, and chart language.

### Weaknesses

1. No formal design-token layer
   - Colors, spacing, typography, radii, shadows, and component variants are hard-coded as Tailwind utilities throughout components.
   - There is no semantic layer such as `background`, `surface`, `muted`, `border`, `accent`, `danger`, `success`.

2. Split visual identity between dark and legacy light pages
   - Homepage/investor/unlisted landing pages are dark and amber.
   - Older pages and contact forms are light slate/white with dark CTA buttons.
   - Main footer remains light while main navigation is dark.

3. No reusable primitive components
   - No Button, Card, Input, Select, Textarea, Badge, Section, Container, Table, Modal/Dialog, Alert, or Heading primitives.
   - This causes repeated styling and inconsistent variants.

4. Typography is not branded
   - Default system fonts are usable and performant, but the site lacks a distinctive typographic identity.
   - Heading scale and eyebrow tracking are repeated manually.

5. Motion system is bespoke
   - Motion quality is high in hero/timeline contexts, but timings/easings are not standardized.
   - Framer Motion, CSS keyframes, Tailwind transitions, rAF, and IntersectionObserver all coexist without shared motion tokens.

6. Logo usage is inconsistent
   - Different logo assets and implementations are used in nav/footer/investor contexts.
   - Pathing is inconsistent between `import.meta.env.BASE_URL`, `/JiTpro-Website/...`, and fallback `/assets/...`.
   - Sizing is inconsistent; main nav logo appears oversized relative to nav height.

7. Placeholder components exist in the reusable component directory
   - `AppendixTable`, `CalloutPanel`, `CitationBadge`, and `InvestorChartWrapper` currently render placeholder text.
   - Their existence implies a planned design-system direction but they do not yet carry real styling or behavior.

8. Image handling is basic
   - Public assets are directly referenced.
   - No responsive image strategy or lazy-loading pattern was found.

9. Design system boundaries are unclear
   - Components are organized by feature/page rather than by reusable design primitives.
   - Strong visuals exist, but the underlying reusable system is thin.

### Inconsistencies

1. CTA styling
   - Some primary CTAs are dark slate buttons; others are amber buttons.
   - Radius varies from square-ish `rounded` to `rounded-lg`.
   - Font weight varies from `font-medium` to `font-bold`.

2. Card styling
   - Light cards: `bg-white border-slate-200 rounded-xl`
   - Dark cards: `bg-slate-800 border-slate-700 rounded-2xl`
   - Investor cards: often `rounded-lg`
   - New homepage cards: often `rounded-2xl`

3. Page backgrounds
   - Main layout base is `bg-white`, while current homepage is full `bg-slate-950`.
   - Main nav is dark, main footer is light.
   - Investor shell is fully dark.

4. Accent usage
   - Amber is dominant, but red/orange/cyan/emerald/blue appear in charts, legacy paths, or social contexts.
   - Some emerald remnants conflict with the newer amber/slate direction.

5. Navigation systems
   - Main and investor navs have different heights, breakpoints, active states, logo assets, dropdown behavior, and background treatments.

6. Form styles
   - Contact forms are light, square-edged, and dark-slate focused.
   - Homepage conceptual form is dark, rounded, amber-focused.
   - Investor form is dark and amber-focused.

7. Border radius vocabulary
   - `rounded`, `rounded-lg`, `rounded-xl`, `rounded-2xl`, and `rounded-3xl` are all common, with no clear component-level rule.

8. Token duplication
   - Repeated combinations such as `text-sm font-semibold uppercase tracking-[0.2em] text-amber-500` appear across pages.
   - Repeated button and card utility strings appear in many places.

### Duplicated styling

Patterns that are duplicated enough to become components/tokens:

- Eyebrow label:
  - `text-sm font-semibold uppercase tracking-[0.2em] text-amber-500 mb-4`
  - Variants with `text-amber-300`, `tracking-[0.22em]`, `mb-6`

- Section heading:
  - `text-3xl md:text-5xl font-bold tracking-tight text-slate-100 leading-tight`
  - Light equivalent: `text-4xl md:text-5xl font-bold text-slate-900`

- Body lead:
  - `text-lg md:text-xl text-slate-400 leading-relaxed`
  - Light equivalent: `text-xl text-slate-600 leading-relaxed`

- Dark card:
  - `rounded-2xl border border-slate-700 bg-slate-800 p-6`

- Accent callout:
  - `rounded-2xl border border-amber-400/30 bg-amber-500/10 p-6`

- Primary amber button:
  - `inline-flex items-center justify-center gap-2 bg-amber-500 text-slate-950 px-7/8 py-4 text-lg font-bold rounded-lg hover:bg-amber-400 transition-colors`

- Primary slate button:
  - `inline-flex items-center gap-2 bg-slate-900 text-white px-8 py-4 text-lg font-medium hover:bg-slate-800 transition-colors`

- Dark input:
  - `w-full px-4 py-3 border-2 border-slate-600 rounded-lg bg-slate-900 text-slate-100 focus:border-amber-500 focus:outline-none`

- Light input:
  - `w-full px-4 py-3 border-2 border-slate-300 text-slate-900 focus:border-slate-900 focus:outline-none text-lg`

### Components that should become standardized

Design-only standardization candidates:

- Button variants: primary amber, primary slate, secondary outline, ghost link, nav button, danger/admin action
- Card variants: dark card, light card, accent callout, risk callout, glass panel, stat card
- Section and Container primitives: shared `px`, max-width, and vertical spacing
- Typography primitives: Eyebrow, HeroHeading, SectionHeading, Lead, Body, Caption, StatValue
- Form primitives: Field, Label, Input, Select, Textarea, RadioGroup, ErrorText, SubmitButton
- Navigation primitives: dropdown menu, mobile accordion, active nav link
- Badge/Pill primitives: category pill, status badge, source/citation badge
- Table primitives: dark table, admin table, appendix data table
- Timeline primitives: milestone, bar, cursor/playhead, package card, failure note, risk state
- Icon wrapper: sizes and semantic colors
- Logo/wordmark usage rules: image vs inline SVG, dark vs light variant, nav/footer sizing

### Areas that deviate from a professional design system

- Design decisions live in page markup rather than tokens/components.
- Multiple versions of major pages/components remain in source (`legacy`, `concept`, `_archive`) without a design-system taxonomy.
- Placeholder components exist alongside production components.
- No source-of-truth palette, typography scale, spacing scale, or component API exists.
- Dark/light behavior is page-level rather than theme-level.
- Visual primitives are not documented in code.
- There is no Storybook, component catalog, visual regression setup, or design token export.
- Accessibility patterns are partial: reduced motion is handled in hero, but focus-visible styles, component-level ARIA conventions, and color contrast rules are not systematized.

---

## Comparison Against Linear, Vercel, and Apple

### Compared with Linear

Linear design language traits:
- Highly restrained dark UI
- Precise spacing and alignment
- Subtle gradients/noise/glow
- Muted text hierarchy
- Minimal border/radius vocabulary
- Polished motion that feels quiet and fast
- Strong component consistency

Where JiTpro is similar:
- The investor and newer homepage direction use dark slate/navy surfaces with restrained amber highlights.
- Timeline/Gantt visuals have a product-specific systems feel that can support a Linear-like precision.
- Some cards and nav surfaces use subtle border contrast and muted text well.

Where JiTpro differs:
- JiTpro is more narrative and illustrative; Linear is more product-interface minimal.
- JiTpro uses heavier headings, larger emotional claims, and warmer amber/red risk colors.
- JiTpro has more visual variance between pages.
- JiTpro lacks Linear’s mature token/component consistency.
- JiTpro motion is more cinematic/storytelling; Linear motion is typically quieter and product-native.

### Compared with Vercel

Vercel design language traits:
- Very high contrast black/white foundation
- Minimal palette
- Geometric precision
- Crisp typography and spacing
- Simple, reusable primitives
- Strong docs/product system alignment
- Subtle gradients and monochrome surfaces

Where JiTpro is similar:
- Dark surfaces and technical chart/timeline elements can sit near Vercel’s high-contrast SaaS feel.
- Some investor pages use crisp panels, stats, and chart-like layouts.
- The codebase is React/Tailwind and could support a Vercel-like component primitive approach.

Where JiTpro differs:
- JiTpro uses a warmer construction/control palette rather than Vercel’s mostly monochrome/blue-neutral approach.
- JiTpro has more marketing-story density and less whitespace minimalism.
- JiTpro uses many one-off visual sections rather than a small set of highly reusable primitives.
- Vercel’s design language is tighter around typography, button variants, and documentation surfaces.
- JiTpro currently has no equivalent tokenized design foundation.

### Compared with Apple

Apple design language traits:
- Extreme clarity and focus
- Generous whitespace
- Large, confident typography
- Minimal visible UI chrome
- Premium imagery and careful art direction
- Smooth, restrained, purposeful motion
- Strong hierarchy through scale rather than decoration

Where JiTpro is similar:
- The hero and founder sections use large confident statements and premium imagery.
- The house render and dark atmospheric treatment can support a premium, cinematic impression.
- Dedicated mobile hero storytelling shows care for device-specific experience.

Where JiTpro differs:
- JiTpro pages are denser and more explanatory; Apple would reduce visible copy and section complexity.
- JiTpro relies more on cards, borders, badges, and explicit diagrams; Apple often uses fewer containers and more negative space.
- JiTpro’s motion is more instructional and data-driven; Apple motion is usually cinematic but simpler to perceive.
- Typography lacks the bespoke/premium feel of Apple’s controlled type system.
- Current inconsistency between light legacy pages and dark modern pages reduces the premium impression.

---

## Bottom-Line Design State

The current JiTpro implementation has a strong emerging design direction but not yet a comprehensive design system.

The strongest current design language is:
- dark navy/slate backgrounds
- amber control/signal accents
- red/orange escalation for failure/risk
- technical Gantt/timeline visuals
- confident high-stakes construction-control messaging
- custom storytelling motion

The weakest current design-system areas are:
- no token layer
- no primitive component library
- inconsistent dark/light page families
- duplicated button/card/form/typography utilities
- inconsistent logo and asset handling
- bespoke motion without shared motion rules

This audit intentionally does not recommend functionality changes. It identifies only design-system structure, visual consistency, and implementation patterns relevant to creating a future JiTpro website/application design system.
