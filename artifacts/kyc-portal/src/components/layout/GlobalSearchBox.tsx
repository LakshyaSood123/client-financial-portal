import { useEffect, useMemo, useRef, useState } from "react";
import { Search } from "lucide-react";
import { useLocation } from "wouter";

export interface SearchItem {
  label: string;
  href: string;
  description?: string;
  keywords?: string[];
}

interface GlobalSearchBoxProps {
  items: SearchItem[];
  placeholder: string;
  width?: number | string;
  hint?: string;
  compact?: boolean;
}

export function GlobalSearchBox({
  items,
  placeholder,
  width = "100%",
  hint,
  compact = false,
}: GlobalSearchBoxProps) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [, setLocation] = useLocation();
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    const scored = items
      .map((item) => {
        const haystacks = [item.label, item.description ?? "", ...(item.keywords ?? [])]
          .join(" ")
          .toLowerCase();
        if (!normalized) {
          return { item, score: 0 };
        }
        if (item.label.toLowerCase().startsWith(normalized)) {
          return { item, score: 3 };
        }
        if (haystacks.includes(normalized)) {
          return { item, score: 2 };
        }
        return null;
      })
      .filter((entry): entry is { item: SearchItem; score: number } => entry !== null)
      .sort((a, b) => b.score - a.score || a.item.label.localeCompare(b.item.label))
      .slice(0, 6)
      .map((entry) => entry.item);

    return scored;
  }, [items, query]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, []);

  const navigate = (item: SearchItem) => {
    setLocation(item.href);
    setQuery("");
    setOpen(false);
    inputRef.current?.blur();
  };

  return (
    <div ref={rootRef} style={{ position: "relative", width, minWidth: 0, zIndex: open ? 120 : 1 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          background: compact ? "linear-gradient(180deg, #F8FBFF 0%, #EEF4FB 100%)" : "#FFFFFF",
          borderRadius: 999,
          padding: compact ? "0 14px" : "9px 18px",
          border: "1px solid var(--nk-border, var(--na-border))",
          boxShadow: compact
            ? "inset 0 1px 2px rgba(255,255,255,0.75), 0 1px 2px rgba(15,23,42,0.03)"
            : "var(--elev-1)",
          minHeight: compact ? 36 : undefined,
        }}
      >
        <Search style={{ width: compact ? 16 : 15, height: compact ? 16 : 15, color: "#B0A090", flexShrink: 0 }} />
        <input
          ref={inputRef}
          value={query}
          onFocus={() => setOpen(true)}
          onChange={(event) => {
            setQuery(event.target.value);
            setOpen(true);
          }}
          onKeyDown={(event) => {
            if (event.key === "ArrowDown") {
              event.preventDefault();
              setOpen(true);
              setSelectedIndex((prev) => Math.min(prev + 1, Math.max(filtered.length - 1, 0)));
            } else if (event.key === "ArrowUp") {
              event.preventDefault();
              setSelectedIndex((prev) => Math.max(prev - 1, 0));
            } else if (event.key === "Enter") {
              if (filtered.length > 0) {
                event.preventDefault();
                navigate(filtered[selectedIndex] ?? filtered[0]);
              }
            } else if (event.key === "Escape") {
              setOpen(false);
              inputRef.current?.blur();
            }
          }}
          placeholder={placeholder}
          style={{
            background: "transparent",
            border: "none",
            outline: "none",
            fontSize: 13,
            color: "#1C1917",
            width: "100%",
            fontFamily: "'Satoshi', sans-serif",
          }}
        />
        {hint ? (
          <div
            style={{
              flexShrink: 0,
              padding: compact ? "2px 6px" : "2px 6px",
              borderRadius: 8,
              background: "rgba(14,18,25,0.07)",
              color: "#8499be",
              fontSize: 10,
              fontWeight: 600,
              whiteSpace: "nowrap",
            }}
          >
            {hint}
          </div>
        ) : null}
      </div>

      {open && filtered.length > 0 ? (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 8px)",
            left: 0,
            right: 0,
            background: "#FFFFFF",
            border: "1px solid var(--na-border, var(--nk-border))",
            borderRadius: 16,
            boxShadow: "var(--admin-elev-3, var(--elev-3))",
            overflow: "hidden",
            zIndex: 130,
          }}
        >
          {filtered.map((item, index) => (
            <button
              key={item.href}
              type="button"
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => navigate(item)}
              style={{
                width: "100%",
                textAlign: "left",
                padding: "10px 14px",
                border: "none",
                borderTop: index === 0 ? "none" : "1px solid rgba(217,229,240,0.6)",
                background: index === selectedIndex ? "rgba(249,115,22,0.08)" : "#FFFFFF",
                cursor: "pointer",
              }}
            >
              <div style={{ fontSize: 13, fontWeight: 700, color: "#0F172A" }}>{item.label}</div>
              {item.description ? (
                <div style={{ fontSize: 11, color: "#7C8EA5", marginTop: 2 }}>{item.description}</div>
              ) : null}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
