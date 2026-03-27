import { useState, type CSSProperties } from "react";
import { motion } from "framer-motion";
import { AdminLayout, SURF_SUPPORT, SURF_DEFAULT, TEXT, MUTED, cardShell, DARK_1 } from "./AdminLayout";
import {
  Search, Download, SlidersHorizontal,
  Building2, User, ChevronUp, ChevronDown,
} from "lucide-react";

const CLIENTS = [
  { id: "CLT-001", name: "Anime Corp Ltd",       type: "Business",   email: "compliance@acme.com",     country: "India", kyb: "Verified", risk: "Low",    plan: "Enterprise", joined: "Jan 12, 2025", revenue: "₹48,200"   },
  { id: "CLT-002", name: "David Chen",            type: "Individual", email: "d.chen@email.com",        country: "India", kyb: "Verified", risk: "Medium", plan: "Growth",     joined: "Feb 3, 2025",  revenue: "₹3,400"    },
  { id: "CLT-003", name: "Nova Ventures",         type: "Business",   email: "ops@novaventures.io",     country: "India", kyb: "Rejected", risk: "High",   plan: "—",          joined: "Feb 28, 2025", revenue: "₹0"        },
  { id: "CLT-004", name: "Sarah Williams",        type: "Individual", email: "s.williams@mail.co",      country: "India", kyb: "Verified", risk: "Low",    plan: "Starter",    joined: "Mar 1, 2025",  revenue: "₹850"      },
  { id: "CLT-005", name: "GlobalPay Inc",         type: "Business",   email: "kyc@globalpay.io",        country: "India", kyb: "Pending",  risk: "Medium", plan: "—",          joined: "Mar 10, 2025", revenue: "₹0"        },
  { id: "CLT-006", name: "Vertex Capital",        type: "Business",   email: "kyc@vertexcap.com",       country: "India", kyb: "Pending",  risk: "High",   plan: "—",          joined: "Mar 14, 2025", revenue: "₹0"        },
  { id: "CLT-007", name: "Maria Santos",          type: "Individual", email: "m.santos@mail.com",       country: "India", kyb: "Pending",  risk: "Low",    plan: "—",          joined: "Mar 16, 2025", revenue: "₹0"        },
  { id: "CLT-008", name: "TechBridge Solutions",  type: "Business",   email: "admin@techbridge.co",     country: "India", kyb: "Verified", risk: "Low",    plan: "Enterprise", joined: "Dec 4, 2024",  revenue: "₹92,100"   },
  { id: "CLT-009", name: "James Okonkwo",         type: "Individual", email: "j.okonkwo@pro.com",       country: "India", kyb: "Verified", risk: "Medium", plan: "Growth",     joined: "Nov 22, 2024", revenue: "₹7,600"    },
  { id: "CLT-010", name: "Meridian Holdings",     type: "Business",   email: "kyc@meridian.hk",         country: "India", kyb: "Verified", risk: "Low",    plan: "Enterprise", joined: "Oct 8, 2024",  revenue: "₹1,15,300" },
];

const KYB_STYLES: Record<string, { color: string; bg: string }> = {
  Verified: { color: "#16a34a", bg: "rgba(22,163,74,0.1)"   },
  Pending:  { color: "#d97706", bg: "rgba(217,119,6,0.1)"   },
  Rejected: { color: "#f54a4a", bg: "rgba(245,74,74,0.1)"   },
};
const RISK_COLORS: Record<string, string> = {
  Low:    "#22C55E",
  Medium: "#d97706",
  High:   "#f54a4a",
};

const TABLE_COLUMNS = "80px 1fr 120px 100px 100px 100px 90px";

const clientRowStyle: CSSProperties = {
  gridTemplateColumns: TABLE_COLUMNS,
  height: 60,
  borderBottom: "1px solid rgba(13,18,33,0.05)",
  borderLeft: "2px solid transparent",
};

const clientRowHover = {
  backgroundColor: "rgba(13,18,33,0.03)",
  borderLeftColor: "#22C55E",
};

