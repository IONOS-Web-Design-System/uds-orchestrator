// Wireframe illustration — not production code
import { ThemeProvider, Surface } from '@ionos-web-design-system/react';
import { Card } from '@ionos-web-design-system/react/card';
import { Button } from '@ionos-web-design-system/react/button';
import { NavigationBar } from '@ionos-web-design-system/react/navigation-bar';
import { Icon } from '@ionos-web-design-system/react/icon';

// ─── Animation & Status Styles ───────────────────────────────────────────────

const animationStyles = `
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  .stat-card-enter {
    animation: fadeInUp 0.45s ease-out forwards;
    opacity: 0;
  }
  .section-enter {
    animation: fadeIn 0.5s ease-out forwards;
    opacity: 0;
  }
`;

// ─── Status Badge ─────────────────────────────────────────────────────────────

const STATUS_STYLES = {
  Running:     { bg: 'rgba(18, 207, 118, 0.12)',  token: 'var(--utility/green-300)',  label: 'Running' },
  Maintenance: { bg: 'rgba(255, 170, 0, 0.12)',   token: 'var(--utility/yellow-300)', label: 'Maintenance' },
  Offline:     { bg: 'rgba(255, 97, 89, 0.12)',   token: 'var(--utility/red-300)',    label: 'Offline' },
} as const;

type ServerStatus = keyof typeof STATUS_STYLES;

function StatusBadge({ status }: { status: ServerStatus }) {
  const s = STATUS_STYLES[status];
  return (
    <span
      style={{
        backgroundColor: s.bg,
        color: 'var(--brand/ionos-blue-800)',
        borderLeft: `3px solid ${s.token}`,
        fontFamily: 'var(--base/font/body)',
        fontSize: '0.75rem',
        fontWeight: 600,
        padding: '2px 10px',
        borderRadius: '999px',
        textTransform: 'uppercase',
        letterSpacing: '0.56px',
        display: 'inline-block',
      }}
    >
      {s.label}
    </span>
  );
}

// ─── Stat Card Data ───────────────────────────────────────────────────────────

const STAT_CARDS = [
  {
    label: 'Active Servers',
    value: '12',
    subtext: '+2 this week',
    iconName: 'server',
    iconColor: 'var(--brand/ionos-blue-600)',
  },
  {
    label: 'Monthly Traffic',
    value: '2.4 TB',
    subtext: '68% of quota used',
    iconName: 'chart-bar',
    iconColor: 'var(--utility/green-300)',
  },
  {
    label: 'Uptime',
    value: '99.98%',
    subtext: 'Last 30 days',
    iconName: 'clock',
    iconColor: 'var(--utility/green-300)',
  },
  {
    label: 'Open Tickets',
    value: '3',
    subtext: '1 critical, 2 low',
    iconName: 'ticket',
    iconColor: 'var(--utility/yellow-300)',
  },
] as const;

// ─── Server List Data ─────────────────────────────────────────────────────────

const SERVERS = [
  {
    name: 'web-prod-eu-01',
    status: 'Running' as ServerStatus,
    location: 'Frankfurt, DE',
    ip: '195.201.14.88',
    plan: 'VPS XL',
  },
  {
    name: 'db-replica-ams-02',
    status: 'Maintenance' as ServerStatus,
    location: 'Amsterdam, NL',
    ip: '194.233.67.14',
    plan: 'Dedicated M',
  },
  {
    name: 'staging-us-east-03',
    status: 'Offline' as ServerStatus,
    location: 'Ashburn, US',
    ip: '45.12.98.201',
    plan: 'Cloud Server S',
  },
];

// ─── Main Wireframe ───────────────────────────────────────────────────────────

