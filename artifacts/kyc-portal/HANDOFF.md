# NexusKYC Dashboard — Full UI Replication Handoff

> Complete implementation handoff for exact pixel-level reproduction in a separate codebase.
> All values below are taken directly from source. Nothing is paraphrased.

---

## 1. UI Overview

**Product name:** NexusKYC  
**Type:** KYC/KYB compliance portal — single-page SPA with tab-switched content and a persistent right rail  
**Design language:** Dark glassmorphic fintech — deep teal/emerald base, lime-neon accent, glass panels with blur + inset shine, animated presence for all major elements  
**Layout zones (left → right):**

```
┌──────┬─────────────────────────────────────┬────────────┐
│  72px│  TopBar (sticky, h:64px)            │            │
│ Side │─────────────────────────────────────│  Right     │
│ bar  │  Page header + Tab strip            │  Rail      │
│      │─────────────────────────────────────│  (348px)   │
│      │  Tab Content Area (flex-1)          │            │
│      │  (switches between 4 tab panels)    │            │
└──────┴─────────────────────────────────────┴────────────┘
```

---

## 2. Layout Map

### Root shell
```
<body background="#050c0e">
  Fixed atmospheric mesh gradients (z-0, pointer-events:none)
  <Sidebar />          fixed, left:0, top:0, bottom:0, z:50, width:72px (expands to 240px on hover)
  <TopBar />           sticky top:0, z:40, marginLeft:72, height:64px
  <main marginLeft:72, z:10>
    <div flex min-h-screen>
      <div flex-1 p-8 pr-4>    ← Main content
        Page header (h1 + subtitle + tab strip)
        <AnimatePresence>
          <TabPanel> (one of 4 panels, animated in/out)
        </AnimatePresence>
      </div>
      <div width:348px flex-shrink-0>  ← Right rail (persistent)
        <RightPanel />
      </div>
    </div>
  </main>
```

### Tab panels (each fills the main content flex-1 area)
- **Overview:** 4-col KPI grid → 12-col chart row → 4-col bottom cards
- **Verification:** 12-col (5+7) top row → 12-col (7+5) bottom row
- **Integrations:** full-width API keys block → 12-col (7+5) bottom row
- **Billing:** 3-col top row → 12-col (5+7) bottom row

### Right rail (always visible)
- Account Summary Card (gradient glass, teal border)
- Recent Activity list (5 items)
- Onboarding checklist (5 steps, progress bar)

---

## 3. Exact Visible Copy

### TopBar
- Breadcrumb left: `Portal  ›  Account Overview`
- Health pill: `● All systems operational`
- Avatar name: `Stefan`
- Avatar sub: `Acme Corp Ltd`
- (Bell icon with red dot, HelpCircle icon — no labels)

### Sidebar (collapsed, tooltips on hover)
- Logo: animated concentric rings, center dot, label `NexusKYC`
- Nav items: `Overview`, `Usage`, `Webhooks`, `Billing`, `API Keys`, `Audit Logs`, `KYB Upload`
- Footer items: `Admin Panel`, `Settings`, `Log Out`

### Tab strip
- `Overview` | `Verification` | `Integrations` | `Billing`

### Subtitles (change per active tab)
- Overview: `KYB progress, integration health, billing status, and recent activity`
- Verification: `KYB verification state, submitted documents, risk assessment, and history`
- Integrations: `API keys, webhook endpoints, delivery health, and developer activity`
- Billing: `Current balance, plan details, usage this cycle, and billing history`

### Overview tab
**KPI rings (left → right):**
- `Verified` / `KYB STATUS` / 100% / color #00d4aa
- `Active` / `OPS STATUS` / 90% / color #a8ff3e
- `Low` / `RISK TIER` / 75% / color #9b7ff4
- `Growth` / `PLAN` / 60% / color #ffb547

**Jobs Processed chart:**
- Title: `Jobs Processed`
- Subtitle: `Verification jobs run via API — last 6 months`
- Link: `View Usage →`
- Headline metric: `1,124  jobs this month`
- Delta: `+29%  vs last month`
- Data: Oct 312 | Nov 548 | Dec 491 | Jan 703 | Feb 867 | Mar 1124

**Webhooks donut:**
- Title: `Webhooks`
- Subtitle: `DELIVERY STATUS`
- Link: `View All →`
- Center: `1,362 / TOTAL EVENTS`
- Legend: Delivered 1,248 / Failed 23 / Pending 91

**Bottom cards (4):**
1. `BILLING BALANCE` / `$0.00` / `$250 credit included · resets Apr 1` / badge: `No overages` / link: `View →`
2. `API KEYS ACTIVE` / `3` / `2 production · 1 sandbox` / badge: `All valid` / link: `View →`
3. `WEBHOOK FAILURES` / `23` / `Last 30 days · 1.8% fail rate` / badge: `Review needed` / link: `View →`
4. `AUDIT EVENTS` / `847` / `March 2026 · exportable` / badge: `Up to date` / link: `View →`

### Verification tab
**KYB Status card:**
- Label: `KYB Status`
- Value: `Verified`
- Badge: `✓ Approved`
- Sub: `Verified Mar 18, 2026 · expires Mar 18, 2028`
- Sub-fields: `Entity Type: Private Ltd` | `Risk Tier: Low` | `Jurisdiction: UK`

