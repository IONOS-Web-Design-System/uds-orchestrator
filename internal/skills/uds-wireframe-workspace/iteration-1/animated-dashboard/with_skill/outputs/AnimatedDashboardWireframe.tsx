// Wireframe illustration — not production code
import { ThemeProvider, Surface } from '@ionos-web-design-system/react';
import { Card } from '@ionos-web-design-system/react/card';
import { Button } from '@ionos-web-design-system/react/button';
import { Icon } from '@ionos-web-design-system/react/icon';
import { NavigationBar } from '@ionos-web-design-system/react/navigation-bar';

// ---------------------------------------------------------------------------
// Animation keyframes injected via a <style> tag (native CSS — no Remotion
// needed since this is a staggered entrance, not a timeline sequence).
// ---------------------------------------------------------------------------
const animationStyles = `
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(14px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }

  .stat-card-enter {
    opacity: 0;
    animation: fadeInUp 0.45s ease-out forwards;
  }

  .server-row-enter {
    opacity: 0;
    animation: fadeIn 0.4s ease-out forwards;
  }

  .section-header-enter {
    opacity: 0;
    animation: fadeInUp 0.4s ease-out forwards;
  }

  .nav-enter {
    opacity: 0;
    animation: fadeIn 0.35s ease-out forwards;
    animation-delay: 0ms;
  }
`;

// ---------------------------------------------------------------------------
// Stat card data
// ---------------------------------------------------------------------------
const statCards = [
  {
    label: 'Active Servers',
    value: '24',
    delta: '+2 this week',
    iconName: 'server',
    accentColor: 'var(--brand/ionos-blue-600)',
  },
  {
    label: 'Monthly Traffic',
    value: '3.8 TB',
    delta: '↑ 12% vs last month',
    iconName: 'chart-bar',
    accentColor: 'var(--brand/ionos-sky-300)',
  },
  {
    label: 'Uptime',
    value: '99.97%',
    delta: 'Last 30 days',
    iconName: 'check-circle',
    accentColor: 'var(--utility/green-300)',
  },
  {
    label: 'Open Tickets',
    value: '5',
    delta: '2 high priority',
    iconName: 'alert-circle',
    accentColor: 'var(--utility/yellow-300)',
  },
];

// ---------------------------------------------------------------------------
// Server list data
// ---------------------------------------------------------------------------
type ServerStatus = 'Running' | 'Maintenance' | 'Offline';

const servers: {
  name: string;
  status: ServerStatus;
  location: string;
  cpu: string;
  ram: string;
}[] = [
  {
    name: 'web-prod-eu-01',
    status: 'Running',
    location: 'Frankfurt, DE',
    cpu: '34%',
    ram: '6.1 / 16 GB',
  },
  {
    name: 'db-prod-eu-02',
    status: 'Maintenance',
    location: 'Berlin, DE',
    cpu: '12%',
    ram: '9.8 / 32 GB',
  },
  {
    name: 'cdn-edge-us-01',
    status: 'Running',
    location: 'Newark, US',
    cpu: '58%',
    ram: '3.2 / 8 GB',
  },
];

// ---------------------------------------------------------------------------
// Status badge helper — uses approved UDS secondary colors semantically
// (shared-identity-principles.md § Product UI / dashboard)
// ---------------------------------------------------------------------------
const statusStyles: Record<ServerStatus, { bg: string; text: string; label: string }> = {
  Running: {
    bg: 'rgba(18, 207, 118, 0.12)',    // Green-300 at low opacity
    text: '#0D9A5A',
    label: 'Running',
  },
  Maintenance: {
    bg: 'rgba(255, 170, 0, 0.12)',     // Amber at low opacity
    text: '#A06C00',
    label: 'Maintenance',
  },
  Offline: {
    bg: 'rgba(255, 97, 89, 0.12)',     // Rose at low opacity
    text: '#C03228',
    label: 'Offline',
  },
};