export default function ServerDashboardWireframe() {
  return (
    <ThemeProvider brand="ionos" colorScheme="light" platform="comfortable">
      <style>{animationStyles}</style>

      <Surface
        style={{
          minHeight: '100vh',
          backgroundColor: 'var(--neutral/cool-grey-50)',
          fontFamily: 'var(--base/font/body)',
        }}
      >
        {/* ── Navigation Bar ─────────────────────────────────────────────── */}
        <NavigationBar
          brand="ionos"
          items={[
            { label: 'Servers', href: '#' },
            { label: 'Networking', href: '#' },
            { label: 'Storage', href: '#' },
            { label: 'Billing', href: '#' },
          ]}
        />

        {/* ── Page Content ───────────────────────────────────────────────── */}
        <div className="max-w-7xl mx-auto px-6 py-8">

          {/* ── Page Header ──────────────────────────────────────────────── */}
          <div
            className="section-enter mb-8 flex items-center justify-between"
            style={{ animationDelay: '0ms' }}
          >
            <div>
              <h1
                style={{
                  fontFamily: 'var(--base/font/heading)',
                  fontSize: '1.75rem',
                  fontWeight: 600,
                  color: 'var(--brand/ionos-blue-800)',
                  margin: 0,
                }}
              >
                Server Management
              </h1>
              <p
                style={{
                  color: 'var(--neutral/cool-grey-600)',
                  fontSize: '0.9rem',
                  marginTop: '4px',
                }}
              >
                Overview of your infrastructure — May 2026
              </p>
            </div>
            <Button variant="primary" onClick={() => {}}>
              + Deploy Server
            </Button>
          </div>

          {/* ── Stat Cards — staggered entrance ──────────────────────────── */}
          <div className="grid grid-cols-4 gap-5 mb-8">
            {STAT_CARDS.map((stat, i) => (
              <Card
                key={stat.label}
                className="stat-card-enter transition-transform duration-200 ease-out hover:-translate-y-1 cursor-pointer"
                style={{
                  animationDelay: `${120 + i * 100}ms`,
                  borderRadius: '12px',
                  overflow: 'hidden',
                }}
              >
                <div className="p-5">
                  {/* Icon row */}
                  <div className="flex items-center justify-between mb-3">
                    <span
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        color: 'var(--neutral/cool-grey-500)',
                      }}
                    >
                      {stat.label}
                    </span>
                    <span
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '8px',
                        backgroundColor: 'var(--neutral/cool-grey-100)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: stat.iconColor,
                        fontSize: '1rem',
                      }}
                    >
                      {/* Icon placeholder — replace with <Icon group="system" name={stat.iconName} size={18} /> */}
                      <Icon group="system" name={stat.iconName} size={18} />
                    </span>
                  </div>

                  {/* Value */}
                  <div
                    style={{
                      fontSize: '2rem',
                      fontWeight: 700,
                      color: 'var(--brand/ionos-blue-800)',
                      fontFamily: 'var(--base/font/heading)',
                      lineHeight: 1.1,
                    }}
                  >
                    {stat.value}
                  </div>

                  {/* Subtext */}
                  <div
                    style={{
                      fontSize: '0.8rem',
                      color: 'var(--neutral/cool-grey-500)',
                      marginTop: '6px',
                    }}
                  >
                    {stat.subtext}
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* ── Server List ───────────────────────────────────────────────── */}
          <Card
            className="section-enter"
            style={{
              animationDelay: '560ms',
              borderRadius: '12px',
              overflow: 'hidden',
            }}
          >
            {/* Table header */}
            <div
              style={{
                padding: '16px 20px',
                borderBottom: '1px solid var(--neutral/cool-grey-200)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <h2
                style={{
                  fontFamily: 'var(--base/font/heading)',
                  fontSize: '1rem',
                  fontWeight: 600,
                  color: 'var(--brand/ionos-blue-800)',
                  margin: 0,
                }}
              >
                Your Servers
              </h2>
              <Button variant="secondary" size="sm" onClick={() => {}}>
                Manage All
              </Button>
            </div>

            {/* Column headings */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '2fr 140px 1.5fr 1fr 160px',
                padding: '10px 20px',
                backgroundColor: 'var(--neutral/cool-grey-50)',
                borderBottom: '1px solid var(--neutral/cool-grey-200)',
                gap: '16px',
              }}
            >
              {['Server Name', 'Status', 'Location', 'Plan', 'Actions'].map((col) => (
                <span
                  key={col}
                  style={{
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.6px',
                    color: 'var(--neutral/cool-grey-500)',
                  }}
                >
                  {col}
                </span>
              ))}
            </div>

            {/* Server rows */}
            {SERVERS.map((server, i) => (
              <div
                key={server.name}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '2fr 140px 1.5fr 1fr 160px',
                  padding: '16px 20px',
                  gap: '16px',
                  alignItems: 'center',
                  borderBottom:
                    i < SERVERS.length - 1
                      ? '1px solid var(--neutral/cool-grey-100)'
                      : 'none',
                  transition: 'background-color 150ms ease',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.backgroundColor =
                    'var(--neutral/cool-grey-50)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.backgroundColor = 'transparent';
                }}
              >
                {/* Server Name + IP */}
                <div>
                  <div
                    style={{
                      fontWeight: 600,
                      fontSize: '0.9rem',
                      color: 'var(--brand/ionos-blue-700)',
                      fontFamily: 'var(--base/font/body)',
                    }}
                  >
                    {server.name}
                  </div>
                  <div
                    style={{
                      fontSize: '0.75rem',
                      color: 'var(--neutral/cool-grey-500)',
                      marginTop: '2px',
                      fontFamily: 'monospace',
                    }}
                  >
                    {server.ip}
                  </div>
                </div>

                {/* Status Badge */}
                <div>
                  <StatusBadge status={server.status} />
                </div>

                {/* Location */}
                <div
                  style={{
                    fontSize: '0.875rem',
                    color: 'var(--brand/ionos-blue-800)',
                  }}
                >
                  {server.location}
                </div>

                {/* Plan */}
                <div
                  style={{
                    fontSize: '0.875rem',
                    color: 'var(--neutral/cool-grey-600)',
                  }}
                >
                  {server.plan}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button variant="secondary" size="sm" onClick={() => {}}>
                    Manage
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => {}}>
                    Reboot
                  </Button>
                </div>
              </div>
            ))}
          </Card>

        </div>
      </Surface>
    </ThemeProvider>
  );
}
