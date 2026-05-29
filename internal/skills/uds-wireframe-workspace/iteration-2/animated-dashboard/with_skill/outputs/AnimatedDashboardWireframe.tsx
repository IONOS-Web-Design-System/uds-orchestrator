// Wireframe illustration — not production code
import { ThemeProvider, Surface } from '@ionos-web-design-system/react';
import { Button } from '@ionos-web-design-system/react/button';
import { Card } from '@ionos-web-design-system/react/card';
import { Icon } from '@ionos-web-design-system/react/icon';

// ---------------------------------------------------------------------------
// Animation styles — injected as a <style> tag so no external dep is needed
// ---------------------------------------------------------------------------
const ANIMATION_STYLES = `
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(14px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
`;

// ---------------------------------------------------------------------------
// Semantic status badge (Wireframe Composition Guide — Semantic Status Colors)
// ---------------------------------------------------------------------------
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
        // Text: Dark Midnight — not a darkened utility color — for token purity
        color: 'var(--brand/ionos-blue-800)',
        borderLeft: `3px solid ${s.token}`,
        fontFamily: 'var(--base/font/body)',
        fontSize: '0.75rem',
        fontWeight: 600,
        padding: '2px 10px',
        borderRadius: '999px',
        textTransform: 'uppercase',
        letterSpacing: '0.56px',
        whiteSpace: 'nowrap',
      }}
    >
      {s.label}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Stat cards data
// ---------------------------------------------------------------------------
const STAT_CARDS = [
  {
    label: 'Active Servers',
    value: '24',
    sub: '+2 this week',
    iconName: 'server',
    accentToken: 'var(--brand/ionos-sky-300)',
  },
  {
    label: 'Monthly Traffic',
    value: '3.8 TB',
    sub: '↑ 12% vs last month',
    iconName: 'activity',
    accentToken: 'var(--utility/green-300)',
  },
  {
    label: 'Uptime',
    value: '99.97%',
    sub: 'Last 30 days',
    iconName: 'check-circle',
    accentToken: 'var(--utility/green-300)',
  },
  {
    label: 'Open Tickets',
    value: '5',
    sub: '2 high priority',
    iconName: 'alert-circle',
    accentToken: 'var(--utility/yellow-300)',
  },
];

// ---------------------------------------------------------------------------
// Server list data
// ---------------------------------------------------------------------------
const SERVERS = [
  {
    name: 'prod-web-01',
    status: 'Running' as ServerStatus,
    location: 'Frankfurt, DE',
    ip: '185.201.34.12',
    cpu: '18%',
    ram: '4.2 / 8 GB',
  },
  {
    name: 'prod-db-02',
    status: 'Maintenance' as ServerStatus,
    location: 'Berlin, DE',
    ip: '185.201.35.44',
    cpu: '—',
    ram: '—',
  },
  {
    name: 'staging-api-01',
    status: 'Offline' as ServerStatus,
    location: 'Madrid, ES',
    ip: '195.148.22.9',
    cpu: '—',
    ram: '—',
  },
];

// ---------------------------------------------------------------------------
// Table header labels
// ---------------------------------------------------------------------------
const TABLE_COLS = ['Server', 'Status', 'Location', 'IP Address', 'CPU', 'RAM', 'Actions'];

