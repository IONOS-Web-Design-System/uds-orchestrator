// Wireframe illustration — not production code
// Hero image source: /Users/boweixiao/Desktop/hero-mockup.png (local path — works in dev server with filesystem access)

import { ThemeProvider, Surface } from '@ionos-web-design-system/react';
import { NavigationBar } from '@ionos-web-design-system/react/navigation-bar';
import { Button } from '@ionos-web-design-system/react/button';
import { TextField } from '@ionos-web-design-system/react/text-field';
import { Icon } from '@ionos-web-design-system/react/icon';

const heroImageSrc = '/Users/boweixiao/Desktop/hero-mockup.png';

const features = [
  {
    icon: 'server',
    title: 'Blazing-fast SSD hosting',
    description:
      'Your website loads in milliseconds — powered by NVMe SSDs and a global CDN with 12 data centres.',
  },
  {
    icon: 'shield',
    title: 'SSL & DDoS protection included',
    description:
      'Every plan ships with a free Wildcard SSL certificate and always-on DDoS mitigation at no extra cost.',
  },
  {
    icon: 'support',
    title: '24/7 expert support',
    description:
      'Get help any time via live chat, phone, or email. Our certified engineers are on call around the clock.',
  },
];

export default function IONOSHostingProductPageWireframe() {
  return (
    <ThemeProvider brand="ionos" colorScheme="light" platform="comfortable">
      <Surface style={{ fontFamily: 'var(--base/font/body)', color: 'var(--brand/ionos-blue-800)' }}>

        {/* ── Navigation ─────────────────────────────────────────────────── */}
        <NavigationBar
          brand="ionos"
          items={[
            { label: 'Web Hosting', href: '#' },
            { label: 'VPS & Cloud', href: '#' },
            { label: 'Domains', href: '#' },
            { label: 'Pricing', href: '#' },
          ]}
        />

        {/* ── Hero — full-width image fill ───────────────────────────────── */}
        <div className="relative w-full overflow-hidden" style={{ height: '480px' }}>
          <img
            src={heroImageSrc}
            alt="IONOS web hosting — hero"
            className="w-full h-full object-cover"
          />
          {/* Overlay: dark blue tint for legibility */}
          <div
            className="absolute inset-0"
            style={{ background: 'var(--brand/ionos-blue-800)', opacity: 0.55 }}
          />
          {/* Hero copy centred over image */}
          <div
            className="absolute inset-0 flex flex-col items-center justify-center text-center px-8"
          >
            <h1
              className="text-5xl font-semibold mb-4 leading-tight"
              style={{
                fontFamily: 'var(--base/font/heading)',
                color: 'var(--neutral/white)',
              }}
            >
              Your business online —<br />fast, secure, and effortless.
            </h1>
            <p
              className="text-xl mb-8"
              style={{ color: 'var(--neutral/white)', opacity: 0.85, fontFamily: 'var(--base/font/body)' }}
            >
              Professional web hosting from €1/month. Up in minutes.
            </p>
          </div>
        </div>

        {/* ── Two-column section ─────────────────────────────────────────── */}
        <div
          className="grid grid-cols-2 gap-12 px-16 py-16"
          style={{ background: 'var(--neutral/cool-grey-100)' }}
        >

          {/* Left column — headline + sign-up form */}
          <div className="flex flex-col justify-center">
            <h2
              className="text-3xl font-semibold mb-3"
              style={{ fontFamily: 'var(--base/font/heading)', color: 'var(--brand/ionos-blue-800)' }}
            >
              Start hosting today
            </h2>
            <p
              className="text-base mb-8"
              style={{ fontFamily: 'var(--base/font/body)', color: 'var(--brand/ionos-blue-800)', opacity: 0.75 }}
            >
              Create your free account and get your website live in under 5 minutes.
              No credit card required to get started.
            </p>

            <div className="flex flex-col gap-4 max-w-sm">
              <TextField
                label="Email address"
                placeholder="you@example.com"
                type="email"
                onChange={() => {}}
              />
              <TextField
                label="Password"
                placeholder="••••••••"
                type="password"
                onChange={() => {}}
              />
              <Button
                variant="primary"
                size="lg"
                onClick={() => {}}
                style={{ marginTop: '4px' }}
              >
                Create free account
              </Button>

              <p
                className="text-xs text-center"
                style={{ fontFamily: 'var(--base/font/body)', color: 'var(--brand/ionos-blue-800)', opacity: 0.5 }}
              >
                By signing up you agree to our{' '}
                <a href="#" style={{ color: 'var(--brand/ionos-blue-600)' }}>Terms of Service</a>
                {' '}and{' '}
                <a href="#" style={{ color: 'var(--brand/ionos-blue-600)' }}>Privacy Policy</a>.
              </p>
            </div>
          </div>

          {/* Right column — 3 feature bullet points with icons */}
          <div className="flex flex-col justify-center gap-8">
            {features.map((feature) => (
              <div key={feature.title} className="flex gap-4 items-start">
                <div
                  className="shrink-0 flex items-center justify-center rounded-lg"
                  style={{
                    width: '48px',
                    height: '48px',
                    background: 'var(--brand/ionos-blue-600)',
                  }}
                >
                  <Icon
                    group="system"
                    name={feature.icon}
                    size={24}
                    style={{ color: 'var(--neutral/white)' }}
                  />
                </div>
                <div>
                  <h3
                    className="text-lg font-semibold mb-1"
                    style={{ fontFamily: 'var(--base/font/heading)', color: 'var(--brand/ionos-blue-800)' }}
                  >
                    {feature.title}
                  </h3>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ fontFamily: 'var(--base/font/body)', color: 'var(--brand/ionos-blue-800)', opacity: 0.72 }}
                  >
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Footer strip ───────────────────────────────────────────────── */}
        <footer
          className="py-6 px-16 flex items-center justify-between text-sm"
          style={{
            background: 'var(--brand/ionos-blue-900)',
            color: 'var(--neutral/white)',
            fontFamily: 'var(--base/font/body)',
            opacity: 0.9,
          }}
        >
          <span style={{ fontFamily: 'var(--base/font/heading)', fontWeight: 600, fontSize: '1rem' }}>
            IONOS
          </span>
          <span style={{ opacity: 0.6 }}>© 2026 IONOS SE. All rights reserved.</span>
          <div className="flex gap-6">
            <a href="#" style={{ color: 'var(--neutral/white)', opacity: 0.7, textDecoration: 'none' }}>Imprint</a>
            <a href="#" style={{ color: 'var(--neutral/white)', opacity: 0.7, textDecoration: 'none' }}>Privacy</a>
            <a href="#" style={{ color: 'var(--neutral/white)', opacity: 0.7, textDecoration: 'none' }}>Cookie settings</a>
          </div>
        </footer>

      </Surface>
    </ThemeProvider>
  );
}