**Risk Assessment:**
- Header badge: `Low Risk`
- Rows: Jurisdiction / United Kingdom / clear | PEP Screening / No matches / clear | Sanctions Check / No matches / clear | Adverse Media / No flags / clear | UBO Complexity / 2 beneficial owners / review

**Submitted Documents:**
- Link: `Upload More →`
- 1. `Certificate of Incorporation` / verified / Mar 15, 2026 / 2.4 MB
- 2. `Proof of Registered Address` / verified / Mar 15, 2026 / 1.1 MB
- 3. `Director — National ID (Stefan A.)` / verified / Mar 16, 2026 / 0.8 MB
- 4. `UBO Declaration Form` / verified / Mar 17, 2026 / 0.5 MB
- 5. `Latest Audited Financials` / pending / Requested Mar 20 / —

**Verification Timeline:**
- `KYB verification approved` / Mar 18, 2026
- `UBO declaration reviewed` / Mar 17, 2026
- `Director identity confirmed` / Mar 16, 2026
- `Documents submitted` / Mar 15, 2026
- `KYB application opened` / Mar 14, 2026

### Integrations tab
**API Keys:**
- Title: `API Keys`
- Sub: `3 active keys across production and sandbox`
- CTA: `+ New Key`
- Row 1: `Production Key` / `pk_live_4x8aK9mN••••••••` / production / Last used: `2 min ago`
- Row 2: `Sandbox Key` / `pk_test_7pRjQ2xW••••••••` / sandbox / Last used: `Mar 18, 2026`
- Row 3: `CI / Test Runner` / `pk_test_9mZvL3kB••••••••` / sandbox / Last used: `Mar 22, 2026`

**Webhook Endpoints:**
- Title: `Webhook Endpoints`
- Sub: `3 configured · 1 degraded`
- Link: `Manage →`
- Row 1: `https://api.acme.co/hooks/kyb-events` / Healthy / 1248 delivered / 3 failed / events: `kyb.verified` `kyb.rejected`
- Row 2: `https://api.acme.co/hooks/billing` / Degraded / 412 delivered / 20 failed / events: `billing.invoice.created`
- Row 3: `https://staging.acme.co/hooks/test` / Healthy / 89 delivered / 0 failed / events: `*`

**Delivery Activity:**
- Title: `Delivery Activity`
- Sub: `Last 24 hours`
- Area chart: delivered (purple) + failed (red) lines, 7 time points
- Section: `RECENT EVENTS`
- `kyb.verified` / delivered / 2 min ago
- `billing.invoice.created` / failed / 14 min ago
- `kyb.document.uploaded` / delivered / 1 hour ago
- `kyb.verified` / delivered / 2 hours ago
- Button: `↺ Replay Failed Events`

### Billing tab
**Top 3 cards:**
- `CURRENT BALANCE` / `$0.00` (JetBrains Mono) / `$250 included credit · no overages` / badge: `No overages` / `⬒ Resets Apr 1`
- `CURRENT PLAN` / `Growth` / `$250 / month · included` / features: `✓ 5,000 verification jobs / month` / `✓ 3 production API keys` / `✓ Unlimited webhook endpoints`
- `USAGE THIS CYCLE` / `1,124 / 5,000 jobs` / `Mar 1 – Mar 23, 2026` / `22.5% of limit used` / `3,876 remaining`

**Monthly Job Usage chart:**
- Title: `Monthly Job Usage`
- Sub: `Last 6 months`
- Same data as Jobs Processed

**Billing Ledger:**
- Title: `Billing Ledger`
- Sub: `Credits and usage charges`
- Button: `⬇ Export CSV`
- Cols: Description | Amount | Balance
- Row 1: Monthly plan — Growth / Mar 1, 2026 / $250.00 / $250.00
- Row 2: Jobs processed (1,124 × $0.00) / Mar 1–23 / $0.00 / $250.00
- Row 3: Monthly plan — Growth / Feb 1, 2026 / $250.00 / $250.00
- Row 4: Jobs processed (867 × $0.00) / Feb 1–28 / $0.00 / $250.00
- Footer: `Showing last 4 entries` / `Full billing history →`

### Right rail (all tabs)
**Account Summary Card:**
- Status chip: `● ACTIVE`
- Company: `Acme Corp Ltd`
- Sub: `KYB Verified · Growth Plan`
- Fields: Tenant ID: `ten_4x8aK9mNpQ2r` (copyable) | Environment: `Production` | Plan: `Growth` | Billing Balance: `$0.00 / $250 credit` | Cycle resets: `Apr 1, 2026`
- Usage: `MONTHLY USAGE` / `1,124 / 5,000 jobs`
- Progress bar: 22.5% filled / `22% of plan limit · resets Apr 1`
- CTA button: `View Billing & Plan →`

**Recent Activity:**
- Header link: `Audit Logs ›`
- `API key rotated` / `prod_key_**** → new key` / Mar 22
- `Webhook test sent` / `endpoint: /hooks/kyb` / Mar 21
- `KYB document uploaded` / `Certificate of Incorporation` / Mar 20
- `Audit log exported` / `March 2026 · 847 events` / Mar 19
- `Delivery replayed` / `evt_8xKp2mNq · success` / Mar 18