// ---------------------------------------------------------------------------
// Main wireframe
// ---------------------------------------------------------------------------
export default function AnimatedDashboardWireframe() {
  return (
    <ThemeProvider brand="ionos" colorScheme="light" platform="comfortable">
      <Surface>
        <style>{ANIMATION_STYLES}</style>

        {/* ----------------------------------------------------------------
            Top navigation bar
        ---------------------------------------------------------------- */}
        <header
          style={{
            background: 'var(--brand/ionos-blue-800)',
            padding: '0 2rem',
            height: '56px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            animation: 'fadeIn 0.35s ease-out forwards',
            opacity: 0,
          }}
        >
          {/* Logo wordmark area */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '28px',
                height: '28px',
                background: 'var(--brand/ionos-sky-300)',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Icon group="system" name="cloud" size={16} style={{ color: 'var(--brand/ionos-blue-800)' }} />
            </div>
            <span
              style={{
                fontFamily: 'var(--base/font/heading)',
                fontWeight: 600,
                fontSize: '1rem',
                color: 'var(--neutral/white)',
                letterSpacing: '0.02em',
              }}
            >
              IONOS Cloud
            </span>
          </div>

          {/* Nav links */}
          <nav style={{ display: 'flex', gap: '2rem' }}>
            {['Servers', 'Networking', 'Storage', 'Billing'].map((item) => (
              <a
                key={item}
                href="#"
                style={{
                  fontFamily: 'var(--base/font/body)',
                  fontSize: '0.875rem',
                  color: item === 'Servers' ? 'var(--brand/ionos-sky-300)' : 'rgba(255,255,255,0.72)',
                  textDecoration: 'none',
                  fontWeight: item === 'Servers' ? 600 : 400,
                  borderBottom: item === 'Servers' ? '2px solid var(--brand/ionos-sky-300)' : '2px solid transparent',
                  paddingBottom: '2px',
                }}
              >
                {item}
              </a>
            ))}
          </nav>

          {/* User area */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Icon group="system" name="bell" size={18} style={{ color: 'rgba(255,255,255,0.6)' }} />
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: 'var(--brand/ionos-sky-300)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'var(--base/font/body)',
                fontSize: '0.75rem',
                fontWeight: 700,
                color: 'var(--brand/ionos-blue-800)',
              }}
            >
              JD
            </div>
          </div>
        </header>

        {/* ----------------------------------------------------------------
            Page content
        ---------------------------------------------------------------- */}
        <main style={{ padding: '2rem', background: 'var(--neutral/cool-grey-100)', minHeight: 'calc(100vh - 56px)' }}>

          {/* Page heading */}
          <div
            style={{
              marginBottom: '1.75rem',
              animation: 'fadeInUp 0.35s ease-out forwards',
              animationDelay: '80ms',
              opacity: 0,
            }}
          >
            <h1
              style={{
                fontFamily: 'var(--base/font/heading)',
                fontWeight: 600,
                fontSize: '1.75rem',
                color: 'var(--brand/ionos-blue-800)',
                margin: 0,
              }}
            >
              Server Management
            </h1>
            <p
              style={{
                fontFamily: 'var(--base/font/body)',
                fontSize: '0.9rem',
                color: 'var(--brand/ionos-blue-800)',
                opacity: 0.6,
                margin: '0.25rem 0 0',
              }}
            >
              Overview of your infrastructure — May 2026
            </p>
          </div>

          {/* ----------------------------------------------------------------
              Stat cards — staggered entrance
          ---------------------------------------------------------------- */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '1rem',
              marginBottom: '2rem',
            }}
          >
            {STAT_CARDS.map((stat, i) => (
              <Card
                key={stat.label}
                style={{
                  animation: 'fadeInUp 0.4s ease-out forwards',
                  // Cards stagger in: 200ms base offset, then 100ms per card
                  animationDelay: `${200 + i * 100}ms`,
                  opacity: 0,
                  cursor: 'pointer',
                  transition: 'transform 0.2s ease-out, box-shadow 0.2s ease-out',
                  padding: '1.25rem 1.5rem',
                }}
                onMouseEnter={(e: React.MouseEvent<HTMLElement>) => {
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)';
                  (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 24px rgba(0,61,143,0.12)';
                }}
                onMouseLeave={(e: React.MouseEvent<HTMLElement>) => {
                  (e.currentTarget as HTMLElement).style.transform = '';
                  (e.currentTarget as HTMLElement).style.boxShadow = '';
                }}
              >
                {/* Accent rule */}
                <div
                  style={{
                    width: '32px',
                    height: '3px',
                    background: stat.accentToken,
                    borderRadius: '2px',
                    marginBottom: '0.875rem',
                  }}
                />

                <div
                  style={{
                    fontFamily: 'var(--base/font/body)',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    color: 'var(--brand/ionos-blue-800)',
                    opacity: 0.6,
                    textTransform: 'uppercase',
                    letterSpacing: '0.56px',
                    marginBottom: '0.375rem',
                  }}
                >
                  {stat.label}
                </div>

                <div
                  style={{
                    fontFamily: 'var(--base/font/heading)',
                    fontWeight: 600,
                    fontSize: '2.25rem',
                    color: 'var(--brand/ionos-blue-800)',
                    lineHeight: 1.1,
                    marginBottom: '0.375rem',
                  }}
                >
                  {stat.value}
                </div>

                <div
                  style={{
                    fontFamily: 'var(--base/font/body)',
                    fontSize: '0.78rem',
                    color: 'var(--brand/ionos-blue-800)',
                    opacity: 0.5,
                  }}
                >
                  {stat.sub}
                </div>
              </Card>
            ))}
          </div>

          {/* ----------------------------------------------------------------
              Server list table
          ---------------------------------------------------------------- */}
          <div
            style={{
              animation: 'fadeInUp 0.45s ease-out forwards',
              animationDelay: '650ms',
              opacity: 0,
            }}
          >
            {/* Section header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '1rem',
              }}
            >
              <h2
                style={{
                  fontFamily: 'var(--base/font/heading)',
                  fontWeight: 600,
                  fontSize: '1.1rem',
                  color: 'var(--brand/ionos-blue-800)',
                  margin: 0,
                }}
              >
                Your Servers
              </h2>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <Button variant="secondary" size="sm" onClick={() => {}}>
                  Filter
                </Button>
                <Button variant="primary" size="sm" onClick={() => {}}>
                  + Deploy Server
                </Button>
              </div>
            </div>

            {/* Table wrapper */}
            <div
              style={{
                background: 'var(--neutral/white)',
                borderRadius: '10px',
                overflow: 'hidden',
                boxShadow: '0 1px 4px rgba(0,27,65,0.08)',
              }}
            >
              {/* Table header row */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1.8fr 1fr 1.2fr 1.2fr 0.7fr 0.9fr 1fr',
                  padding: '0.75rem 1.25rem',
                  background: 'var(--neutral/cool-grey-100)',
                  borderBottom: '1px solid rgba(0,27,65,0.08)',
                }}
              >
                {TABLE_COLS.map((col) => (
                  <span
                    key={col}
                    style={{
                      fontFamily: 'var(--base/font/body)',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      color: 'var(--brand/ionos-blue-800)',
                      opacity: 0.55,
                      textTransform: 'uppercase',
                      letterSpacing: '0.56px',
                    }}
                  >
                    {col}
                  </span>
                ))}
              </div>

              {/* Data rows */}
              {SERVERS.map((server, rowIndex) => (
                <div
                  key={server.name}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1.8fr 1fr 1.2fr 1.2fr 0.7fr 0.9fr 1fr',
                    padding: '1rem 1.25rem',
                    alignItems: 'center',
                    borderBottom: rowIndex < SERVERS.length - 1 ? '1px solid rgba(0,27,65,0.06)' : 'none',
                    animation: 'fadeInUp 0.35s ease-out forwards',
                    animationDelay: `${750 + rowIndex * 80}ms`,
                    opacity: 0,
                    transition: 'background 0.15s ease',
                  }}
                  onMouseEnter={(e: React.MouseEvent<HTMLDivElement>) => {
                    (e.currentTarget as HTMLElement).style.background = 'rgba(17,199,230,0.04)';
                  }}
                  onMouseLeave={(e: React.MouseEvent<HTMLDivElement>) => {
                    (e.currentTarget as HTMLElement).style.background = '';
                  }}
                >
                  {/* Server name */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '8px',
                        background: 'rgba(0,61,143,0.08)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <Icon group="system" name="server" size={16} style={{ color: 'var(--brand/ionos-blue-600)' }} />
                    </div>
                    <span
                      style={{
                        fontFamily: 'var(--base/font/body)',
                        fontWeight: 600,
                        fontSize: '0.875rem',
                        color: 'var(--brand/ionos-blue-800)',
                        fontVariantNumeric: 'tabular-nums',
                      }}
                    >
                      {server.name}
                    </span>
                  </div>

                  {/* Status badge */}
                  <div>
                    <StatusBadge status={server.status} />
                  </div>

                  {/* Location */}
                  <span
                    style={{
                      fontFamily: 'var(--base/font/body)',
                      fontSize: '0.875rem',
                      color: 'var(--brand/ionos-blue-800)',
                      opacity: 0.75,
                    }}
                  >
                    {server.location}
                  </span>

                  {/* IP */}
                  <span
                    style={{
                      fontFamily: 'var(--font/code-font)',
                      fontSize: '0.8rem',
                      color: 'var(--brand/ionos-blue-800)',
                      opacity: 0.65,
                    }}
                  >
                    {server.ip}
                  </span>

                  {/* CPU */}
                  <span
                    style={{
                      fontFamily: 'var(--base/font/body)',
                      fontSize: '0.875rem',
                      color: 'var(--brand/ionos-blue-800)',
                      opacity: 0.75,
                    }}
                  >
                    {server.cpu}
                  </span>

                  {/* RAM */}
                  <span
                    style={{
                      fontFamily: 'var(--base/font/body)',
                      fontSize: '0.875rem',
                      color: 'var(--brand/ionos-blue-800)',
                      opacity: 0.75,
                    }}
                  >
                    {server.ram}
                  </span>

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <Button variant="tertiary" size="sm" onClick={() => {}}>
                      Manage
                    </Button>
                    <Button variant="tertiary" size="sm" onClick={() => {}}>
                      <Icon group="system" name="more-horizontal" size={16} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Table footer */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: '0.875rem',
                padding: '0 0.25rem',
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--base/font/body)',
                  fontSize: '0.8rem',
                  color: 'var(--brand/ionos-blue-800)',
                  opacity: 0.5,
                }}
              >
                Showing 3 of 24 servers
              </span>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <Button variant="tertiary" size="sm" onClick={() => {}}>Previous</Button>
                <Button variant="tertiary" size="sm" onClick={() => {}}>Next</Button>
              </div>
            </div>
          </div>
        </main>
      </Surface>
    </ThemeProvider>
  );
}
