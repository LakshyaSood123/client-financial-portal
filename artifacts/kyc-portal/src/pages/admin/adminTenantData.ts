export type AdminTenantRecord = {
  id: string;
  name: string;
  plan: string;
  kybStatus: string;
  billingStatus: string;
  opsStatus: string;
  envAccess: string;
  joined: string;
};

export const MOCK_TENANTS: AdminTenantRecord[] = [
  {
    id: "ten_4x8a",
    name: "Anime Corp Ltd",
    plan: "Growth",
    kybStatus: "Verified",
    billingStatus: "Healthy",
    opsStatus: "Active",
    envAccess: "Sandbox + Prod",
    joined: "Jan 15 2026",
  },
  {
    id: "ten_9mNq",
    name: "Nova Ventures",
    plan: "Starter",
    kybStatus: "Pending",
    billingStatus: "Low balance",
    opsStatus: "Review",
    envAccess: "Sandbox only",
    joined: "Mar 01 2026",
  },
  {
    id: "ten_7bRp",
    name: "GlobalPay Inc",
    plan: "Growth",
    kybStatus: "Failed",
    billingStatus: "Blocked",
    opsStatus: "Suspended",
    envAccess: "Disabled",
    joined: "Nov 10 2025",
  },
  {
    id: "ten_5xKq",
    name: "David Chen",
    plan: "Starter",
    kybStatus: "Verified",
    billingStatus: "Healthy",
    opsStatus: "Active",
    envAccess: "Sandbox",
    joined: "Feb 22 2026",
  },
  {
    id: "ten_3mNb",
    name: "Vertex Capital",
    plan: "Custom",
    kybStatus: "Under Review",
    billingStatus: "Manual review",
    opsStatus: "Escalated",
    envAccess: "Prod pending",
    joined: "Oct 05 2025",
  },
];

export const focusDefinitions = {
  "billing-alerts": {
    label: "Billing threshold alerts",
    description: "Tenants currently in billing follow-up states.",
    match: (tenant: AdminTenantRecord) =>
      ["Low balance", "Manual review", "Blocked"].includes(tenant.billingStatus),
  },
  "webhook-failures": {
    label: "Webhook failure summaries",
    description: "Tenants needing integration or operational follow-up.",
    match: (tenant: AdminTenantRecord) =>
      ["Review", "Escalated", "Suspended"].includes(tenant.opsStatus) ||
      ["Disabled", "Sandbox only", "Prod pending"].includes(tenant.envAccess),
  },
  "compliance-review": {
    label: "Compliance review outcomes",
    description: "Tenants currently in a KYB review or exception state.",
    match: (tenant: AdminTenantRecord) =>
      ["Pending", "Under Review", "Failed"].includes(tenant.kybStatus),
  },
} as const;

export type NotificationFocusKey = keyof typeof focusDefinitions;