**Onboarding:** `3/5 complete`
- ✓ KYB verification completed (strikethrough)
- ✓ First API key created (strikethrough)
- ✓ Webhook endpoint configured (strikethrough)
- ○ Test webhook delivery confirmed
- ○ Go live in production

---

## 4. Component Breakdown

| Component | File | Purpose | Props |
|---|---|---|---|
| `Dashboard` | `pages/Dashboard.tsx` | Root page shell, tab state, layout | — |
| `Sidebar` | `components/layout/Sidebar.tsx` | Fixed left nav, expands on hover | — |
| `TopBar` | `components/layout/TopBar.tsx` | Sticky top bar, breadcrumb, avatar | — |
| `OverviewTab` | `components/dashboard/tabs/OverviewTab.tsx` | Default tab content | — |
| `VerificationTab` | `components/dashboard/tabs/VerificationTab.tsx` | KYB/docs/risk tab | — |
| `IntegrationsTab` | `components/dashboard/tabs/IntegrationsTab.tsx` | API keys/webhooks tab | — |
| `BillingTab` | `components/dashboard/tabs/BillingTab.tsx` | Billing/ledger tab | — |
| `RightPanel` | `components/dashboard/RightPanel.tsx` | Persistent right rail | — |
| `AccountSummaryCard` | `components/dashboard/AccountSummaryCard.tsx` | Tenant info, usage bar, CTA | — |
| `KPICard` | `components/dashboard/KPICard.tsx` | Animated SVG ring card | `title`, `value`, `percent`, `color`, `delay?`, `trend?` |
| `UsageChart` | `components/dashboard/UsageChart.tsx` | Bar chart for job volume | — |
| `WebhookDonut` | `components/dashboard/WebhookDonut.tsx` | Donut chart for delivery status | — |
| `GlassPanel` | `components/GlassPanel.tsx` | Reusable glass card wrapper | `hoverable?`, `className?` |

**Tab switching mechanism:**  
`useState<TabId>("overview")` in Dashboard. `AnimatePresence mode="wait"` wraps a `TabPanel` renderer keyed on `activeTab`. Transition: `opacity: 0, y:14` → `opacity:1, y:0` → `opacity:0, y:-8`, duration `0.22s`, easing `[0.16, 1, 0.3, 1]`.

**Active tab indicator:** Framer `layoutId="active-tab-bg"` div absolutely positioned inside the active button — spring animation `stiffness:400 damping:30`.

**Subtitle:** `AnimatePresence mode="wait"` around a `<p>` keyed on activeTab, fades opacity 0→1→0 in 0.18s.

---

## 5. Styling System

### Color palette (exact hex)
```
Background base:    #050c0e
Foreground text:    #f0f8f5
Muted text:         #6b8a82
Dimmer muted:       #3d5a52

Accent lime:        #a8ff3e   (primary CTA, active tab, active nav, logo)
Accent teal:        #00d4aa   (KYB verified, links, progress bars)
Accent purple:      #9b7ff4   (charts, current month bars, API keys)
Accent amber:       #ffb547   (Plan KPI ring, pending states)
Accent red:         #ff5a5a   (failures, admin, logout)
Accent cyan:        #3de8e8   (unused in main dashboard)
```

### Background gradients
**Page atmospheric mesh (fixed, z:0):**
```css
/* Left-top orb */
radial-gradient(ellipse 80% 60% at 10% 20%, #0d3830 0%, transparent 60%)
width:80%, height:60%, top:-10%, left:-10%

/* Right-bottom orb */
radial-gradient(ellipse 60% 50% at 85% 70%, #0a2a22 0%, transparent 55%)
width:60%, height:50%, bottom:-10%, right:-10%
```

**Account Summary Card gradient:**
```css
background: linear-gradient(135deg, #0d3830 0%, #072620 40%, #050c0e 100%);
border: 1px solid rgba(0,212,170,0.2);
box-shadow: 0 0 40px rgba(0,212,170,0.06), 0 8px 32px rgba(0,0,0,0.5);
```

**Billing Plan card gradient (special):**
```css
background: linear-gradient(135deg, rgba(13,56,48,0.6) 0%, rgba(7,38,32,0.4) 100%);
border: 1px solid rgba(0,212,170,0.2);
```

### Glass card (standard — used everywhere)
```css
background: rgba(255,255,255,0.04);
backdrop-filter: blur(16px);
border: 1px solid rgba(255,255,255,0.08);
border-radius: 20px;
box-shadow: 0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.06);
```
Tailwind shorthand: `bg-white/[0.04] backdrop-blur-[16px] border border-white/[0.08] rounded-[16px] shadow-[0_8px_32px_rgba(0,0,0,0.3)]`

