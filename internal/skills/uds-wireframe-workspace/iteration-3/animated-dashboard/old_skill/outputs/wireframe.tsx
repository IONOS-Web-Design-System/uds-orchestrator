// Wireframe illustration — not production code
import { ThemeProvider, Surface, Card, Button } from '@ionos-web-design-system/react';

// ---------------------------------------------------------------------------
// Animation keyframes — fadeInUp used for staggered stat-card entrance
// ---------------------------------------------------------------------------
const animationStyles = `
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: translateY(0); }
  }
`;

// ---------------------------------------------------------------------------
// Status badge — uses UDS utility tokens, no hard-coded hex
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

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------
const STAT_CARDS = [
  { label: 'Active Servers',   value: '24',      icon: '🖥️' },
  { label: 'Monthly Traffic',  value: '3.8 TB',  icon: '📶' },
  { label: 'Uptime',           value: '99.97%',  icon: '⬆️' },
  { label: 'Open Tickets',     value: '7',       icon: '🎫' },
];

const SERVERS: { name: string; status: ServerStatus; location: string }[] = [
  { name: 'web-prod-01',      status: 'Running',     location: 'Frankfurt, DE' },
  { name: 'db-primary-02',    status: 'Maintenance', location: 'Berlin, DE'    },
  { name: 'cache-edge-03',    status: 'Offline',     location: 'Madrid, ES'    },
];

// ---------------------------------------------------------------------------
// Wireframe component
// ---------------------------------------------------------------------------
export default function ServerDashboardWireframe() {
  return (
    <ThemeProvider brand="ionos" colorScheme="light" platform="comfortable">
      <style>{animationStyles}</style>

      <Surface
        style={{
          minHeight: '100vh',
          background: 'var(--background/neutral)',
          padding: '2rem',
        }}
      >

        {/* ── Page header ───────────────────────────────────────────────── */}
        <div style={{ marginBottom: '2rem' }}>
          <h1
            style={{
              fontFamily: 'var(--base/font/heading)',
              fontSize: '1.875rem',
              fontWeight: 700,
              color: 'var(--brand/ionos-blue-800)',
              margin: 0,
            }}
          >
            Server Management
          </h1>
          <p
            style={{
              fontFamily: 'var(--base/font/body)',
              fontSize: '0.9375rem',
              color: 'var(--neutral/cool-grey-600)',
              marginTop: '0.25rem',
            }}
          >
            IONOS Cloud — Infrastructure Overview · May 2026
          </p>
        </div>

        {/* ── Stat cards — staggered fadeInUp entrance ───────────────────── */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '1.5rem',
            marginBottom: '2.5rem',
          }}
        >
          {STAT_CARDS.map((card, i) => (
            <Card
              key={card.label}
              className="transition-transform duration-200 ease-out hover:-translate-y-1"
              style={{
                padding: '1.5rem',
                borderRadius: '12px',
                animation: 'fadeInUp 0.4s ease-out forwards',
                animationDelay: `${i * 100}ms`,
                opacity: 0,
                cursor: 'pointer',
              }}
            >
              <div style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>
                {card.icon}
              </div>
              <div
                style={{
                  fontFamily: 'var(--base/font/heading)',
                  fontSize: '2rem',
                  fontWeight: 700,
                  color: 'var(--brand/ionos-blue-800)',
                  lineHeight: 1,
                  marginBottom: '0.375rem',
                }}
              >
                {card.value}
              </div>
              <div
                style={{
                  fontFamily: 'var(--base/font/body)',
                  fontSize: '0.875rem',
                  color: 'var(--neutral/cool-grey-600)',
                }}
              >
                {card.label}
              </div>
            </Card>
          ))}
        </div>

        {/* ── Server list ───────────────────────────────────────────────── */}
        <Card
          style={{
            borderRadius: '12px',
            overflow: 'hidden',
          }}
        >
          {/* Table header bar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '1rem 1.5rem',
              borderBottom: '1px solid var(--background/neutral)',
            }}
          >
            <h2
              style={{
                fontFamily: 'var(--base/font/heading)',
                fontSize: '1.125rem',
                fontWeight: 600,
                color: 'var(--brand/ionos-blue-800)',
                margin: 0,
              }}
            >
              Servers
            </h2>
            <Button variant="primary" size="small" onClick={() => {}}>
              + Add Server
            </Button>
          </div>

          {/* Column labels */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '2fr 1.5fr 2fr 1.5fr',
              gap: '1rem',
              padding: '0.625rem 1.5rem',
              background: 'var(--background/neutral)',
              fontFamily: 'var(--base/font/body)',
              fontSize: '0.6875rem',
              fontWeight: 600,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              color: 'var(--neutral/cool-grey-500)',
            }}
          >
            <span>Server Name</span>
            <span>Status</span>
            <span>Location</span>
            <span>Actions</span>
          </div>

          {/* Server rows */}
          {SERVERS.map((server, i) => (
            <div
              key={server.name}
              style={{
                display: 'grid',
                gridTemplateColumns: '2fr 1.5fr 2fr 1.5fr',
                gap: '1rem',
                padding: '1rem 1.5rem',
                alignItems: 'center',
                borderBottom:
                  i < SERVERS.length - 1
                    ? '1px solid var(--background/neutral)'
                    : 'none',
                transition: 'background 150ms ease',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.background =
                  'var(--brand/ionos-blue-50)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.background = 'transparent';
              }}
            >
              {/* Server name */}
              <span
                style={{
                  fontFamily: 'monospace',
                  fontSize: '0.9375rem',
                  fontWeight: 500,
                  color: 'var(--brand/ionos-blue-800)',
                }}
              >
                {server.name}
              </span>

              {/* Status badge */}
              <StatusBadge status={server.status} />

              {/* Location */}
              <span
                style={{
                  fontFamily: 'var(--base/font/body)',
                  fontSize: '0.9375rem',
                  color: 'var(--neutral/cool-grey-700)',
                }}
              >
                {server.location}
              </span>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <Button variant="secondary" size="small" onClick={() => {}}>
                  Manage
                </Button>
                <Button variant="ghost" size="small" onClick={() => {}}>
                  Logs
                </Button>
              </div>
            </div>
          ))}
        </Card>

      </Surface>
    </ThemeProvider>
  );
}