export default function ClientManagement() {
  const [search,    setSearch]    = useState("");
  const [kybFilter, setKybFilter] = useState("All");
  const [sortCol,   setSortCol]   = useState("id");
  const [sortDir,   setSortDir]   = useState<"asc" | "desc">("asc");

  const toggleSort = (col: string) => {
    if (sortCol === col) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortCol(col); setSortDir("asc"); }
  };

  const filtered = CLIENTS.filter(c => {
    const matchSearch = search === "" || c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase()) || c.id.toLowerCase().includes(search.toLowerCase());
    const matchKyb    = kybFilter === "All" || c.kyb === kybFilter;
    return matchSearch && matchKyb;
  });

  const SortIcon = ({ col }: { col: string }) => (
    <span className="ml-1 inline-flex flex-col" style={{ opacity: sortCol === col ? 1 : 0.3 }}>
      {sortDir === "asc" && sortCol === col ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
    </span>
  );

  return (
    <AdminLayout>
      <div className="p-8 space-y-6">
        {/* Header */}
        <motion.div
          className="flex items-center justify-between"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div>
            <h1 className="font-display" style={{ fontSize: 48, fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1.05, color: TEXT }}>
              Client Management
            </h1>
            <p className="text-sm mt-1.5" style={{ color: MUTED }}>
              {CLIENTS.length} registered clients across all plans
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium"
              style={{ background: SURF_SUPPORT, border: "1px solid rgba(13,18,33,0.07)", color: MUTED }}>
              <Download className="w-4 h-4" /> Export CSV
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium"
              style={{ background: SURF_SUPPORT, border: "1px solid rgba(13,18,33,0.07)", color: MUTED }}>
              <SlidersHorizontal className="w-4 h-4" /> Filters
            </button>
          </div>
        </motion.div>

        {/* Search + filter bar */}
        <motion.div
          className="flex items-center gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: MUTED }} />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name, email, ID…"
              className="w-full h-10 pl-11 pr-4 text-sm outline-none rounded-2xl transition-all"
              style={{ background: SURF_SUPPORT, border: "1px solid rgba(13,18,33,0.07)", color: TEXT }}
            />
          </div>
          <div className="flex items-center gap-2">
            {["All", "Verified", "Pending", "Rejected"].map(f => (
              <button
                key={f}
                onClick={() => setKybFilter(f)}
                className="px-4 py-1.5 rounded-full text-xs font-semibold transition-all"
                style={kybFilter === f ? {
                  background: DARK_1,
                  color: "#ffffff",
                } : {
                  background: SURF_SUPPORT,
                  color: MUTED,
                  border: "1px solid rgba(13,18,33,0.07)",
                }}
              >
                {f}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Table — default surface */}
        <motion.div
          style={{ ...cardShell, background: SURF_DEFAULT, borderRadius: 22 }}
          className="overflow-hidden"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {/* Table header */}
          <div
            className="grid gap-4 px-5 py-3 text-xs font-bold uppercase tracking-wider"
            style={{
              color: MUTED,
              borderBottom: "1px solid rgba(13,18,33,0.07)",
              gridTemplateColumns: TABLE_COLUMNS,
            }}
          >
            {["ID", "Client", "Country", "KYB", "Risk", "Plan", "Revenue"].map((col) => (
              <button
                key={col}
                className="flex items-center hover:opacity-80 transition-opacity text-left"
                style={{ color: MUTED }}
                onClick={() => toggleSort(col.toLowerCase())}
              >
                {col} <SortIcon col={col.toLowerCase()} />
              </button>
            ))}
          </div>

          {/* Rows */}
          <div>
            {filtered.map((client, i) => (
              <motion.div
                key={client.id}
                className="grid gap-4 px-5 items-center cursor-pointer transition-all"
                style={clientRowStyle}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.35 + i * 0.04 }}
                whileHover={clientRowHover}
              >
                <span className="font-mono text-xs" style={{ color: MUTED }}>{client.id}</span>

                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: client.type === "Business" ? "rgba(139,111,244,0.12)" : "rgba(34,197,94,0.1)" }}
                  >
                    {client.type === "Business"
                      ? <Building2 className="w-4 h-4" style={{ color: "#8b6ff4" }} />
                      : <User      className="w-4 h-4" style={{ color: "#22C55E" }} />
                    }
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold truncate" style={{ color: TEXT }}>{client.name}</p>
                    <p className="text-xs truncate" style={{ color: MUTED }}>{client.email}</p>
                  </div>
                </div>

                <span className="text-xs" style={{ color: MUTED }}>{client.country}</span>

                <div
                  className="px-2.5 py-1 rounded-full text-xs font-bold w-fit"
                  style={{ background: KYB_STYLES[client.kyb].bg, color: KYB_STYLES[client.kyb].color }}
                >
                  {client.kyb}
                </div>

                <span className="text-xs font-semibold" style={{ color: RISK_COLORS[client.risk] }}>
                  ● {client.risk}
                </span>

                <span className="text-xs" style={{ color: client.plan === "—" ? MUTED : TEXT }}>{client.plan}</span>

                <span className="text-sm font-mono font-bold" style={{ color: client.revenue === "₹0" ? MUTED : TEXT }}>
                  {client.revenue}
                </span>
              </motion.div>
            ))}
          </div>

          {/* Footer */}
          <div
            className="flex items-center justify-between px-5 py-3 text-xs"
            style={{ color: MUTED, borderTop: "1px solid rgba(13,18,33,0.06)" }}
          >
            <span>Showing {filtered.length} of {CLIENTS.length} clients</span>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1.5 rounded-lg transition-colors hover:opacity-70">← Prev</button>
              <span className="px-3 py-1.5 rounded-lg" style={{ background: DARK_1, color: "#ffffff" }}>1</span>
              <button className="px-3 py-1.5 rounded-lg transition-colors hover:opacity-70">Next →</button>
            </div>
          </div>
        </motion.div>
      </div>
    </AdminLayout>
  );
}