**GlassPanel utility class** (from `index.css`):
```css
.glass-panel {
  background: rgba(255,255,255,0.03);
  backdrop-filter: blur(24px); /* xl */
  border: 1px solid rgba(255,255,255,0.08);
  box-shadow: 0 8px 32px 0 rgba(0,0,0,0.3);
}
.glass-panel-hover:hover {
  background: rgba(255,255,255,0.06);
  border-color: rgba(255,255,255,0.15);
  transform: translateY(-4px);
}
```
`GlassPanel` also adds an absolute inset-x-0 top-0 `h-px` gradient line: `from-transparent via-white/20 to-transparent opacity-50` (inset shine effect).

### Sidebar glass
```css
background: rgba(255,255,255,0.03);
backdrop-filter: blur(24px);
border-right: 1px solid rgba(255,255,255,0.08);
```

### TopBar
```css
background: rgba(5,12,14,0.90);
backdrop-filter: blur(24px) saturate(160%);
border-bottom: 1px solid rgba(255,255,255,0.06);
height: 64px;
```

### Right rail
```css
background: rgba(255,255,255,0.03);
backdrop-filter: blur(20px);
border-left: 1px solid rgba(255,255,255,0.07);
min-height: 100vh;
```

### Tab strip container
```css
background: rgba(255,255,255,0.04);
border: 1px solid rgba(255,255,255,0.07);
border-radius: 12px;
padding: 4px;
```

### Active tab button
```css
background: #a8ff3e;
box-shadow: 0 0 20px rgba(168,255,62,0.35);
border-radius: 8px;
color: #050c0e;  /* dark text on lime */
```

### Inactive tab button
```css
color: #6b8a82;
/* hover: */ color: #f0f8f5;
```

### Health pill (TopBar)
```css
background: rgba(168,255,62,0.08);
border: 1px solid rgba(168,255,62,0.18);
color: #a8ff3e;
border-radius: 9999px;
padding: 6px 12px;
font-size: 12px;
font-weight: 600;
```
Dot inside: `w-1.5 h-1.5 rounded-full background:#a8ff3e box-shadow:0 0 6px rgba(168,255,62,0.7)`

### Hover states on cards
```css
/* KPI card hover */
transform: translateY(-4px);
box-shadow: 0 16px 48px rgba(0,0,0,0.5), 0 0 20px {color}30;

/* Bottom summary cards hover */
transform: translateY(-3px);
box-shadow: 0 16px 40px rgba(0,0,0,0.5), 0 0 20px {iconColor}18;
```

### Notification bell badge
```css
width: 8px; height: 8px;
background: #ff5a5a;
border: 1.5px solid #050c0e;
border-radius: 50%;
position: absolute; top: 4px; right: 4px;
```

### Sidebar active nav item
```css
background: rgba(168,255,62,0.1);  /* bg-accent-lime/10 */
color: #a8ff3e;
/* indicator: */
position: absolute; left:0; top:8px; bottom:8px; width:4px;
background: #a8ff3e;
border-radius: 0 4px 4px 0;
box-shadow: 0 0 20px #a8ff3e;   /* .box-glow */
```
Framer `layoutId="active-nav"` so it slides between items.

### Sidebar hover nav item
```css
color: #f0f8f5;
background: rgba(255,255,255,0.05);
/* icon hover: */ color: #00d4aa;
```

### Progress bars
```css
/* Track */
height: 6px; border-radius: 9999px;
background: rgba(255,255,255,0.07);

/* Fill — Account Summary */
background: linear-gradient(90deg, #00d4aa, #a8ff3e);
box-shadow: 0 0 8px rgba(0,212,170,0.5);

/* Fill — Billing Usage */
background: linear-gradient(90deg, #9b7ff4, #a8ff3e);

/* Onboarding bar */
height: 4px;
background: linear-gradient(90deg, #00d4aa, #a8ff3e);
```

### KPI ring card
```css
height: 168px;
background: rgba(255,255,255,0.04);
backdrop-filter: blur(16px);
border: 1px solid rgba(255,255,255,0.08);
border-radius: 20px;
box-shadow: 0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06);
```

**SVG ring (size=120px):**
```
strokeWidth: 8px
radius: (120 - 16) / 2 = 52px
Track stroke: rgba(255,255,255,0.07)
Fill stroke: the card's color prop
strokeLinecap: round
filter: drop-shadow(0 0 8px {color}50)
Rotate SVG -90deg (start from top)
Animation: stroke-dashoffset, 1.2s cubic-bezier(0.34,1.56,0.64,1), with delay prop
```

**Ring center text:**
```css
/* Value */
font-family: 'Clash Display';
font-weight: 700;
font-size: 18px (or 12px if value.length > 7);
color: #f0f8f5;
letter-spacing: -0.02em;

/* Title */
font-family: 'DM Sans';
font-size: 9px;
font-weight: 500;
color: #6b8a82;
letter-spacing: 0.08em;
text-transform: uppercase;
margin-top: 5px;
```

**Radial glow behind ring:**
```css
position: absolute; inset: 0; border-radius: 20px;
opacity: 0.06;
background: radial-gradient(circle at center, {color}, transparent 70%);
```

**Top inset shine on KPI card:**
```css
position: absolute; top:0; left:0; right:0; height:1px;
background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent);
```

### Avatar ring gradient
```css
background: linear-gradient(135deg, #00d4aa, #9b7ff4);
padding: 2px;
border-radius: 50%;
width: 36px; height: 36px;
```

