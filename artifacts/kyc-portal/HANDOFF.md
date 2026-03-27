# NexusKYC — Full UI Replication Handoff
## Both Product Areas: Client Portal + Admin Panel

> All values taken directly from source. Nothing paraphrased or estimated.

---

## Table of Contents

1. [Project Structure Overview](#1-project-structure-overview)
2. [Shared: Design System](#2-shared-design-system)
3. [Shared: Components](#3-shared-components)
4. [Portal-Only Area](#4-portal-only-area)
   - Routes & Navigation
   - Layout Structure
   - Sidebar
   - TopBar
   - Tab Architecture
   - All 4 Tab Panels (full copy + data + interactions)
   - Right Rail
5. [Admin-Only Area](#5-admin-only-area)
   - Routes & Navigation
   - Layout Structure
   - AdminSidebar
   - AdminTopBar
   - All 4 Admin Pages (full copy + data + interactions)
6. [Component Classification](#6-component-classification)
7. [File Map](#7-file-map)
8. [Rebuild Checklist](#8-rebuild-checklist)

---

## 1. Project Structure Overview

Two fully distinct product areas sharing the same visual foundation.

| Area | Entry Point | Shell | Accent | Sidebar Logo Center |
|---|---|---|---|---|
| **Client Portal** | `/` | `Dashboard.tsx` | `#a8ff3e` lime | teal + lime rings |
| **Admin Panel** | `/admin` | `AdminLayout.tsx` | `#ff5a5a` red | red + amber rings |

They share: the background color, glass card recipe, font stack, animation library. They differ on: accent color, sidebar, topbar, content, gradients.

---

## 2. Shared: Design System

### Background
```
Base color: #050c0e
Applied via: background property on root <div> in both shells
```

### Glass Card (used identically in both areas)
```css
background: rgba(255,255,255,0.04);
backdrop-filter: blur(16px);
border: 1px solid rgba(255,255,255,0.08);
border-radius: 20px;
box-shadow: 0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06);
```
Variable name in source: `const glassCard = { ... } as React.CSSProperties`
Reused identically in all 6 admin/portal page files.

### GlassPanel component (portal only, used in portal tab content)
```css
/* .glass-panel class */
background: rgba(255,255,255,0.03);  /* slightly more transparent than glassCard */
backdrop-filter: blur(24px);
border: 1px solid rgba(255,255,255,0.08);
box-shadow: 0 8px 32px 0 rgba(0,0,0,0.3);

/* .glass-panel-hover:hover */
background: rgba(255,255,255,0.06);
border-color: rgba(255,255,255,0.15);
transform: translateY(-4px);
```
`GlassPanel` also renders an absolute inset-x-0 top-0 `h-px` gradient: `from-transparent via-white/20 to-transparent opacity-50` — the inset shine line.

### Color Tokens
```
#a8ff3e  accent-lime    → portal CTAs, active tab, active nav indicator, logo (client)
#00d4aa  accent-teal    → KYB verified, links, progress fills, doc status
#9b7ff4  accent-purple  → chart fills, current-month bar, API keys
#ffb547  accent-amber   → pending states, plan KPI, admin inner ring
#ff5a5a  accent-red     → failures, logout, admin accent, admin logo
#050c0e  background
#f0f8f5  foreground text
#6b8a82  muted-fg
#3d5a52  soft-muted (dimmer, for secondary mono text, ID values)
```

### Font Stack
```
Clash Display  — fontshare CDN, weights 400/500/600/700
  → headings, values, large numbers, card titles
  → class: font-display

DM Sans        — Google Fonts, variable weight 100–1000
  → body text, labels, descriptions, tab labels
  → class: font-sans (default)

JetBrains Mono — Google Fonts, weights 400/500/600
  → tenant ID, API keys, KYC IDs, balances, monetary values
  → class: font-mono
```

### Typography Scale
```
Page h1:          Clash Display 700, 34–38px, tracking -0.02em to -0.03em
Card headings:    Clash Display 700, 18px
Large metrics:    Clash Display 700, 26–40px, tracking -0.02em to -0.03em
Balance/mono:     JetBrains Mono 700, 36px, tracking -0.03em
Uppercase labels: DM Sans 500, 10–11px, tracking 0.06–0.08em, text-transform uppercase
Body text:        DM Sans 400, 13–14px
Badges/pills:     DM Sans 700, 9–12px
KYC IDs / code:   JetBrains Mono 400–600, 10–11px
```

### Animation Library
All animations use Framer Motion. `AnimatePresence` used for:
- Tab panel switching (portal)
- Expanded queue detail panels (admin KYC Queue)
- Sidebar label fade in/out (both sidebars)
- Alert dismiss (admin Risk Alerts)

### Tooltip Style (both sidebars, collapsed state)
```css
position: absolute; left: 56px; (left-14)
background: #0a181c;
border: 1px solid rgba(255,255,255,0.1);
border-radius: 8px;
font-size: 14px; color: #f0f8f5;
opacity: 0 → group-hover:opacity-100
pointer-events: none; white-space: nowrap; z-index: 50;
```

### Status Badge Style (shared pattern)
```
Approved / Verified / Lime:   bg rgba(168,255,62,0.12)  color #a8ff3e
Pending / Amber:               bg rgba(255,181,71,0.12)  color #ffb547
Rejected / Failed / Red:       bg rgba(255,90,90,0.12)   color #ff5a5a
Active / Teal:                 bg rgba(0,212,170,0.12)   color #00d4aa
```

### Row Hover Pattern (both areas, tables and lists)
```css
/* on hover */
background: rgba(255,255,255,0.04);
border-left: 2px solid #00d4aa;  /* or severity color for admin alerts */
/* name/title text: */ color: #00d4aa;
```
Implemented via Framer `whileHover={{ background: "...", borderLeftColor: "..." }}` or `onMouseEnter/Leave`.

---

## 3. Shared Components

These components are used in BOTH areas or provide the global token foundation.

| Component | File | Used By |
|---|---|---|
| `GlassPanel` | `components/GlassPanel.tsx` | Portal tab content panels |
| `cn()` utility | `lib/utils.ts` | Both sidebars, portal components |
| Tailwind config / `index.css` | `index.css` | Both areas — tokens, font imports, `.glass-panel` |

**No page-level components** are shared between portal and admin. Each area has its own layout shell, sidebar, and topbar.

---

## 4. Portal-Only Area

### 4A. Routes & Navigation

```
/           → Dashboard (tab: Overview)
/usage      → Dashboard (tab: Overview — sidebar highlights Usage)
/webhooks   → Dashboard (tab: Overview — sidebar highlights Webhooks)
/billing    → Dashboard (tab: Billing)
/api-keys   → Dashboard (tab: Integrations)
/audit-logs → Dashboard (tab: Overview)
/kyb-upload → Dashboard (tab: Verification)
```
**Important:** All routes render `<Dashboard>`. Tab content is driven by `useState`, not by URL. The sidebar links navigate the URL (for breadcrumb display), not the tab content.

**Breadcrumb logic:** `useLocation()` hook → maps path to label:
```
"/"           → "Account Overview"
"/usage"      → "Usage & Analytics"
"/webhooks"   → "Webhook Logs"
"/billing"    → "Billing & Invoices"
"/api-keys"   → "API Key Management"
"/audit-logs" → "Audit Logs"
"/kyb-upload" → "KYB Document Upload"
```
TopBar displays: `Portal  ›  {ROUTE_LABELS[location]}`

### 4B. Layout Structure

```
<body background="#050c0e">

[Fixed z:0 — Atmospheric mesh gradients]
  Left orb:  radial-gradient(ellipse 80% 60% at 10% 20%, #0d3830, transparent 60%)
             absolute, width:80%, height:60%, top:-10%, left:-10%
  Right orb: radial-gradient(ellipse 60% 50% at 85% 70%, #0a2a22, transparent 55%)
             absolute, width:60%, height:50%, bottom:-10%, right:-10%

[Fixed z:50 — <Sidebar>]
  left:0, top:0, bottom:0
  width: 72px collapsed → 240px on hover (animated)

[Sticky z:40 — <TopBar>]
  top:0, height:64px, marginLeft:72px

[<main> z:10 marginLeft:72px]
  └── [flex row, min-h-screen]
      ├── [flex-1, padding: p-8 pr-4 (32px all, 16px right)]
      │   ├── Page heading block
      │   │   ├── <h1>Account Overview</h1>
      │   │   └── <AnimatePresence> subtitle keyed on activeTab
      │   ├── Tab strip
      │   └── <AnimatePresence mode="wait"> tab panel keyed on activeTab
      └── [width:348px, flex-shrink:0]
          └── <RightPanel>
```

### 4C. Portal Sidebar (`components/layout/Sidebar.tsx`)

**Behavior:**
- `motion.aside`, fixed left, z:50
- `width: 72px` initial → `240px` on `onMouseEnter`, back to `72px` on `onMouseLeave`
- Transition: `duration: 0.3, ease: "anticipate"`
- `useState(false)` controls `isHovered`

**Logo mark (collapsed, always visible):**
- Outer ring: `border-2px border-#a8ff3e rounded-full opacity-80` — rotates 360° every 20s (linear, infinite)
- Inner ring: `border-2px border-#00d4aa rounded-full opacity-60` — counter-rotates every 15s
- Center dot: `w-2 h-2 rounded-full bg:#a8ff3e box-shadow: 0 0 8px #a8ff3e`

**Logo text (expanded only, AnimatePresence fade):**
- `Nexus` (foreground) + `KYC` (color #a8ff3e) — Clash Display Bold 16px
- Sub: `WORKSPACE` — DM Sans 9px, uppercase, tracking widest, color #00d4aa

**Nav items:**
```
LayoutDashboard   Overview      /
BarChart2         Usage         /usage
Webhook           Webhooks      /webhooks
CreditCard        Billing       /billing
Key               API Keys      /api-keys
ScrollText        Audit Logs    /audit-logs
Upload            KYB Upload    /kyb-upload
```

**Active nav item:**
```css
background: rgba(168,255,62,0.1);
color: #a8ff3e;
/* Indicator: */
position: absolute; left:0; top:8px; bottom:8px; width:4px;
background: #a8ff3e;
border-radius: 0 4px 4px 0;
box-shadow: 0 0 20px #a8ff3e;
Framer layoutId="active-nav"
```

**Inactive nav item hover:**
```css
color: #f0f8f5;
background: rgba(255,255,255,0.05);
/* icon: */ color: #00d4aa;
```

**Footer items (border-top: 1px solid rgba(255,255,255,0.05)):**
```
Shield     Admin Panel   /admin    hover: text #ff5a5a, bg rgba(255,90,90,0.1)
Settings   Settings      —         hover: icon rotates 90deg (transition-transform 500ms)
LogOut     Log Out       —         hover: text #ff5a5a
```

**Sidebar glass:**
```css
background: rgba(255,255,255,0.03);
backdrop-filter: blur(24px);
border-right: 1px solid rgba(255,255,255,0.08);
```

### 4D. Portal TopBar (`components/layout/TopBar.tsx`)

```
[Left]  Portal  ›  {breadcrumb label}   (ChevronRight w-3.5 h-3.5 color #3d5a52)
[Right] ● All systems operational pill
        Bell icon (red dot badge)
        HelpCircle icon
        Separator line
        Avatar (name: Stefan / sub: Anime Corp Ltd)
```

**Health pill:**
```css
background: rgba(168,255,62,0.08);
border: 1px solid rgba(168,255,62,0.18);
color: #a8ff3e;
border-radius: 9999px; padding: 6px 12px;
font-size: 12px; font-weight: 600;
/* dot: */ w-1.5 h-1.5 rounded-full bg:#a8ff3e box-shadow: 0 0 6px rgba(168,255,62,0.7)
```

**TopBar glass:**
```css
background: rgba(5,12,14,0.90);
backdrop-filter: blur(24px) saturate(160%);
border-bottom: 1px solid rgba(255,255,255,0.06);
height: 64px; marginLeft: 72px;
```

**Avatar ring gradient:** `linear-gradient(135deg, #00d4aa, #9b7ff4)`, padding 2px, w-9 h-9, rounded-full

**Avatar name hover:** color → #a8ff3e (transition-colors)

**Bell notification dot:**
```css
width:8px; height:8px; background:#ff5a5a;
border:1.5px solid #050c0e; border-radius:50%;
position: absolute; top:4px; right:4px;
```

### 4E. Tab Architecture (`pages/Dashboard.tsx`)

```typescript
type TabId = "overview" | "verification" | "integrations" | "billing";
const [activeTab, setActiveTab] = useState<TabId>("overview");
```

**Tab strip container:**
```css
background: rgba(255,255,255,0.04);
border: 1px solid rgba(255,255,255,0.07);
border-radius: 12px; padding: 4px;
```

**Tab button (active):**
```css
background: #a8ff3e;
box-shadow: 0 0 20px rgba(168,255,62,0.35);
border-radius: 8px; color: #050c0e;
font-weight: 700; padding: 8px 20px;
/* Framer layoutId="active-tab-bg", spring stiffness:400 damping:30 */
```

**Tab button (inactive):**
```css
color: #6b8a82;
/* hover: */ color: #f0f8f5;
padding: 8px 20px;
```

**Tab panel transition:**
```
enter:  { opacity: 0, y: 14 } → { opacity: 1, y: 0 }
exit:   { opacity: 1, y: 0  } → { opacity: 0, y: -8 }
duration: 0.22s, easing: [0.16, 1, 0.3, 1]
AnimatePresence mode="wait", key={activeTab}
```

**Subtitle transition:**
```
AnimatePresence mode="wait", key={activeTab}
<p> enters/exits opacity 0→1→0, duration 0.18s
```

**Tab labels → subtitles:**
```
Overview      → "KYB progress, integration health, billing status, and recent activity"
Verification  → "KYB verification state, submitted documents, risk assessment, and history"
Integrations  → "API keys, webhook endpoints, delivery health, and developer activity"
Billing       → "Current balance, plan details, usage this cycle, and billing history"
```

---

### 4F. Overview Tab (`tabs/OverviewTab.tsx`)

#### KPI Ring Row (4 columns, gap-4)

Each card: `height:168px`, glass card recipe, hover → `translateY(-4px)` + glow shadow.

| value | label | percent | color |
|---|---|---|---|
| `Verified` | `KYB STATUS` | 100 | `#00d4aa` |
| `Active` | `OPS STATUS` | 90 | `#a8ff3e` |
| `Low` | `RISK TIER` | 75 | `#9b7ff4` |
| `Growth` | `PLAN` | 60 | `#ffb547` |

**KPI Ring SVG (component: `KPICard.tsx`):**
```
SVG size: 120px × 120px (not responsive — fixed px)
strokeWidth: 8px
radius: (120 - 16) / 2 = 52px
cx, cy: 60, 60
Track:  stroke rgba(255,255,255,0.07), fill none
Fill:   stroke = color prop, fill none, strokeLinecap round
        filter: drop-shadow(0 0 8px {color}50)
SVG rotation: -90deg (start top)
Animation: stroke-dashoffset CSS transition, 1.2s cubic-bezier(0.34,1.56,0.64,1)
           each card has delay prop: 0s / 0.1s / 0.2s / 0.3s
```

**Ring center text:**
```
Value:  Clash Display 700, 18px (12px if len > 7), tracking -0.02em, color #f0f8f5
Label:  DM Sans 500, 9px, uppercase, tracking 0.08em, color #6b8a82, margin-top:5px
```

**Radial glow behind ring:**
```css
position:absolute; inset:0; border-radius:20px; opacity:0.06;
background: radial-gradient(circle at center, {color}, transparent 70%);
```

**Top inset shine:**
```css
position:absolute; top:0; left:0; right:0; height:1px;
background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent);
```

#### Chart Row (12-col, gap-5: col-span-7 + col-span-5)

**Jobs Processed chart (col-span-7, component: `UsageChart.tsx`):**
```
Header: "Jobs Processed" (Clash Display 700, 18px)
Sub:    "Verification jobs run via API — last 6 months" (#6b8a82, 12px)
Link:   "View Usage →" (color #00d4aa, 12px, right-aligned)
Metric: "1,124" (Clash Display 700, 28px, tracking -0.02em) + " jobs this month" (#6b8a82)
Delta:  "+29%" (bg rgba(168,255,62,0.12), color #a8ff3e) + "  vs last month" (#6b8a82)

Chart: Recharts BarChart, ResponsiveContainer width="100%" height=180
barCategoryGap="35%", barSize=28

Data:
  { name:"Oct", value:312 }
  { name:"Nov", value:548 }
  { name:"Dec", value:491 }
  { name:"Jan", value:703 }
  { name:"Feb", value:867 }
  { name:"Mar", value:1124 }

Historical bars (Oct–Feb): SVG hatch fill via <pattern id="hatch">
  pattern: <line x1=0 y1=0 x2=4 y2=4>, stroke rgba(155,127,244,0.4), strokeWidth 1
  bar color: url(#hatch)
  bar opacity: 0.7

Current month bar (Mar): fill #9b7ff4
  filter: drop-shadow(0 0 12px rgba(155,127,244,0.6))
  using <Cell> on index 5

XAxis: axisLine false, tickLine false, tick { fill: "#6b8a82", fontSize: 12 }
YAxis: hidden (hide={true})
Tooltip: dark glass (bg rgba(10,24,28,0.95), border rgba(255,255,255,0.1), radius 12)
```

**Webhook Donut (col-span-5, component: `WebhookDonut.tsx`):**
```
Header: "Webhooks" (Clash Display 700, 18px)
Sub:    "DELIVERY STATUS" (10px uppercase tracking 0.08em, color #6b8a82)
Link:   "View All →" (color #00d4aa, 12px, right-aligned)
Center: "1,362" (Clash Display 700, 24px) + "TOTAL EVENTS" (9px uppercase #6b8a82)

Chart: Recharts PieChart — FIXED size width={160} height={160} (NOT ResponsiveContainer)
cx=75, cy=75, innerRadius=52, outerRadius=70
paddingAngle=3, startAngle=90, endAngle=-270
animationBegin=300, animationDuration=1400

Data:
  { name:"Delivered", value:1248, color:"#00d4aa" }
  { name:"Failed",    value:23,   color:"#ff5a5a" }
  { name:"Pending",   value:91,   color:"#ffb547" }

Each segment: fill={entry.color}, filter: drop-shadow(0 0 8px {color}60)

Legend (right of chart, Framer fade+slide from x:8):
  Delivered  1,248  #00d4aa
  Failed        23  #ff5a5a
  Pending       91  #ffb547
  Each: dot w-2 h-2 rounded-full + label text-xs #6b8a82 + value Clash Display Bold #f0f8f5
```

#### Bottom Cards Row (4-col, gap-4)

Each card: glass card recipe, `p-5`, icon container `w-10 h-10 rounded-2xl flex items-center justify-center`, cursor-pointer, hover → `translateY(-3px)` + glow box-shadow via inline style on mouseEnter/Leave.

| LABEL | VALUE | SUB | BADGE TEXT | BADGE COLOR | ICON | ICON COLOR | HREF |
|---|---|---|---|---|---|---|---|
| `BILLING BALANCE` | `$0.00` | `$250 credit included · resets Apr 1` | `No overages` | #a8ff3e / rgba(168,255,62,0.12) | `BookOpen` | `#a8ff3e` | `/billing` |
| `API KEYS ACTIVE` | `3` | `2 production · 1 sandbox` | `All valid` | #00d4aa / rgba(0,212,170,0.12) | `Key` | `#00d4aa` | `/api-keys` |
| `WEBHOOK FAILURES` | `23` | `Last 30 days · 1.8% fail rate` | `Review needed` | #ff5a5a / rgba(255,90,90,0.12) | `AlertTriangle` | `#ff5a5a` | `/webhooks` |
| `AUDIT EVENTS` | `847` | `March 2026 · exportable` | `Up to date` | #9b7ff4 / rgba(155,127,244,0.12) | `ScrollText` | `#9b7ff4` | `/audit-logs` |

Card structure per item:
```
[Icon container (bg = iconBg)]
  [Icon (color = iconColor)]
[Label: 10px uppercase tracking-wider #6b8a82]
[Value: Clash Display 700, 26px, tracking -0.02em, #f0f8f5]
[Sub: 11px #6b8a82]
[Badge: px-2 py-0.5 rounded-full text-[10px] font-bold]
[Link: "View →" text-xs font-semibold, color = iconColor]
```
Link uses `onClick` with `window.history.pushState` + `PopStateEvent` — not `<a>` href, to avoid page reload.

---

### 4G. Verification Tab (`tabs/VerificationTab.tsx`)

**Top row (12-col, gap-6):**

**KYB Status card (col-span-5):**
```
Header icon: ShieldCheck w-7 h-7 color #00d4aa
Badge: "✓ Approved" — bg rgba(168,255,62,0.12) color #a8ff3e, border rgba(168,255,62,0.2)
Value: "Verified" — Clash Display 700, 32px, color #00d4aa
Sub: "Verified Mar 18, 2026 · expires Mar 18, 2028" — 12px #6b8a82
Divider: h-px bg rgba(255,255,255,0.06) my-4
Fields row: Entity Type: Private Ltd | Risk Tier: Low | Jurisdiction: UK
  (3 columns, label 10px uppercase #6b8a82, value 13px font-medium #f0f8f5)
```

**Risk Assessment card (col-span-7):**
```
Header: "Risk Assessment" + badge "Low Risk" (bg rgba(0,212,170,0.12) color #00d4aa)

5 rows (h-11 each, border-left 2px transparent, hover → #00d4aa):
Label               Value                    Status
Jurisdiction        United Kingdom           CheckCircle2 #00d4aa
PEP Screening       No matches               CheckCircle2 #00d4aa
Sanctions Check     No matches               CheckCircle2 #00d4aa
Adverse Media       No flags                 CheckCircle2 #00d4aa
UBO Complexity      2 beneficial owners      AlertTriangle #ffb547
```

**Bottom row (12-col, gap-6):**

**Submitted Documents card (col-span-7):**
```
Header: "Submitted Documents" + "Upload More →" link (color #00d4aa)

5 rows, each: h-14 px-4 rounded-xl, border-left 2px transparent, hover → #00d4aa:
Name                              Status    Date           Size
Certificate of Incorporation      verified  Mar 15, 2026   2.4 MB
Proof of Registered Address       verified  Mar 15, 2026   1.1 MB
Director — National ID (Stefan A.) verified Mar 16, 2026   0.8 MB
UBO Declaration Form              verified  Mar 17, 2026   0.5 MB
Latest Audited Financials         pending   Requested Mar 20  —

Status colors:
  verified → color #00d4aa, bg rgba(0,212,170,0.1)
  pending  → color #ffb547, bg rgba(255,181,71,0.1)
```

**Verification Timeline card (col-span-5):**
```
Header: "Verification Timeline" (Clash Display 700, 18px)

5 entries, each: left border-l-2 border-white/10, pl-4, pb-4:
Event                          Date           Dot color
KYB verification approved      Mar 18, 2026   #a8ff3e
UBO declaration reviewed       Mar 17, 2026   #00d4aa
Director identity confirmed    Mar 16, 2026   #00d4aa
Documents submitted            Mar 15, 2026   #00d4aa
KYB application opened         Mar 14, 2026   #6b8a82

Each: absolute dot w-3 h-3 rounded-full at left:-7px top:2px
Event text: 13px font-medium #f0f8f5
Date text:  11px #6b8a82 mt-0.5
```

---

### 4H. Integrations Tab (`tabs/IntegrationsTab.tsx`)

**API Keys section (full width):**
```
Header: "API Keys" (Clash Display 700, 18px)
Sub:    "3 active keys across production and sandbox" (#6b8a82, 12px)
CTA:    "+ New Key" button — bg rgba(168,255,62,0.1) color #a8ff3e border rgba(168,255,62,0.2)
        Plus icon w-3 h-3

3 rows (h-16 each, border-left 2px transparent, hover → border-left #a8ff3e, bg rgba(255,255,255,0.02)):
Name             Masked key             Env         Last Used
Production Key   pk_live_4x8aK9mN••••  production  2 min ago
Sandbox Key      pk_test_7pRjQ2xW••••  sandbox     Mar 18, 2026
CI / Test Runner pk_test_9mZvL3kB••••  sandbox     Mar 22, 2026

Per row right side:
  Copy icon (Copy w-4 h-4 / CheckCircle2 on copy, color #a8ff3e when copied)
  Env badge: production → bg rgba(155,127,244,0.12) color #9b7ff4
             sandbox    → bg rgba(0,212,170,0.1) color #00d4aa
  Key icon w-8 h-8 rounded-lg container: bg rgba(168,255,62,0.08) icon Key w-4 h-4 #a8ff3e

Copy mechanic: onClick → navigator.clipboard.writeText(fullKey)
  state: { [keyId]: boolean } — copiedKey
  resets after 2000ms
```

**Bottom row (12-col, gap-5):**

**Webhook Endpoints card (col-span-7):**
```
Header: "Webhook Endpoints"
Sub:    "3 configured · 1 degraded" (#6b8a82)
Link:   "Manage →" color #00d4aa right-aligned

3 rows (border-left 2px transparent, hover → #9b7ff4, each has pt-3 pb-3 border-b rgba(255,255,255,0.05)):
URL                                  Health    Delivered  Failed  Events
https://api.acme.co/hooks/kyb-events Healthy   1248       3       kyb.verified, kyb.rejected
https://api.acme.co/hooks/billing    Degraded  412        20      billing.invoice.created
https://staging.acme.co/hooks/test   Healthy   89         0       *

Health dot: w-1.5 h-1.5 rounded-full fill-current
  Healthy:  #00d4aa
  Degraded: #ffb547

Event badges: px-2 py-0.5 rounded text-[9px] bg rgba(155,127,244,0.12) color #9b7ff4
```

**Delivery Activity card (col-span-5):**
```
Header icon: Activity w-4 h-4 color #9b7ff4
Title: "Delivery Activity"
Sub:   "Last 24 hours" (#6b8a82, 11px)

Chart: Recharts AreaChart, height 120
Two areas:
  delivered: stroke #9b7ff4, strokeWidth 2
    fill: linearGradient "deliveredGrad" — #9b7ff4 5% opacity 0.25 → 0%
  failed: stroke #ff5a5a, strokeWidth 1.5
    fill: linearGradient "failedGrad" — #ff5a5a 5% opacity 0.15 → 0%
  dot={false}, no XAxis, no YAxis

Data (7 points):
  { h:"12am", delivered:42,  failed:2  }
  { h:"4am",  delivered:18,  failed:0  }
  { h:"8am",  delivered:87,  failed:5  }
  { h:"12pm", delivered:134, failed:3  }
  { h:"4pm",  delivered:98,  failed:12 }
  { h:"8pm",  delivered:167, failed:8  }
  { h:"Now",  delivered:43,  failed:2  }

Legend below chart: 2 dots
  ● Delivered (#9b7ff4) · ● Failed (#ff5a5a)

Section: "RECENT EVENTS" (10px uppercase tracking-wider #6b8a82)
4 rows (each h-10, flex items-center justify-between):
  kyb.verified             delivered  2 min ago
  billing.invoice.created  failed     14 min ago
  kyb.document.uploaded    delivered  1 hour ago
  kyb.verified             delivered  2 hours ago

Status colors: delivered → #a8ff3e, failed → #ff5a5a

Button: "↺ Replay Failed Events"
  bg rgba(155,127,244,0.1) border rgba(155,127,244,0.2) color #9b7ff4
  icon: RefreshCw w-3 h-3
  hover:scale-105
```

---

### 4I. Billing Tab (`tabs/BillingTab.tsx`)

**Top 3 cards (3-col, gap-5):**

**Current Balance:**
```
Icon: BookOpen w-5 h-5 color #a8ff3e, bg rgba(168,255,62,0.1) w-10 h-10 rounded-xl
Label: "CURRENT BALANCE" (10px uppercase #6b8a82)
Value: "$0.00" — JetBrains Mono 700, 36px, tracking -0.03em, color #f0f8f5
Sub:   "$250 included credit · no overages" (#6b8a82, 12px)
Badge: "No overages" — bg rgba(168,255,62,0.1) color #a8ff3e border rgba(168,255,62,0.2)
Footer: Calendar icon w-3 h-3 #6b8a82 + "Resets Apr 1" (11px #6b8a82)
```

**Current Plan:**
```
Special gradient background:
  linear-gradient(135deg, rgba(13,56,48,0.6) 0%, rgba(7,38,32,0.4) 100%)
  border: 1px solid rgba(0,212,170,0.2)
Icon: Zap w-5 h-5 color #00d4aa, bg rgba(0,212,170,0.1) w-10 h-10 rounded-xl
Label: "CURRENT PLAN" (10px uppercase #6b8a82)
Value: "Growth" — Clash Display 700, 32px, color #00d4aa
Sub:   "$250 / month · included" (#6b8a82, 12px)
Features (3 rows, CheckCircle2 w-3.5 h-3.5 #00d4aa):
  ✓ 5,000 verification jobs / month
  ✓ 3 production API keys
  ✓ Unlimited webhook endpoints
```

**Usage This Cycle:**
```
Icon: TrendingUp w-5 h-5 color #9b7ff4, bg rgba(155,127,244,0.1) w-10 h-10 rounded-xl
Label: "USAGE THIS CYCLE" (10px uppercase #6b8a82)
Value: "1,124 / 5,000 jobs" — Clash Display 700, 22px, color #f0f8f5
Sub:   "Mar 1 – Mar 23, 2026" (#6b8a82, 12px)
Progress bar:
  track: h-1.5, bg rgba(255,255,255,0.07), rounded-full
  fill:  linear-gradient(90deg, #9b7ff4, #a8ff3e)
  Framer: initial width:0 → animate width:"22.5%", ease "easeOut"
Footer: "22.5% of limit used  ·  3,876 remaining" (11px #6b8a82)
```

**Bottom row (12-col, gap-5):**

**Monthly Job Usage chart (col-span-7):**
```
Title: "Monthly Job Usage" (Clash Display 700, 18px)
Sub:   "Last 6 months" (#6b8a82, 12px)
Chart: same BarChart as UsageChart (same data, same hatch pattern, same purple current bar)
```

**Billing Ledger (col-span-5):**
```
Title: "Billing Ledger" (Clash Display 700, 18px)
Sub:   "Credits and usage charges" (#6b8a82, 12px)
CTA:   "⬇ Export CSV" button — border rgba(255,255,255,0.08) color #6b8a82
       Download icon w-3.5 h-3.5

Table header cols: Description | Amount | Balance
  (text-[10px] uppercase tracking-wider #6b8a82, border-bottom rgba(255,255,255,0.06))

4 rows (h-12, hover bg rgba(255,255,255,0.04), border-bottom rgba(255,255,255,0.04)):
  Description                    Date           Amount   Balance
  Monthly plan — Growth          Mar 1, 2026    $250.00  $250.00
  Jobs processed (1,124 × $0.00) Mar 1–23       $0.00    $250.00
  Monthly plan — Growth          Feb 1, 2026    $250.00  $250.00
  Jobs processed (867 × $0.00)   Feb 1–28       $0.00    $250.00

Amount/Balance: JetBrains Mono 400, 13px, color #a8ff3e

Footer: "Showing last 4 entries" (#6b8a82, 11px) | "Full billing history →" (color #00d4aa, right)
```

---

### 4J. Right Rail (`components/dashboard/RightPanel.tsx`)

**Rail style:**
```css
width: 348px; flex-shrink: 0;
background: rgba(255,255,255,0.03);
backdrop-filter: blur(20px);
border-left: 1px solid rgba(255,255,255,0.07);
min-height: 100vh; padding: 24px (p-6);
gap between sections: gap-6 (24px)
```

**Account Summary Card (`AccountSummaryCard.tsx`):**

Card gradient:
```css
background: linear-gradient(135deg, #0d3830 0%, #072620 40%, #050c0e 100%);
border: 1px solid rgba(0,212,170,0.2);
box-shadow: 0 0 40px rgba(0,212,170,0.06), 0 8px 32px rgba(0,0,0,0.5);
border-radius: 20px; padding: 20px;
```

Ambient glow (top-right corner):
```css
position:absolute; top:-16px; right:-16px;
width:128px; height:128px; rounded-full;
background: radial-gradient(circle, rgba(0,212,170,0.15), transparent 70%);
```

Content:
```
Status chip: ● ACTIVE — bg rgba(168,255,62,0.1) color #a8ff3e border rgba(168,255,62,0.25)
             dot: w-1.5 h-1.5 rounded-full bg #a8ff3e box-shadow 0 0 6px rgba(168,255,62,0.7)
Company: "Anime Corp Ltd" — Clash Display 700, 18px
Sub:     "KYB Verified · Growth Plan" — 12px #6b8a82

Fields:
  Tenant ID:        ten_4x8aK9mNpQ2r  (JetBrains Mono 400, 12px, #f0f8f5)
                    Copy icon → clipboard → CheckCircle2 for 2s, color #a8ff3e
  Environment:      Production         (#f0f8f5)
  Plan:             Growth             (color #00d4aa)
  Billing Balance:  $0.00 / $250 credit (JetBrains Mono, #f0f8f5)
  Cycle resets:     Apr 1, 2026        (#6b8a82)

Usage bar:
  Label: "MONTHLY USAGE" (10px uppercase #6b8a82) + "1,124 / 5,000 jobs" (right, #f0f8f5)
  Track: h-1.5 bg rgba(255,255,255,0.07) rounded-full
  Fill: linear-gradient(90deg, #00d4aa, #a8ff3e), box-shadow 0 0 8px rgba(0,212,170,0.5)
  Framer: initial width:0 → animate width:"22.5%"
  Sub: "22% of plan limit · resets Apr 1" (10px #6b8a82)

CTA: "View Billing & Plan →" button
  Full width, h-10, bg rgba(0,212,170,0.1) border rgba(0,212,170,0.2) color #00d4aa
  hover: bg rgba(0,212,170,0.15)
  onClick → navigate to /billing
```

**Recent Activity:**
```
Header: "Recent Activity" (Clash Display 700, 16px) + "Audit Logs ›" (color #00d4aa, ChevronRight w-3 h-3)
→ onClick navigates to /audit-logs

5 items (each h-14 flex, border-left 2px transparent):
  whileHover: { background: rgba(255,255,255,0.04), borderLeftColor: #00d4aa }
  title group-hover:text-[#00d4aa]

icon bg:     w-8 h-8 rounded-lg
icon:        w-3.5 h-3.5

ID  icon         bg                       iconColor  title                      detail                                  date
1   Key           rgba(168,255,62,0.1)     #a8ff3e    API key rotated            prod_key_**** → new key                Mar 22
2   Webhook       rgba(155,127,244,0.1)    #9b7ff4    Webhook test sent          endpoint: /hooks/kyb                   Mar 21
3   Upload        rgba(0,212,170,0.1)      #00d4aa    KYB document uploaded      Certificate of Incorporation            Mar 20
4   FileText      rgba(255,181,71,0.1)     #ffb547    Audit log exported         March 2026 · 847 events                Mar 19
5   RefreshCw     rgba(255,90,90,0.1)      #ff5a5a    Delivery replayed          evt_8xKp2mNq · success                Mar 18
```

**Onboarding Checklist:**
```
Header: "Onboarding" (Clash Display 700, 16px) + "3/5 complete" badge (bg rgba(168,255,62,0.1) color #a8ff3e)
Progress bar: h-1 bg rgba(255,255,255,0.07)
  fill: linear-gradient(90deg, #00d4aa, #a8ff3e), 60% width
  Framer: initial width:0 → animate width:"60%"

5 steps:
  ✓  KYB verification completed   (CheckCircle2 #00d4aa, text line-through, #3d5a52)
  ✓  First API key created        (CheckCircle2 #00d4aa, text line-through, #3d5a52)
  ✓  Webhook endpoint configured  (CheckCircle2 #00d4aa, text line-through, #3d5a52)
  ○  Test webhook delivery confirmed (Circle #3d5a52, text #6b8a82)
  ○  Go live in production           (Circle #3d5a52, text #6b8a82)
```

---

## 5. Admin-Only Area

### 5A. Routes & Navigation

```
/admin           → AdminOverview
/admin/kyc-queue → KYCQueue
/admin/clients   → ClientManagement
/admin/risk      → RiskAlerts
/admin/analytics → (not implemented — link exists in sidebar)
/admin/audit     → (not implemented — link exists in sidebar)
/admin/settings  → (not implemented — link exists in sidebar)
```

### 5B. Admin Layout Shell (`pages/admin/AdminLayout.tsx`)

```
<div min-h-screen background:#050c0e>

[Fixed z:0 — Red/amber atmospheric gradients (distinct from portal's teal)]
  Left orb:  radial-gradient(ellipse 80% 60% at 10% 20%, #1a0a0a 0%, transparent 60%)
             width:80%, height:60%, top:-15%, left:-10%
  Right orb: radial-gradient(ellipse 60% 50% at 85% 70%, #12080a 0%, transparent 55%)
             width:60%, height:50%, bottom:-10%, right:-10%

[Fixed z:50 — <AdminSidebar>]

[Sticky z:40 — <AdminTopBar>]
  height:64px, marginLeft:72px

[<main> z:10 marginLeft:72px]
  └── {children}  (each page renders its own p-8 wrapper)
```

Note: Admin area has NO right rail. Pages span the full content width.

### 5C. AdminSidebar (`components/layout/AdminSidebar.tsx`)

**Logo mark (collapsed):**
- Outer ring: `border-2px border-#ff5a5a` — rotates 360° every 20s
- Inner ring: `border-2px border-#ffb547` — counter-rotates every 15s
- Center dot: `w-2 h-2 rounded-full bg:#ff5a5a box-shadow: 0 0 8px #ff5a5a`

**Logo text (expanded only, AnimatePresence):**
- `Nexus` (foreground) + `KYC` (color #ff5a5a)
- Sub: `Admin Panel` — 9px, uppercase, tracking widest, color `#ffb547`

**Glass style:** Same as portal sidebar (`rgba(255,255,255,0.03)`, `blur(24px)`, right border `rgba(255,255,255,0.07)`)

**Nav items + badges:**
```
LayoutDashboard  Overview      /admin
ShieldCheck      KYC Queue     /admin/kyc-queue   badge: 14
Users            Clients       /admin/clients
AlertTriangle    Risk Alerts   /admin/risk         badge: 3
BarChart2        Analytics     /admin/analytics
ScrollText       Audit Logs    /admin/audit
Settings         Settings      /admin/settings
```

**Badge (collapsed state only, icon-relative):**
```css
position: absolute; top: -6px; right: -6px;
width: 16px; height: 16px; border-radius: 50%;
background: #ff5a5a; color: white; font-size: 8px; font-weight: 700;
```

**Badge (expanded state, inline after label):**
```css
px-1.5 py-0.5 rounded-full text-[9px] font-bold text-white background:#ff5a5a
```

**Active nav item:**
```css
background: rgba(255,90,90,0.1);
color: #ff5a5a;
/* Indicator: */
position:absolute; left:0; top:8px; bottom:8px; width:4px;
background: #ff5a5a; box-shadow: 0 0 8px #ff5a5a;
border-radius: 0 4px 4px 0;
Framer layoutId="active-admin-nav"
```

**Inactive hover:** `color: #f0f8f5, bg: rgba(255,255,255,0.05)` / `icon hover: #00d4aa`

**Footer (border-top rgba(255,255,255,0.05)):**
```
ChevronLeft  Client View   /    (navigate back to portal)
LogOut       Log Out       —    hover: text #ff5a5a, bg rgba(255,90,90,0.1)
```

**Expand transition:** `duration: 0.3, ease: [0.16, 1, 0.3, 1]` (same as portal)

### 5D. AdminTopBar (`components/layout/AdminTopBar.tsx`)

**TopBar slide-in:** `initial: { y:-64, opacity:0 }`, `animate: { y:0, opacity:1 }`, delay 0.1, 0.4s `[0.16,1,0.3,1]`

**Left — Admin breadcrumb:**
```
ADMIN badge: bg rgba(255,90,90,0.12) color #ff5a5a border rgba(255,90,90,0.25) px-2.5 py-1 rounded-lg
  + Shield icon w-3 h-3
Separator: "/" color #3d5a52
Page title: {PAGE_TITLES[location]} — DM Sans 500, 15px, color #f0f8f5
```

**PAGE_TITLES mapping:**
```
/admin            → "Overview"
/admin/kyc-queue  → "KYC Review Queue"
/admin/clients    → "Client Management"
/admin/risk       → "Risk Alerts"
/admin/analytics  → "Analytics"
/admin/audit      → "Audit Logs"
/admin/settings   → "Settings"
```

**Center — Global search:**
```
Search icon left-4, color #6b8a82 → #ff5a5a on focus
Input: h-10 rounded-3xl pl-11 pr-14, bg rgba(255,255,255,0.04) border rgba(255,255,255,0.08)
  onFocus: borderColor:#ff5a5a, boxShadow: 0 0 0 3px rgba(255,90,90,0.12)
  onBlur:  borderColor reset
Placeholder: "Search clients, applications, events…" color #3d5a52
⌘K badge right side: bg rgba(255,255,255,0.05) border rgba(255,255,255,0.07)
  Command icon w-2.5 h-2.5 + "K"
```

**Right — Status + notifications + avatar:**
```
Status pill: "14 Pending"
  bg rgba(255,181,71,0.1) border rgba(255,181,71,0.2) color #ffb547
  Animated ping dot: bg #ffb547 (absolute + animate-ping sibling)

Bell button: w-5 h-5, red dot badge (w-2 h-2 bg #ff5a5a, border 1.5px solid #050c0e, top:4px right:4px)

Avatar section (border-left rgba(255,255,255,0.08), pl-4):
  Name: "Admin" — font-display font-semibold 14px, hover → #ff5a5a
  Sub:  "Super Admin" — 10px #6b8a82
  Ring: linear-gradient(135deg, #ff5a5a, #ffb547), padding 2px, w-9 h-9 rounded-full
  Photo: https://i.pravatar.cc/150?img=12
```

---

### 5E. Admin Overview (`pages/admin/AdminOverview.tsx`)

**Page header:**
```
h1: "Admin Overview" — Clash Display 700, 34px, tracking -0.02em
Sub: "System-wide KYC performance — today, March 22, 2026" — 14px #6b8a82
Enter animation: opacity 0→1, y 16→0, delay 0.1, 0.5s
```

**Stat cards (4-col, gap-5):**

Each: glass card, `p-5 flex items-center gap-4`, icon container `w-12 h-12 rounded-2xl`, hover `translateY(-1px)` via CSS.

| Label | Value | Change text | Icon | Color | BG |
|---|---|---|---|---|---|
| Total Clients | `2,847` | `+124 this month` | Users | `#00d4aa` | `rgba(0,212,170,0.12)` |
| Pending KYC | `14` | `Needs review` | Clock | `#ffb547` | `rgba(255,181,71,0.12)` |
| Approved Today | `38` | `+18% vs yesterday` | CheckCircle2 | `#a8ff3e` | `rgba(168,255,62,0.12)` |
| Rejected Today | `5` | `2.4% reject rate` | XCircle | `#ff5a5a` | `rgba(255,90,90,0.12)` |

Value: Clash Display 700, 26px, tracking -0.02em, line-height 1
Change text color: = card color

**Charts row (12-col, gap-6):**

**KYC Volume chart (col-span-7):**
```
Title: "KYC Volume" (Clash Display 700, 18px)
Sub:   "Weekly approved vs rejected" (#6b8a82, 12px)
Legend: ● Approved (#a8ff3e) · ● Rejected (#ff5a5a) — right aligned

Recharts BarChart, ResponsiveContainer height=200
barGap=4, barCategoryGap="35%", maxBarSize=22

Data (7 days, Mon–Sun):
  Mon: approved:32  rejected:4
  Tue: approved:45  rejected:7
  Wed: approved:28  rejected:3
  Thu: approved:51  rejected:8
  Fri: approved:38  rejected:5
  Sat: approved:12  rejected:2
  Sun: approved:8   rejected:1

approved bar: fill #a8ff3e, radius [4,4,0,0], filter drop-shadow(0 0 6px rgba(168,255,62,0.4))
rejected bar: fill #ff5a5a, radius [4,4,0,0], filter drop-shadow(0 0 6px rgba(255,90,90,0.4))
XAxis: axisLine false, tickLine false, fill #6b8a82, fontSize 12
YAxis: axisLine false, tickLine false, fill #3d5a52, fontSize 11
Tooltip: dark glass (bg rgba(10,24,28,0.95), border rgba(255,255,255,0.1), radius 12)
```

**Approval Rate sparkline (col-span-5):**
```
Icon: Activity w-4 h-4 color #00d4aa
Title: "Approval Rate"
Sub:   "30-day rolling trend" (#6b8a82, 12px)
Value: "88.4%" — Clash Display 700, 40px, tracking -0.03em, line-height 1
Badge: "+2.1%" — bg rgba(168,255,62,0.12) color #a8ff3e border rgba(168,255,62,0.2) px-2.5 py-1 rounded-full

Chart: Recharts AreaChart, height 100
Data: 30 data points of { val: 40 + sin(i*0.4)*15 + i*0.8 + random()*8 }
  stroke: #00d4aa, strokeWidth 2, dot false
  fill: linearGradient "adminTrend" — #00d4aa 5% opacity 0.3 → 0%
  No axes, margin top:4 right:0 left:0 bottom:0
```

**Recent KYC Activity table:**
```
Title: "Recent KYC Activity" (Clash Display 700, 18px)
Link:  "View Queue ›" (#00d4aa, 12px) — onClick navigates to /admin/kyc-queue

5 rows (h-14 px-4 rounded-xl, border-left 2px transparent):
  whileHover: { background: rgba(255,255,255,0.04), borderLeftColor: #00d4aa }
  name text: group-hover:text-[#00d4aa]
  enter: opacity 0→1, x -8→0, staggered delay 0.6 + i*0.07

Left side: ID (JetBrains Mono 12px #3d5a52, w-80px) | Name (13px bold) / Type (12px #6b8a82)
Right side: ● Risk text | Time | Status badge

ID       Name              Type        Status    Time       Risk
KYC-2847 Anime Corp Ltd    Business    approved  2 min ago  Low
KYC-2846 David Chen        Individual  pending   8 min ago  Medium
KYC-2845 Nova Ventures     Business    rejected  14 min ago High
KYC-2844 Sarah Williams    Individual  approved  22 min ago Low
KYC-2843 GlobalPay Inc     Business    pending   31 min ago Medium

Risk colors:   Low:#00d4aa  Medium:#ffb547  High:#ff5a5a
Status badges: (same shared badge style)
```

---

### 5F. KYC Queue (`pages/admin/KYCQueue.tsx`)

**Page header:**
```
h1: "KYC Review Queue" — Clash Display 700, 34px, tracking -0.02em
Sub: "7 applications awaiting review — prioritised by risk" — 14px #6b8a82
Buttons (top right): "Export" + "Filter"
  style: bg rgba(255,255,255,0.05) border rgba(255,255,255,0.08) color #6b8a82 rounded-xl px-4 py-2
```

**Filter pills:**
```
Options: All | Individual | Business | High | Medium | Low
Active pill: bg #ff5a5a, color #050c0e, shadow 0 0 16px rgba(255,90,90,0.35)
Inactive pill: bg rgba(255,255,255,0.05), color #6b8a82, border rgba(255,255,255,0.08)
rounded-full px-4 py-1.5 text-sm
State: useState("All"), filters QUEUE_ITEMS by risk === filter OR type === filter
```

**Queue items — 7 records:**

```
ID        Name              Type        Email                       Country          Risk    Docs  Submitted    Flags
KYC-2846  David Chen        Individual  david.chen@email.com        Singapore        Medium  3     2h ago       PEP Check Required
KYC-2843  GlobalPay Inc     Business    compliance@globalpay.io     UK               Medium  7     4h ago       Director Verification Needed
KYC-2840  Maria Santos      Individual  m.santos@mail.com           Brazil           Low     2     6h ago       (none)
KYC-2838  Vertex Capital    Business    kyc@vertexcap.com           Cayman Islands   High    9     8h ago       High Risk Jurisdiction, Complex Structure
KYC-2835  Priya Sharma      Individual  priya.s@outlook.com         India            Low     3     10h ago      (none)
KYC-2831  NexGen Logistics  Business    admin@nexgen.co             UAE              Medium  6     12h ago      UBO Verification Pending
KYC-2828  Thomas Baker      Individual  t.baker@gmail.com           USA              Low     3     14h ago      (none)
```

**Queue row layout (h-16, flex, px-5, gap-4):**
```
Left:   Icon container (w-10 h-10 rounded-xl)
          Business: bg rgba(155,127,244,0.2), Building2 w-5 h-5 #9b7ff4
          Individual: bg rgba(0,212,170,0.15), User w-5 h-5 #00d4aa
        Identity block:
          Name bold 14px | KYC-ID (JetBrains Mono 10px #3d5a52) | Flags badge
          Email · Country (12px #6b8a82)
Right:  [hidden on mobile, flex on lg]
          FileText icon + "{n} docs" (#6b8a82)
          Clock icon + submitted time (#6b8a82)
          Risk badge (rounded-full px-3 py-1 text-xs font-bold)
        Actions (or decision badge if acted):
          Eye button (w-8 h-8 rounded-lg hover:bg-white/10) → toggles expanded
          Reject button (bg rgba(255,90,90,0.12) color #ff5a5a border rgba(255,90,90,0.2) hover:scale-105)
          Approve button (bg rgba(168,255,62,0.12) color #a8ff3e border rgba(168,255,62,0.2) hover:scale-105)
          ChevronDown button (rotates 180° when expanded, Framer animate)

Flag badge (when flags > 0):
  "{n} flag(s)" — bg rgba(255,181,71,0.15) color #ffb547 px-2 py-0.5 rounded text-[9px] font-bold

Decision state:
  Once approved/rejected: opacity drops to 0.5
  Shows result badge instead of action buttons:
    approved → bg rgba(168,255,62,0.12) color #a8ff3e "✓ Approved"
    rejected → bg rgba(255,90,90,0.12) color #ff5a5a "✗ Rejected"
```

**Expanded detail panel (AnimatePresence height:0→auto, 0.25s):**
```
Inner container: bg rgba(255,255,255,0.03), border rgba(255,255,255,0.06), rounded-2xl, p-4, mx-5 mb-4
3 columns:

1. Submitted Documents
   "National ID", "Proof of Address", "Company Registration" (if Business)
   Shown up to item.docs count
   Each: CheckCircle2 w-3.5 h-3.5 #a8ff3e + name text #f0f8f5
   If docs > 3: "+{n-3} more documents" (12px #6b8a82)

2. Risk Flags
   If no flags: "✓ No flags raised" (color #00d4aa, 14px)
   If flags: each flag line — amber dot w-1.5 h-1.5 bg:#ffb547 + text #ffb547 (12px)

3. Details
   Country | Type | Risk — label/value rows (14px, label #6b8a82, value #f0f8f5)
   Risk value uses risk color
```

---

### 5G. Client Management (`pages/admin/ClientManagement.tsx`)

**Page header:**
```
h1: "Client Management" — Clash Display 700, 34px
Sub: "10 registered clients across all plans" — 14px #6b8a82
Buttons: "Export CSV" (Download icon) + "Filters" (SlidersHorizontal icon)
  style: same ghost button style as KYC Queue
```

**Search + filter bar:**
```
Search input (flex-1 max-w-sm):
  Search icon left-4 #6b8a82
  Placeholder: "Search by name, email, ID…" color #3d5a52
  rounded-2xl h-10 pl-11, bg rgba(255,255,255,0.04) border rgba(255,255,255,0.08)
  useState("") → filters by name/email/id (case-insensitive)

KYB filter pills: All | Verified | Pending | Rejected
  Active state varies by filter:
    "All" active: bg #ff5a5a color #050c0e
    "Verified" active: bg rgba(168,255,62,0.12) color #a8ff3e
    "Pending" active: bg rgba(255,181,71,0.12) color #ffb547
    "Rejected" active: bg rgba(255,90,90,0.12) color #ff5a5a
```

**Table grid columns:** `80px 1fr 120px 100px 100px 100px 90px`
**Column headers:** `ID | Client | Country | KYB | Risk | Plan | Revenue`

Each header is a clickable sort button. Active sort column shows ChevronUp/Down at opacity 1 (others at 0.3).
State: `useState("id") sortCol`, `useState("asc") sortDir`. Note: sort changes state but visual reorder is not implemented in the source.

**10 client records:**

| ID | Name | Type | Email | Country | KYB | Risk | Plan | Revenue |
|---|---|---|---|---|---|---|---|---|
| CLT-001 | Anime Corp Ltd | Business | compliance@acme.com | USA | Verified | Low | Enterprise | $48,200 |
| CLT-002 | David Chen | Individual | d.chen@email.com | Singapore | Verified | Medium | Growth | $3,400 |
| CLT-003 | Nova Ventures | Business | ops@novaventures.io | UK | Rejected | High | — | $0 |
| CLT-004 | Sarah Williams | Individual | s.williams@mail.co | Australia | Verified | Low | Starter | $850 |
| CLT-005 | GlobalPay Inc | Business | kyc@globalpay.io | UK | Pending | Medium | — | $0 |
| CLT-006 | Vertex Capital | Business | kyc@vertexcap.com | Cayman Islands | Pending | High | — | $0 |
| CLT-007 | Maria Santos | Individual | m.santos@mail.com | Brazil | Pending | Low | — | $0 |
| CLT-008 | TechBridge Solutions | Business | admin@techbridge.co | Germany | Verified | Low | Enterprise | $92,100 |
| CLT-009 | James Okonkwo | Individual | j.okonkwo@pro.com | Nigeria | Verified | Medium | Growth | $7,600 |
| CLT-010 | Meridian Holdings | Business | kyc@meridian.hk | Hong Kong | Verified | Low | Enterprise | $115,300 |

**Row layout (grid, h-60px per row, border-bottom rgba(255,255,255,0.04), border-left 2px transparent):**
```
whileHover: { background: rgba(255,255,255,0.03), borderLeftColor: "#00d4aa" }
name text group-hover:text-[#00d4aa]

ID:       JetBrains Mono 12px #3d5a52
Client:   icon (w-8 h-8 rounded-lg) + name (13px semibold) + email (12px #6b8a82)
          Business: bg rgba(155,127,244,0.2) Building2 #9b7ff4
          Individual: bg rgba(0,212,170,0.12) User #00d4aa
Country:  12px #6b8a82
KYB:      badge (px-2.5 py-1 rounded-full text-xs font-bold) — shared status colors
Risk:     "● Low/Medium/High" — 12px semibold, colors #00d4aa/#ffb547/#ff5a5a
Plan:     12px, #f0f8f5 if has plan, #3d5a52 if "—"
Revenue:  JetBrains Mono 14px font-bold, #a8ff3e if > $0, #3d5a52 if "$0"
```

**Table footer:**
```
"Showing {filtered} of 10 clients" (#6b8a82, 12px)
Pagination: "← Prev" | "1" (active, bg rgba(255,255,255,0.06) color #f0f8f5) | "Next →"
border-top: rgba(255,255,255,0.06)
Note: pagination is visual-only, no actual page switching implemented
```

---

### 5H. Risk Alerts (`pages/admin/RiskAlerts.tsx`)

**Page header:**
```
h1: "Risk Alerts" — Clash Display 700, 34px
Sub: "Active compliance and risk flags requiring attention" — 14px #6b8a82
```

**Risk metric cards (4-col, gap-5):**

Each: glass card, `p-5 flex items-center gap-4`, icon `w-11 h-11 rounded-xl`, hover `translateY(-1px)`.
Value uses card color (not #f0f8f5).

| Label | Value | Color | BG | Icon |
|---|---|---|---|---|
| Critical Alerts | `1` | `#ff5a5a` | `rgba(255,90,90,0.12)` | AlertTriangle |
| High Priority | `2` | `#ffb547` | `rgba(255,181,71,0.12)` | Zap |
| Under Review | `7` | `#9b7ff4` | `rgba(155,127,244,0.12)` | Clock |
| Resolved Today | `12` | `#00d4aa` | `rgba(0,212,170,0.12)` | CheckCircle2 |

**Alert cards (3 cards, one per severity):**

**Severity styles:**
```
critical: color #ff5a5a, bg rgba(255,90,90,0.08),  border rgba(255,90,90,0.3),  icon AlertTriangle
high:     color #ffb547, bg rgba(255,181,71,0.08), border rgba(255,181,71,0.3), icon Zap
medium:   color #9b7ff4, bg rgba(155,127,244,0.08), border rgba(155,127,244,0.3), icon TrendingUp
```

Each alert card uses the glassCard recipe but **overrides**:
```css
background: sev.bg;       /* translucent tint of severity color */
border: 1px solid sev.border;
```

**Alert card internal structure (p-6):**
```
Header row:
  Icon container (w-10 h-10 rounded-xl, bg {sev.color}20) + sev.icon w-5 h-5 sev.color
  Title block:
    h3 title (Clash Display 700, 16px) | severity badge | category badge
    Badges:
      severity: px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider
                bg {sev.color}20 color sev.color
      category: px-2.5 py-0.5 rounded-full text-[10px]
                bg rgba(255,255,255,0.06) color #6b8a82
    Sub row: CategoryIcon w-3.5 h-3.5 | client name (color #f0f8f5) | "·" | time | "·" | alert.id mono #3d5a52
  Dismiss button (right): "Dismiss" — text-xs px-3 py-1.5 rounded-lg hover:bg-white/10 #6b8a82

Description (ml-14, 14px leading-relaxed color #a0bab2):
  {alert.description}

Action buttons row (ml-14, gap-3):
  First button:  bg {sev.color}20, color sev.color, border {sev.color}30, hover:scale-105
  Other buttons: bg rgba(255,255,255,0.05), color #6b8a82, border rgba(255,255,255,0.08)
```

**3 alerts:**

**ALT-001 — Critical:**
```
Title:       High-Risk Jurisdiction Detected
Category:    Jurisdiction (Globe icon)
Client:      Vertex Capital
Time:        15 min ago
Description: "Application KYC-2838 from Cayman Islands flagged. Vertex Capital shows complex
              ownership structure with 5 layers of beneficial ownership."
Actions:     [Block Application] [Escalate to Compliance] [Request Additional Docs]
```

**ALT-002 — High:**
```
Title:       PEP Match Detected
Category:    PEP/Sanctions (Shield icon)
Client:      David Chen
Time:        2 hours ago
Description: "Automated screening matched David Chen against PEP database (Singapore
              government official, retired 2021). Manual review required."
Actions:     [Review PEP Status] [Request Declaration] [Dismiss Match]
```

**ALT-003 — Medium:**
```
Title:       Transaction Volume Spike
Category:    Behavioral (TrendingUp icon)
Client:      TechBridge Solutions
Time:        4 hours ago
Description: "Client CLT-008 (TechBridge Solutions) shows 340% increase in transaction volume
              over the last 7 days. Pattern deviates from established baseline."
Actions:     [Freeze Account] [Request Explanation] [Monitor Only]
```

**Dismiss mechanic:**
```typescript
const [dismissed, setDismissed] = useState<Set<string>>(new Set());
// onClick: setDismissed(d => new Set([...d, alert.id]))
// Filter: ALERTS.filter(a => !dismissed.has(a.id))
// Enter animation per card: opacity 0→1, x -12→0, delay 0.4 + i*0.1
```

**Empty state (when all dismissed):**
```
CheckCircle2 w-12 h-12 color #a8ff3e
h3: "All clear!" (Clash Display 700, xl)
p: "All risk alerts have been resolved." (#6b8a82, 14px)
Centered, py-20
Framer: opacity 0→1
```

---

## 6. Component Classification

### Shared (both portal and admin)
| Item | Notes |
|---|---|
| `GlassPanel.tsx` | Used in portal; admin uses inline `glassCard` style object |
| `glassCard` style object | Duplicated inline in every admin page file |
| `cn()` utility | Used in both sidebars |
| `index.css` token system | Provides tokens, font imports, `.glass-panel`, `.glass-panel-hover` |
| Color palette | All hex values are shared |
| Recharts | Used in portal (UsageChart, WebhookDonut, IntegrationsTab) and admin (AdminOverview, BillingTab) |
| Framer Motion | Used everywhere |
| Lucide React | Used everywhere |
| Wouter | Used in both sidebars for `useLocation()`, `Link` |

### Portal-Only
| Component | File |
|---|---|
| `Dashboard` | `pages/Dashboard.tsx` |
| `Sidebar` | `components/layout/Sidebar.tsx` |
| `TopBar` | `components/layout/TopBar.tsx` |
| `KPICard` | `components/dashboard/KPICard.tsx` |
| `UsageChart` | `components/dashboard/UsageChart.tsx` |
| `WebhookDonut` | `components/dashboard/WebhookDonut.tsx` |
| `AccountSummaryCard` | `components/dashboard/AccountSummaryCard.tsx` |
| `RightPanel` | `components/dashboard/RightPanel.tsx` |
| `OverviewTab` | `components/dashboard/tabs/OverviewTab.tsx` |
| `VerificationTab` | `components/dashboard/tabs/VerificationTab.tsx` |
| `IntegrationsTab` | `components/dashboard/tabs/IntegrationsTab.tsx` |
| `BillingTab` | `components/dashboard/tabs/BillingTab.tsx` |

### Admin-Only
| Component | File |
|---|---|
| `AdminLayout` | `pages/admin/AdminLayout.tsx` |
| `AdminSidebar` | `components/layout/AdminSidebar.tsx` |
| `AdminTopBar` | `components/layout/AdminTopBar.tsx` |
| `AdminOverview` | `pages/admin/AdminOverview.tsx` |
| `KYCQueue` | `pages/admin/KYCQueue.tsx` |
| `ClientManagement` | `pages/admin/ClientManagement.tsx` |
| `RiskAlerts` | `pages/admin/RiskAlerts.tsx` |

---

## 7. File Map

```
artifacts/kyc-portal/
├── index.html
├── src/
│   ├── index.css                                   tokens, fonts, .glass-panel
│   ├── main.tsx                                    ReactDOM root
│   ├── App.tsx                                     Router, route definitions
│   ├── lib/
│   │   └── utils.ts                                cn() (clsx + tailwind-merge)
│   ├── pages/
│   │   ├── Dashboard.tsx                           Portal shell, tab state
│   │   └── admin/
│   │       ├── AdminLayout.tsx                     Admin shell (no right rail)
│   │       ├── AdminOverview.tsx                   /admin
│   │       ├── KYCQueue.tsx                        /admin/kyc-queue
│   │       ├── ClientManagement.tsx                /admin/clients
│   │       └── RiskAlerts.tsx                      /admin/risk
│   └── components/
│       ├── GlassPanel.tsx                          Shared glass wrapper
│       ├── layout/
│       │   ├── Sidebar.tsx                         Portal sidebar
│       │   ├── TopBar.tsx                          Portal topbar
│       │   ├── AdminSidebar.tsx                    Admin sidebar
│       │   └── AdminTopBar.tsx                     Admin topbar
│       └── dashboard/
│           ├── KPICard.tsx                         SVG ring KPI
│           ├── AccountSummaryCard.tsx              Right rail card
│           ├── UsageChart.tsx                      Bar chart (portal)
│           ├── WebhookDonut.tsx                    Donut chart (portal)
│           ├── RightPanel.tsx                      Portal right rail
│           └── tabs/
│               ├── OverviewTab.tsx                 Portal tab 1
│               ├── VerificationTab.tsx             Portal tab 2
│               ├── IntegrationsTab.tsx             Portal tab 3
│               └── BillingTab.tsx                  Portal tab 4
```

**App.tsx routes:**
```typescript
<Route path="/"           component={Dashboard} />
<Route path="/usage"      component={Dashboard} />
<Route path="/webhooks"   component={Dashboard} />
<Route path="/billing"    component={Dashboard} />
<Route path="/api-keys"   component={Dashboard} />
<Route path="/audit-logs" component={Dashboard} />
<Route path="/kyb-upload" component={Dashboard} />
<Route path="/admin"           component={AdminOverview} />
<Route path="/admin/kyc-queue" component={KYCQueue} />
<Route path="/admin/clients"   component={ClientManagement} />
<Route path="/admin/risk"      component={RiskAlerts} />
```

---

## 8. Rebuild Checklist

### Setup
- [ ] React 18 + TypeScript + Vite
- [ ] framer-motion ^11, recharts ^2, wouter ^3, lucide-react, @tanstack/react-query ^5, tailwindcss ^4, clsx, tailwind-merge
- [ ] Clash Display from `https://api.fontshare.com/v2/css?f[]=clash-display@400,500,600,700&display=swap`
- [ ] DM Sans + JetBrains Mono from Google Fonts
- [ ] CSS variables: `--background: #050c0e`, `--foreground: #f0f8f5`
- [ ] Tailwind custom tokens: accent-lime, accent-teal, accent-purple, accent-amber, accent-red, muted-foreground, soft-muted, font-display, font-mono

### Portal Area
- [ ] `Dashboard.tsx` with `useState<TabId>`, `AnimatePresence mode="wait"`, keyed panels, slide-fade transition
- [ ] Sidebar expand-on-hover (`motion.aside`, `onMouseEnter/Leave`)
- [ ] Active tab `layoutId="active-tab-bg"` framer spring
- [ ] Active nav `layoutId="active-nav"` framer spring
- [ ] Animated subtitle with `AnimatePresence mode="wait"`, keyed on `activeTab`
- [ ] KPI ring: SVG stroke-dashoffset animation with stagger delay
- [ ] Recharts BarChart with SVG hatch pattern for historical bars, Cell on current month
- [ ] Recharts PieChart donut with **fixed** `width={160} height={160}` (NOT ResponsiveContainer), cx/cy 75/75
- [ ] Recharts AreaChart for delivery activity
- [ ] Copy-to-clipboard with 2s icon swap (portal: Tenant ID + API keys)
- [ ] Progress bars: Framer `animate={{ width: "X%" }}` from `initial={{ width: 0 }}`
- [ ] Right rail: account summary card with teal gradient background, usage bar, activity list, onboarding checklist
- [ ] Card hover lifts: `onMouseEnter/Leave` setting inline `transform` + `boxShadow`
- [ ] `window.history.pushState` + `PopStateEvent` for sidebar nav (avoids page reload while supporting breadcrumb)

### Admin Area
- [ ] `AdminLayout.tsx` with red/amber atmospheric gradients (not teal)
- [ ] `AdminSidebar.tsx`: red accent, red/amber logo rings, badge counts on nav items, ChevronLeft → Client View
- [ ] `AdminTopBar.tsx`: ADMIN badge, global search with focus ring, pulsing pending count, red/amber avatar ring
- [ ] `AdminOverview.tsx`: 4 stat cards, grouped BarChart (approved+rejected), AreaChart sparkline, activity table
- [ ] `KYCQueue.tsx`: filter pills, 7 queue items, expand/collapse with AnimatePresence height animation, approve/reject state with opacity dim
- [ ] `ClientManagement.tsx`: live search input filtering, KYB filter pills, sortable table headers (visual state only), 10 client rows
- [ ] `RiskAlerts.tsx`: 4 metric cards, 3 alert cards with severity-tinted glass, dismiss state removes from list, all-clear empty state

### Key differences to get right
| Detail | Portal | Admin |
|---|---|---|
| Background orbs | `#0d3830` / `#0a2a22` (teal tint) | `#1a0a0a` / `#12080a` (red tint) |
| Primary accent | `#a8ff3e` lime | `#ff5a5a` red |
| Logo outer ring | `#a8ff3e` | `#ff5a5a` |
| Logo inner ring | `#00d4aa` | `#ffb547` |
| Logo sub-label | `WORKSPACE` (#00d4aa) | `Admin Panel` (#ffb547) |
| Active nav color | `#a8ff3e` | `#ff5a5a` |
| TopBar right section | health pill (lime) | pending count pill (amber, pulsing) |
| Has right rail | Yes (348px) | No |
| Has center search | No | Yes (full-width) |
| Active filter pill | lime | red |
| Avatar ring gradient | `#00d4aa → #9b7ff4` | `#ff5a5a → #ffb547` |
| Avatar name hover | → #a8ff3e | → #ff5a5a |
