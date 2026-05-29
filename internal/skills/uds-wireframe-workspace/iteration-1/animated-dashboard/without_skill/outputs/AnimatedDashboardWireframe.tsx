import React, { useEffect, useState } from "react";
import {
  Text,
  Badge,
  Button,
  Surface,
} from "@ionos-web-design-system/components";

// ─── Types ───────────────────────────────────────────────────────────────────

interface StatCard {
  label: string;
  value: string;
  trend?: string;
}

interface Server {
  name: string;
  status: "running" | "stopped" | "maintenance";
  location: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const STAT_CARDS: StatCard[] = [
  { label: "Active Servers", value: "24", trend: "+2 this week" },
  { label: "Monthly Traffic", value: "3.8 TB", trend: "↑ 12% vs last month" },
  { label: "Uptime", value: "99.97%", trend: "Last 30 days" },
  { label: "Open Tickets", value: "7", trend: "3 critical" },
];

const SERVERS: Server[] = [
  { name: "vps-prod-eu-01", status: "running", location: "Frankfurt, DE" },
  { name: "vps-staging-us-01", status: "stopped", location: "Ashburn, US" },
  { name: "db-primary-eu-01", status: "maintenance", location: "Berlin, DE" },
];

const STATUS_VARIANT: Record<
  Server["status"],
  "success" | "warning" | "critical"
> = {
  running: "success",
  stopped: "critical",
  maintenance: "warning",
};

const STATUS_LABEL: Record<Server["status"], string> = {
  running: "Running",
  stopped: "Stopped",
  maintenance: "Maintenance",
};

// ─── Inline Styles ────────────────────────────────────────────────────────────

const styles = {
  page: {
    minHeight: "100vh",
    backgroundColor: "var(--color-neutral-100, #f5f5f5)",
    padding: "32px",
    fontFamily: "inherit",
  } as React.CSSProperties,

  header: {
    marginBottom: "32px",
  } as React.CSSProperties,

  subheading: {
    marginTop: "4px",
    color: "var(--color-neutral-600, #6b7280)",
  } as React.CSSProperties,

  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "20px",
    marginBottom: "40px",
  } as React.CSSProperties,

  statCard: (visible: boolean, delay: number): React.CSSProperties => ({
    padding: "24px",
    borderRadius: "8px",
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(20px)",
    transition: `opacity 0.5s ease ${delay}ms, transform 0.5s ease ${delay}ms`,
  }),

  statValue: {
    fontSize: "2rem",
    fontWeight: 700,
    lineHeight: 1.2,
    margin: "8px 0 4px",
  } as React.CSSProperties,

  statTrend: {
    fontSize: "0.875rem",
    color: "var(--color-neutral-500, #9ca3af)",
  } as React.CSSProperties,

  tableSection: {
    borderRadius: "8px",
    overflow: "hidden",
  } as React.CSSProperties,

  tableHeader: {
    padding: "16px 24px",
    borderBottom: "1px solid var(--color-neutral-200, #e5e7eb)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  } as React.CSSProperties,

  table: {
    width: "100%",
    borderCollapse: "collapse" as const,
  },

  th: {
    padding: "12px 24px",
    textAlign: "left" as const,
    fontSize: "0.75rem",
    fontWeight: 600,
    textTransform: "uppercase" as const,
    letterSpacing: "0.05em",
    color: "var(--color-neutral-500, #9ca3af)",
    backgroundColor: "var(--color-neutral-50, #fafafa)",
    borderBottom: "1px solid var(--color-neutral-200, #e5e7eb)",
  },

  td: {
    padding: "16px 24px",
    borderBottom: "1px solid var(--color-neutral-100, #f3f4f6)",
    verticalAlign: "middle" as const,
  },

  actionsCell: {
    display: "flex",
    gap: "8px",
    alignItems: "center",
  } as React.CSSProperties,
};

// ─── StatCard Component ───────────────────────────────────────────────────────

interface StatCardProps {
  card: StatCard;
  visible: boolean;
  delay: number;
}

function StatCardItem({ card, visible, delay }: StatCardProps) {
  return (
    <Surface style={styles.statCard(visible, delay)}>
      <Text variant="label-s">{card.label}</Text>
      <div style={styles.statValue}>{card.value}</div>
      <div style={styles.statTrend}>{card.trend}</div>
    </Surface>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────

export function AnimatedDashboardWireframe() {
  const [cardsVisible, setCardsVisible] = useState([false, false, false, false]);

  // Stagger each card's entrance animation on mount
  useEffect(() => {
    STAT_CARDS.forEach((_, index) => {
      const timeout = setTimeout(() => {
        setCardsVisible((prev) => {
          const next = [...prev];
          next[index] = true;
          return next;
        });
      }, 100 + index * 150); // 150 ms stagger between cards

      return () => clearTimeout(timeout);
    });
  }, []);

  return (
    <div style={styles.page}>
      {/* ── Page Header ── */}
      <div style={styles.header}>
        <Text variant="headline-l">Server Dashboard</Text>
        <div style={styles.subheading}>
          <Text variant="body-m">
            Overview of your IONOS cloud infrastructure
          </Text>
        </div>
      </div>

      {/* ── Stat Cards ── */}
      <div style={styles.statsGrid}>
        {STAT_CARDS.map((card, index) => (
          <StatCardItem
            key={card.label}
            card={card}
            visible={cardsVisible[index]}
            delay={0} // delay already baked into visibility trigger
          />
        ))}
      </div>

      {/* ── Server List ── */}
      <Surface style={styles.tableSection}>
        <div style={styles.tableHeader}>
          <Text variant="headline-s">Your Servers</Text>
          <Button variant="primary" size="s">
            + Add Server
          </Button>
        </div>

        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Server Name</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Location</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {SERVERS.map((server) => (
              <tr key={server.name}>
                <td style={styles.td}>
                  <Text variant="body-m">{server.name}</Text>
                </td>
                <td style={styles.td}>
                  <Badge variant={STATUS_VARIANT[server.status]}>
                    {STATUS_LABEL[server.status]}
                  </Badge>
                </td>
                <td style={styles.td}>
                  <Text variant="body-m">{server.location}</Text>
                </td>
                <td style={styles.td}>
                  <div style={styles.actionsCell}>
                    <Button variant="secondary" size="s">
                      Manage
                    </Button>
                    <Button variant="ghost" size="s">
                      Console
                    </Button>
                    <Button variant="ghost" size="s">
                      Reboot
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Surface>
    </div>
  );
}

export default AnimatedDashboardWireframe;