### Sidebar logo mark
- Outer ring: `border-2 border-accent-lime rounded-full opacity-80` — rotates 360° every 20s (linear, infinite)
- Inner ring: `border-2 border-accent-teal rounded-full opacity-60` — counter-rotates 360° every 15s
- Center dot: `w-2 h-2 bg-accent-lime rounded-full box-glow`

---

## 6. Typography

```css
/* Fonts imported */
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000...');
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600...');
@import url('https://api.fontshare.com/v2/css?f[]=clash-display@400,500,600,700&display=swap');

--font-display: 'Clash Display', sans-serif   → headings, values, card numbers
--font-sans:    'DM Sans', sans-serif          → body, labels, descriptions
--font-mono:    'JetBrains Mono', monospace    → tenant ID, API keys, chart ticks, balances

/* Page title */
font: Clash Display 700, 38px, tracking -0.03em, leading 1.1

/* Section headings (cards) */
font: Clash Display 700, 18px

/* KPI ring value */
font: Clash Display 700, 18px (or 12px if len > 7), tracking -0.02em

/* Large metric numbers (chart, billing) */
font: Clash Display 700, 28–36px, tracking -0.02em to -0.03em

/* Billing balance */
font: JetBrains Mono 700, 36px, tracking -0.03em

/* Labels / muted text */
font: DM Sans 400–500, 10–12px

/* Uppercase section labels */
font-size: 10–11px; text-transform: uppercase; letter-spacing: 0.06–0.08em

/* API key values, mono data */
font: JetBrains Mono 400–600, 10–11px
```

---

## 7. Layout Measurements (exact)

| Element | Value |
|---|---|
| Sidebar collapsed width | `72px` |
| Sidebar expanded width | `240px` (on hover, animated) |
| Sidebar expand duration | `0.3s ease "anticipate"` |
| TopBar height | `64px` |
| TopBar left margin | `72px` |
| Main content left margin | `72px` |
| Main content padding | `p-8 pr-4` (32px top/left/bottom, 16px right) |
| Right rail width | `348px` |
| Right rail padding | `p-6` (24px) |
| Gap between content and right rail | 0 (flex, no gap) |
| Grid gap — KPI cards | `16px` (`gap-4`) |
| Grid gap — chart row | `20px` (`gap-5`) |
| Grid gap — bottom cards | `16px` (`gap-4`) |
| KPI card height | `168px` |
| KPI ring SVG size | `120px × 120px` |
| KPI ring strokeWidth | `8px` |
| KPI ring radius | `52px` |
| Donut chart total size | `160px × 160px` |
| Donut innerRadius | `52px` |
| Donut outerRadius | `70px` |
| Bottom summary card padding | `p-5` (20px) |
| Section gap in right rail | `gap-6` (24px) |
| Activity item height | `h-14` (56px) |
| Ledger row height | `h-12` (48px) |
| Card border-radius | `20px` (rounded-2xl) |
| Tab button padding | `px-5 py-2` |
| Tab button radius | `8px` |
| Tab strip padding | `p-1` (4px) |
| Tab strip radius | `12px` (rounded-xl) |
| Usage bar height | `6px` (`h-1.5`) |
| Onboarding bar height | `4px` (`h-1`) |
| Icon sizes (nav) | `w-5 h-5` (20px) |
| Icon sizes (card) | `w-4 h-4` (16px) |
| Activity icon container | `w-8 h-8 rounded-lg` (32px) |
| API key icon container | `w-8 h-8 rounded-lg` (32px) |
| TopBar notification bell | `w-5 h-5` (20px) |
| TopBar notification dot | `8px × 8px` |
| Avatar ring container | `w-9 h-9` (36px) |
| Account Summary card ambient glow | `w-32 h-32` top-right corner |

---

## 8. Icons

All icons from `lucide-react`.

