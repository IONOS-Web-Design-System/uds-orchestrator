// Wireframe illustration — not production code
import { ThemeProvider, Surface, Card, Button, Badge } from '@ionos-web-design-system/react';

const animationStyles = `
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: translateY(0); }
  }
`;

const statCards = [
  { label: 'Active Servers', value: '24', icon: '🖥️' },
  { label: 'Monthly Traffic', value: '3.8 TB', icon: '📊' },
  { label: 'Uptime', value: '99.97%', icon: '✅' },
  { label: 'Open Tickets', value: '7', icon: '🎫' },
];

const servers = [
  { name: 'web-prod-01', status: 'Running', location: 'Frankfurt, DE', statusColor: 'success' },
  { name: 'db-primary-02', status: 'Warning', location: 'Berlin, DE', statusColor: 'warning' },
  { name: 'cache-node-03', status: 'Stopped', location: 'Madrid, ES', statusColor: 'error' },
];

export default function AnimatedDashboardWireframe() {
  return (
    <ThemeProvider brand="ionos">
      <style>{animationStyles}</style>
      <Surface data-color-scheme="light" className="min-h-screen p-8 bg-gray-50">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900" style={{ fontFamily: 'Overpass, sans-serif' }}>
            Server Management
          </h1>
          <p className="text-gray-500 mt-1" style={{ fontFamily: 'Open Sans, sans-serif' }}>
            IONOS Cloud — Infrastructure Overview
          </p>
        </div>

        {/* Stat Cards — staggered entrance animation */}
        <div className="grid grid-cols-4 gap-6 mb-10">
          {statCards.map((card, i) => (
            <Card
              key={card.label}
              className="p-6 rounded-xl shadow-sm cursor-pointer transition-transform duration-200 ease-out hover:-translate-y-1 hover:shadow-md"
              style={{
                animation: 'fadeInUp 0.4s ease-out forwards',
                animationDelay: `${i * 100}ms`,
                opacity: 0,
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl">{card.icon}</span>
              </div>
              <div
                className="text-3xl font-bold text-gray-900 mb-1"
                style={{ fontFamily: 'Overpass, sans-serif' }}
              >
                {card.value}
              </div>
              <div
                className="text-sm text-gray-500"
                style={{ fontFamily: 'Open Sans, sans-serif' }}
              >
                {card.label}
              </div>
            </Card>
          ))}
        </div>

        {/* Server List */}
        <Card className="rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2
              className="text-lg font-semibold text-gray-800"
              style={{ fontFamily: 'Overpass, sans-serif' }}
            >
              Server List
            </h2>
            <Button onClick={() => {}} variant="primary" size="small">
              + Add Server
            </Button>
          </div>

          {/* Table header */}
          <div className="grid grid-cols-4 gap-4 px-6 py-3 bg-gray-50 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            <span>Name</span>
            <span>Status</span>
            <span>Location</span>
            <span>Actions</span>
          </div>

          {/* Server rows */}
          {servers.map((server, i) => (
            <div
              key={server.name}
              className="grid grid-cols-4 gap-4 px-6 py-4 border-b border-gray-50 items-center hover:bg-blue-50 transition-colors duration-150"
            >
              <span
                className="font-mono text-sm text-gray-800"
                style={{ fontFamily: 'Open Sans, sans-serif' }}
              >
                {server.name}
              </span>

              <span>
                <Badge
                  variant={
                    server.statusColor === 'success'
                      ? 'success'
                      : server.statusColor === 'warning'
                      ? 'warning'
                      : 'error'
                  }
                >
                  {server.status}
                </Badge>
              </span>

              <span
                className="text-sm text-gray-600"
                style={{ fontFamily: 'Open Sans, sans-serif' }}
              >
                {server.location}
              </span>

              <div className="flex gap-2">
                <Button onClick={() => {}} variant="secondary" size="small">
                  Manage
                </Button>
                <Button onClick={() => {}} variant="ghost" size="small">
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