function StatusBadge({ status }: { status: ServerStatus }) {
  const s = statusStyles[status];
  return (
    <span
      style={{
        backgroundColor: s.bg,
        color: s.text,
        fontFamily: 'var(--base/font/body)',
        fontSize: '0.75rem',
        fontWeight: 600,
        letterSpacing: '0.56px',
        padding: '2px 10px',
        borderRadius: '999px',
        textTransform: 'uppercase',
      }}
    >
      {s.label}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Main wireframe component
// ---------------------------------------------------------------------------
export default function AnimatedDashboardWireframe() {
  return (
    <ThemeProvider brand="ionos" colorScheme="light" platform="comfortable">
      <style>{animationStyles}</style>

      <Surface
        style={{
          minHeight: '100vh',
          backgroundColor: 'var(--neutral/cool-grey-100)',
          fontFamily: 'var(--base/font/body)',
        }}
      >
        {/* ----------------------------------------------------------------
            Navigation bar — fades in first (delay 0ms)
        ---------------------------------------------------------------- */}
        <div className="nav-enter" style={{ animationDelay: '0ms' }}>
          <NavigationBar
            brand="ionos"
            items={[
              { label: 'Servers', href: '#' },
              { label: 'Domains', href: '#' },
              { label: 'Storage', href: '#' },
              { label: 'Billing', href: '#' },
              { label: 'Support', href: '#' },
            ]}
          />
        </div>

        {/* ----------------------------------------------------------------
            Page content wrapper
        ---------------------------------------------------------------- */}
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px' }}>

          {/* Page header */}
          <div
            className="section-header-enter"
            style={{ animationDelay: '80ms', marginBottom: '28px' }}
          >
            <h1
              style={{
                fontFamily: 'var(--base/font/heading)',   // Overpass
                fontWeight: 600,
                fontSize: '1.75rem',
                color: 'var(--brand/ionos-blue-800)',     // Dark Midnight
                margin: 0,
                marginBottom: '4px',
              }}
            >
              Server Management
            </h1>
            <p
              style={{
                fontFamily: 'var(--base/font/body)',      // Open Sans
                fontSize: '0.9375rem',
                color: 'var(--brand/ionos-blue-800)',
                opacity: 0.6,
                margin: 0,
              }}
            >
              May 2026 — infrastructure overview for your IONOS account
            </p>
          </div>

          {/* ----------------------------------------------------------------
              Stat cards — staggered entrance animations
              Each card delays 120ms more than the previous
          ---------------------------------------------------------------- */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '16px',
              marginBottom: '32px',
            }}
          >
            {statCards.map((stat, i) => (
              <Card
                key={stat.label}
                className="stat-card-enter"
                style={{
                  animationDelay: `${200 + i * 120}ms`,
                  cursor: 'default',
                  padding: '20px',
                  borderRadius: '8px',
                  background: 'var(--neutral/white)',
                  boxShadow: '0 1px 4px rgba(0,27,65,0.08)',
                  transition: 'transform 0.2s ease-out, box-shadow 0.2s ease-out',
                }}
              >
                {/* Accent bar */}
                <div
                  style={{
                    width: '32px',
                    height: '3px',
                    borderRadius: '2px',
                    backgroundColor: stat.accentColor,
                    marginBottom: '12px',
                  }}
                />

                {/* Value */}
                <div
                  style={{
                    fontFamily: 'var(--base/font/heading)',  // Overpass for impact
                    fontWeight: 600,
                    fontSize: '2rem',
                    color: 'var(--brand/ionos-blue-800)',
                    lineHeight: 1.1,
                    marginBottom: '4px',
                  }}
                >
                  {stat.value}
                </div>

                {/* Label */}
                <div
                  style={{
                    fontFamily: 'var(--base/font/body)',
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    color: 'var(--brand/ionos-blue-800)',
                    marginBottom: '6px',
                  }}
                >
                  {stat.label}
                </div>

                {/* Delta / context */}
                <div
                  style={{
                    fontFamily: 'var(--base/font/body)',
                    fontSize: '0.75rem',
                    color: 'var(--brand/ionos-blue-800)',
                    opacity: 0.55,
                  }}
                >
                  {stat.delta}
                </div>
              </Card>
            ))}
          </div>

          {/* ----------------------------------------------------------------
              Server list section header
          ---------------------------------------------------------------- */}
          <div
            className="section-header-enter"
            style={{
              animationDelay: '700ms',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '16px',
            }}
          >
            <h2
              style={{
                fontFamily: 'var(--base/font/heading)',  // Overpass
                fontWeight: 600,
                fontSize: '1.125rem',
                color: 'var(--brand/ionos-blue-800)',
                margin: 0,
              }}
            >
              Your Servers
            </h2>
            <Button variant="primary" size="sm" onClick={() => {}}>
              + Deploy server
            </Button>
          </div>

          {/* ----------------------------------------------------------------
              Server table — rows fade in with stagger after cards are done
          ---------------------------------------------------------------- */}
          <Card
            style={{
              background: 'var(--neutral/white)',
              borderRadius: '8px',
              boxShadow: '0 1px 4px rgba(0,27,65,0.08)',
              overflow: 'hidden',
            }}
          >
            {/* Table header */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '2fr 1fr 1.5fr 1fr 1fr auto',
                gap: '0',
                padding: '10px 20px',
                borderBottom: '1px solid var(--neutral/cool-grey-100)',
                backgroundColor: 'var(--neutral/cool-grey-100)',
              }}
            >
              {['Server Name', 'Status', 'Location', 'CPU', 'RAM', 'Actions'].map((col) => (
                <div
                  key={col}
                  style={{
                    fontFamily: 'var(--base/font/body)',
                    fontSize: '0.6875rem',
                    fontWeight: 600,
                    letterSpacing: '0.56px',
                    textTransform: 'uppercase',
                    color: 'var(--brand/ionos-blue-800)',
                    opacity: 0.5,
                    padding: '0 4px',
                  }}
                >
                  {col}
                </div>
              ))}
            </div>

            {/* Server rows */}
            {servers.map((server, i) => (
              <div
                key={server.name}
                className="server-row-enter"
                style={{
                  animationDelay: `${820 + i * 100}ms`,
                  display: 'grid',
                  gridTemplateColumns: '2fr 1fr 1.5fr 1fr 1fr auto',
                  gap: '0',
                  padding: '14px 20px',
                  borderBottom:
                    i < servers.length - 1
                      ? '1px solid var(--neutral/cool-grey-100)'
                      : 'none',
                  alignItems: 'center',
                  transition: 'background-color 0.15s ease',
                }}
              >
                {/* Server name */}
                <div style={{ padding: '0 4px' }}>
                  <span
                    style={{
                      fontFamily: 'var(--base/font/body)',
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      color: 'var(--brand/ionos-blue-600)',
                    }}
                  >
                    {server.name}
                  </span>
                </div>

                {/* Status badge */}
                <div style={{ padding: '0 4px' }}>
                  <StatusBadge status={server.status} />
                </div>

                {/* Location */}
                <div
                  style={{
                    fontFamily: 'var(--base/font/body)',
                    fontSize: '0.875rem',
                    color: 'var(--brand/ionos-blue-800)',
                    opacity: 0.75,
                    padding: '0 4px',
                  }}
                >
                  {server.location}
                </div>

                {/* CPU */}
                <div style={{ padding: '0 4px' }}>
                  <div
                    style={{
                      fontFamily: 'var(--base/font/body)',
                      fontSize: '0.875rem',
                      color: 'var(--brand/ionos-blue-800)',
                      marginBottom: '4px',
                    }}
                  >
                    {server.cpu}
                  </div>
                  <div
                    style={{
                      height: '4px',
                      borderRadius: '2px',
                      backgroundColor: 'var(--neutral/cool-grey-100)',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        height: '100%',
                        width: server.cpu,
                        borderRadius: '2px',
                        backgroundColor:
                          parseInt(server.cpu) > 50
                            ? 'var(--utility/yellow-300)'
                            : 'var(--brand/ionos-sky-300)',
                      }}
                    />
                  </div>
                </div>

                {/* RAM */}
                <div
                  style={{
                    fontFamily: 'var(--base/font/body)',
                    fontSize: '0.875rem',
                    color: 'var(--brand/ionos-blue-800)',
                    opacity: 0.75,
                    padding: '0 4px',
                  }}
                >
                  {server.ram}
                </div>

                {/* Actions */}
                <div
                  style={{
                    display: 'flex',
                    gap: '8px',
                    padding: '0 4px',
                  }}
                >
                  <Button variant="secondary" size="sm" onClick={() => {}}>
                    Manage
                  </Button>
                  <Button variant="tertiary" size="sm" onClick={() => {}}>
                    Console
                  </Button>
                </div>
              </div>
            ))}
          </Card>

          {/* ----------------------------------------------------------------
              Footer note
          ---------------------------------------------------------------- */}
          <div
            className="section-header-enter"
            style={{
              animationDelay: '1100ms',
              marginTop: '24px',
              textAlign: 'center',
            }}
          >
            <p
              style={{
                fontFamily: 'var(--base/font/body)',
                fontSize: '0.75rem',
                color: 'var(--brand/ionos-blue-800)',
                opacity: 0.4,
                margin: 0,
              }}
            >
              Data refreshes every 60 seconds · IONOS Cloud Console v4.2
            </p>
          </div>
        </div>
      </Surface>
    </ThemeProvider>
  );
}