| Icon | Where | Size | Color |
|---|---|---|---|
| `LayoutDashboard` | Sidebar — Overview | w-5 h-5 | active: #a8ff3e, inactive: #6b8a82 → hover: #00d4aa |
| `BarChart2` | Sidebar — Usage | w-5 h-5 | same |
| `Webhook` | Sidebar — Webhooks | w-5 h-5 | same |
| `CreditCard` | Sidebar — Billing | w-5 h-5 | same |
| `Key` | Sidebar — API Keys | w-5 h-5 | same |
| `ScrollText` | Sidebar — Audit Logs | w-5 h-5 | same |
| `Upload` | Sidebar — KYB Upload | w-5 h-5 | same |
| `Shield` | Sidebar — Admin Panel | w-5 h-5 | hover: #ff5a5a |
| `Settings` | Sidebar footer | w-5 h-5 | hover rotates 90° (transition-transform 500ms) |
| `LogOut` | Sidebar footer | w-5 h-5 | hover: #ff5a5a |
| `Bell` | TopBar | w-5 h-5 | #6b8a82 |
| `HelpCircle` | TopBar | w-5 h-5 | #6b8a82 |
| `ChevronRight` | TopBar breadcrumb | w-3.5 h-3.5 | #3d5a52 |
| `ChevronRight` | Right rail "Audit Logs" link | w-3 h-3 | #00d4aa |
| `Copy` / `CheckCircle2` | Tenant ID copy button | w-3 h-3 | inactive: #3d5a52, copied: #a8ff3e |
| `Copy` / `CheckCircle2` | API key copy button | w-4 h-4 | inactive: #6b8a82, copied: #a8ff3e |
| `BookOpen` | Billing Balance card | w-4 h-4 | #a8ff3e |
| `Key` | API Keys card | w-4 h-4 | #00d4aa |
| `AlertTriangle` | Webhook Failures card | w-4 h-4 | #ff5a5a |
| `ScrollText` | Audit Events card | w-4 h-4 | #9b7ff4 |
| `Key` | Recent Activity — API key | w-3.5 h-3.5 | #a8ff3e |
| `Webhook` | Recent Activity — webhook | w-3.5 h-3.5 | #9b7ff4 |
| `Upload` | Recent Activity — doc upload | w-3.5 h-3.5 | #00d4aa |
| `FileText` | Recent Activity — audit | w-3.5 h-3.5 | #ffb547 |
| `RefreshCw` | Recent Activity — replay | w-3.5 h-3.5 | #ff5a5a |
| `CheckCircle2` | Onboarding done | w-4 h-4 | #00d4aa |
| `Circle` | Onboarding not done | w-4 h-4 | #3d5a52 |
| `ShieldCheck` | Verification status | w-7 h-7 | #00d4aa |
| `CheckCircle2` | Risk factor — clear | w-3.5 h-3.5 | #00d4aa |
| `AlertTriangle` | Risk factor — review | w-3.5 h-3.5 | #ffb547 |
| `FileText` | Document list | w-4 h-4 | matches doc status color |
| `Activity` | Delivery Activity header | w-4 h-4 | #9b7ff4 |
| `Plus` | New Key button | w-3 h-3 | #a8ff3e |
| `Circle` | Webhook health dot | w-1.5 h-1.5 fill-current | matches health color |
| `RefreshCw` | Replay Failed Events | w-3 h-3 | #9b7ff4 |
| `BookOpen` | Billing Balance | w-5 h-5 | #a8ff3e |
| `Zap` | Current Plan | w-5 h-5 | #00d4aa |
| `TrendingUp` | Usage This Cycle | w-5 h-5 | #9b7ff4 |
| `Calendar` | Resets Apr 1 | w-3 h-3 | #6b8a82 |
| `Download` | Export CSV | w-3.5 h-3.5 | #6b8a82 |

---

## 9. Interaction Behavior

### Sidebar
- **Collapsed state:** 72px wide, shows icons only, tooltip appears on hover (left-14, bg #0a181c, border white/10, rounded-lg, z-50)
- **Expanded state:** 240px wide on `onMouseEnter`, collapses on `onMouseLeave`. Duration 0.3s ease "anticipate"
- **Label animation:** `AnimatePresence` fade in/out, opacity 0→1 with x shift
- **Active item:** lime background + left indicator bar. `layoutId="active-nav"` so indicator slides
- **Admin Panel hover:** text → #ff5a5a, bg → rgba(255,90,90,0.1)
- **Settings hover:** icon rotates 90° (transition-transform 500ms)

### TopBar
- **Breadcrumb:** reads `useLocation()` from wouter, maps to `ROUTE_LABELS`. Static — no click behavior
- **Health pill:** static display, not clickable
- **Bell:** button with hover color #f0f8f5, red dot badge
- **Help:** button with hover color #f0f8f5
- **Avatar:** hover changes name text color to #a8ff3e (transition-colors)

### Tab strip
- Click sets `activeTab` state
- Active highlight slides via `layoutId="active-tab-bg"`, spring stiffness 400 damping 30
- Content area: `AnimatePresence mode="wait"`, enter: `{opacity:0, y:14}`, exit: `{opacity:0, y:-8}`, 0.22s ease `[0.16,1,0.3,1]`
- Subtitle fades 0→1→0 in 0.18s keyed to activeTab

### KPI cards
- Hover: `translateY(-4px)`, box-shadow adds `0 16px 48px rgba(0,0,0,0.5), 0 0 20px {color}30`
- Ring fill animates on mount via stroke-dashoffset, `1.2s cubic-bezier(0.34,1.56,0.64,1)` with stagger delay prop

### AccountSummaryCard — Copy Tenant ID
- `navigator.clipboard.writeText(TENANT_ID)` on click
- Icon switches Copy → CheckCircle2, color → #a8ff3e
- Resets after 2000ms

### IntegrationsTab — Copy API Key
- Same pattern: `navigator.clipboard.writeText(key)`, per-key state `copiedKey`

### Activity items (RightPanel)
- `whileHover={{ background:"rgba(255,255,255,0.04)", borderLeftColor:"#00d4aa" }}`
- Title text transitions to #00d4aa on group hover

### Document rows (VerificationTab)
- `onMouseEnter/Leave` manually set `borderLeftColor` — `2px solid transparent` → `#00d4aa`
- Title text: `group-hover:text-[#00d4aa]`

### Bottom summary cards (OverviewTab)
- `onMouseEnter/Leave` manually set transform + box-shadow via `e.currentTarget.style`

### WebhookDonut
- Recharts animation: `animationBegin:300` `animationDuration:1400`
- Legend items: Framer fade+slide in from x:8

### Ledger rows (BillingTab)
- `onMouseEnter/Leave` set background rgba(255,255,255,0.04)

### Usage progress bars
- Framer motion: `initial width:0`, `animate width:{percent}%`, delayed, ease "easeOut"

### Sidebar tooltip (collapsed only)
```css
position: absolute; left: 56px; (left-14)
background: #0a181c;
border: 1px solid rgba(255,255,255,0.1);
border-radius: 8px;
font-size: 14px;
color: #f0f8f5;
opacity: 0 → group-hover:opacity-100
pointer-events: none;
white-space: nowrap;
z-index: 50;
```

---

## 10. Data Sources / Mock Data

All data is **static / hardcoded**. No API calls. No database. Every value is a constant defined in the component or at module scope.

| Widget | Data location | Shape |
|---|---|---|
| KPI rings | Inline in `OverviewTab.tsx` props | `{ title, value, percent, color, delay }` |
| Jobs Processed chart | `const data` in `UsageChart.tsx` | `[{ name: string, value: number }]` (6 entries) |
| Webhook donut | `const data` in `WebhookDonut.tsx` | `[{ name, value, color }]` (3 entries) |
| Bottom summary cards | `const BOTTOM_CARDS` in `OverviewTab.tsx` | `[{ label, value, sub, badge, badgeColor, badgeBg, href, icon, iconColor }]` |
| Account Summary fields | `const FIELDS` in `AccountSummaryCard.tsx` | `[{ label, value, mono, copyable }]` |
| Recent Activity | `const ACTIVITY` in `RightPanel.tsx` | `[{ id, label, detail, time, icon, color, bg }]` |
| Onboarding steps | `const ONBOARDING` in `RightPanel.tsx` | `[{ label, done: boolean }]` |
| KYB documents | `const DOCUMENTS` in `VerificationTab.tsx` | `[{ name, status, date, size }]` |
| Risk factors | `const RISK_FACTORS` in `VerificationTab.tsx` | `[{ label, value, status }]` |
| Verification timeline | `const TIMELINE` in `VerificationTab.tsx` | `[{ event, date, color, icon }]` |
| API keys | `const API_KEYS` in `IntegrationsTab.tsx` | `[{ name, key, env, created, lastUsed, status }]` |
| Webhook endpoints | `const WEBHOOKS` in `IntegrationsTab.tsx` | `[{ url, events, health, deliveries, failures }]` |
| Delivery chart | `const deliveryData` in `IntegrationsTab.tsx` | `[{ h, delivered, failed }]` (7 time points) |
| Recent deliveries | `const RECENT_DELIVERIES` in `IntegrationsTab.tsx` | `[{ id, endpoint, event, status, time }]` |
| Billing top cards | `const usedJobs=1124; planJobs=5000` computed | inline constants |
| Usage chart | `const USAGE_DATA` in `BillingTab.tsx` | `[{ month, jobs, cost }]` (same 6 months) |
| Billing ledger | `const LEDGER` in `BillingTab.tsx` | `[{ description, type, amount, date, balance }]` |

---

## 11. File-by-File Breakdown

```
artifacts/kyc-portal/
├── src/
│   ├── index.css                        CSS variables, font imports, utility classes
│   ├── App.tsx                          Router (wouter), query client, route definitions
│   ├── pages/
│   │   └── Dashboard.tsx                Root page: shell, tab state, AnimatePresence
│   ├── components/
│   │   ├── GlassPanel.tsx               Reusable motion.div with glass styles + inset shine
│   │   ├── layout/
│   │   │   ├── Sidebar.tsx              Fixed expandable nav, logo mark, nav items, footer items
│   │   │   └── TopBar.tsx               Sticky bar: breadcrumb, health pill, bell, help, avatar
│   │   └── dashboard/
│   │       ├── KPICard.tsx              SVG ring card, animated stroke-dashoffset
│   │       ├── AccountSummaryCard.tsx   Tenant info, copyable ID, usage bar, billing CTA
│   │       ├── UsageChart.tsx           Recharts BarChart (6 months), hatch + purple current bar
│   │       ├── WebhookDonut.tsx         Recharts PieChart donut + legend
│   │       ├── RightPanel.tsx           Account Summary + Activity list + Onboarding checklist
│   │       └── tabs/
│   │           ├── OverviewTab.tsx      4 KPI rings + chart row + 4 bottom cards
│   │           ├── VerificationTab.tsx  KYB status + risk + docs + timeline
│   │           ├── IntegrationsTab.tsx  API keys + webhook endpoints + delivery chart
│   │           └── BillingTab.tsx       Balance + plan + usage + chart + ledger
```

**Dependencies required:**
```json
{
  "framer-motion": "^11.x",
  "recharts": "^2.x",
  "wouter": "^3.x",
  "lucide-react": "^0.4xx",
  "@tanstack/react-query": "^5.x",
  "tailwindcss": "^4.x",
  "clsx": "^2.x",
  "tailwind-merge": "^2.x"
}
```

---

## 12. Full Source Code

All source files are included verbatim in this repository. Key files to read in order:

1. `src/index.css` — token system, font imports, utility classes
2. `src/App.tsx` — routing
3. `src/pages/Dashboard.tsx` — shell + tab machine
4. `src/components/layout/Sidebar.tsx`
5. `src/components/layout/TopBar.tsx`
6. `src/components/GlassPanel.tsx`
7. `src/components/dashboard/KPICard.tsx`
8. `src/components/dashboard/AccountSummaryCard.tsx`
9. `src/components/dashboard/UsageChart.tsx`
10. `src/components/dashboard/WebhookDonut.tsx`
11. `src/components/dashboard/RightPanel.tsx`
12. `src/components/dashboard/tabs/OverviewTab.tsx`
13. `src/components/dashboard/tabs/VerificationTab.tsx`
14. `src/components/dashboard/tabs/IntegrationsTab.tsx`
15. `src/components/dashboard/tabs/BillingTab.tsx`

---

## 13. Rebuild Instructions

### Required setup
1. React + TypeScript + Vite
2. Install all dependencies listed above
3. Configure Tailwind v4 with `@theme inline` block (see `index.css`)
4. Load three fonts: Clash Display (fontshare CDN), DM Sans (Google), JetBrains Mono (Google)
5. Set CSS vars: `--background: #050c0e`, `--foreground: #f0f8f5`

### Required layout order
```
1. Fixed sidebar (z:50) — 72px collapsed, 240px expanded on hover
2. Sticky TopBar (z:40) — 64px tall, starts at marginLeft:72px
3. main element (marginLeft:72px, z:10, relative)
   └── flex row, min-h-screen
       ├── flex-1 content column (p-8 pr-4)
       │   ├── Page heading (h1 "Account Overview")
       │   ├── Animated subtitle (keyed on activeTab)
       │   ├── Tab strip (4 buttons, lime active indicator with layoutId)
       │   └── AnimatePresence > TabPanel (keyed on activeTab)
       └── 348px right rail (flex-shrink-0, borderLeft)
           └── RightPanel (AccountSummary + Activity + Onboarding)
4. Fixed atmospheric gradients (z:0, pointer-events:none)
```

### Required styles to replicate
- `#050c0e` base background everywhere
- Glass cards: `rgba(255,255,255,0.04)` bg + `blur(16px)` + `rgba(255,255,255,0.08)` border + `20px` radius
- Inset shine on every glass card: 1px top gradient line
- Sidebar: same glass but `rgba(255,255,255,0.03)` — slightly more transparent
- TopBar: `rgba(5,12,14,0.90)` + `blur(24px) saturate(160%)`
- Right rail: `rgba(255,255,255,0.03)` + `blur(20px)` + left border

### Required interactions
1. **Tab switching** — `useState`, `AnimatePresence mode="wait"`, keyed panels, slide-fade transition
2. **Active tab indicator** — Framer `layoutId` div inside button, lime background, spring animation
3. **Subtitle changes** — `AnimatePresence mode="wait"` around `<p>` keyed on activeTab
4. **Sidebar expand** — `motion.aside` width 72→240 on hover
5. **Sidebar active nav** — `layoutId="active-nav"` indicator bar
6. **KPI ring animation** — stroke-dashoffset CSS transition with delay
7. **Copy to clipboard** — `navigator.clipboard.writeText()`, icon swap, 2s reset
8. **Card hover lift** — `translateY(-4px)` + glow shadow via `e.currentTarget.style`
9. **Activity item hover** — `whileHover` framer prop or group CSS
10. **Progress bars** — Framer `animate={{ width: "X%" }}` from `initial={{ width: 0 }}`

### Required routes (wouter)
```
/           → Dashboard
/usage      → Dashboard
/webhooks   → Dashboard
/billing    → Dashboard
/api-keys   → Dashboard
/audit-logs → Dashboard
/kyb-upload → Dashboard
/admin      → AdminOverview
/admin/kyc-queue → KYCQueue
/admin/clients   → ClientManagement
/admin/risk      → RiskAlerts
```
Note: All sidebar routes render `Dashboard` — the sidebar's nav links navigate the page, the `useLocation()` hook drives the TopBar breadcrumb. Tab content is driven by local state, not routes.

### Color tokens to define
```css
accent-lime:   #a8ff3e
accent-teal:   #00d4aa
accent-purple: #9b7ff4
accent-amber:  #ffb547
accent-red:    #ff5a5a
muted-fg:      #6b8a82
soft-muted:    #3d5a52
foreground:    #f0f8f5
background:    #050c0e
```

### Chart library setup (Recharts)
- **BarChart** — no axis lines, no tick lines, custom tooltip with dark glass styling, hatch SVG pattern for historical bars, solid `#9b7ff4` for current month with drop-shadow filter
- **PieChart (donut)** — fixed `width={160} height={160}` (NOT ResponsiveContainer), cx/cy at 75/75, innerRadius 52 outerRadius 70, paddingAngle 3, startAngle 90 endAngle -270, per-segment drop-shadow filter
- **AreaChart** — two areas (delivered + failed), gradient fill on delivered, transparent on failed, no dots, no axis lines on Y
