// Wireframe illustration — not production code
import { ThemeProvider, Surface } from '@ionos-web-design-system/react';
import { NavigationBar } from '@ionos-web-design-system/react/navigation-bar';
import { Button } from '@ionos-web-design-system/react/button';
import { TextField } from '@ionos-web-design-system/react/text-field';
import { Icon } from '@ionos-web-design-system/react/icon';

// Hero image: local path provided by user
// Note: local paths only work in a dev server with filesystem access (e.g. Next.js or Vite dev).
// For reliable rendering, copy the image into the project's public/ folder and reference it as /hero-mockup.png
const heroImageSrc = '/Users/boweixiao/Desktop/hero-mockup.png';

const features = [
  {
    icon: 'check-circle' as const,
    title: '99.98% Uptime Guarantee',
    description:
      'Your site stays online around the clock — backed by redundant infrastructure across multiple data centres.',
  },
  {
    icon: 'speed' as const,
    title: 'Blazing-Fast SSD Storage',
    description:
      'NVMe SSD drives deliver page-load speeds that keep visitors engaged and search rankings high.',
  },
  {
    icon: 'lock' as const,
    title: 'Free SSL Certificate Included',
    description:
      'Every hosting plan ships with a Let\'s Encrypt SSL certificate, automatically renewed for you.',
  },
];

export default function ImageIntegrationWireframe() {
  return (
    <ThemeProvider brand="ionos" colorScheme="light" platform="comfortable">
      <Surface>

        {/* ── Navigation ───────────────────────────────────────────────── */}
        <NavigationBar
          brand="ionos"
          items={[
            { label: 'Web Hosting', href: '#' },
            { label: 'VPS & Cloud', href: '#' },
            { label: 'Domains', href: '#' },
            { label: 'Pricing', href: '#' },
          ]}
        />

        {/* ── Hero Image (full-width, fills top of page) ───────────────── */}
        <div className="relative w-full h-[480px] overflow-hidden">
          <img
            src={heroImageSrc}
            alt="IONOS Web Hosting — hero product mockup"
            className="w-full h-full object-cover"
          />
          {/* Subtle dark overlay so the image reads as a hero backdrop */}
          <div
            className="absolute inset-0 opacity-50"
            style={{
              background: `linear-gradient(
                to bottom,
                var(--brand/ionos-blue-900),
                var(--brand/ionos-blue-800)
              )`,
            }}
          />
          {/* Tagline anchored in the overlay — kept minimal so image dominates */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-8 text-center">
            <p
              className="text-lg tracking-wide uppercase mb-3 opacity-80"
              style={{ fontFamily: 'var(--base/font/body)' }}
            >
              IONOS Web Hosting
            </p>
            <h1
              className="text-5xl font-semibold leading-tight"
              style={{ fontFamily: 'var(--base/font/heading)' }}
            >
              The web is yours.
            </h1>
          </div>
        </div>

        {/* ── Two-Column Content Section ───────────────────────────────── */}
        <div
          className="max-w-6xl mx-auto grid grid-cols-2 gap-12 px-12 py-16"
        >

          {/* ── LEFT: Headline + Sign-Up Form ──────────────────────────── */}
          <div className="flex flex-col gap-6">
            <div>
              <h2
                className="text-3xl font-semibold mb-3"
                style={{
                  fontFamily: 'var(--base/font/heading)',
                  color: 'var(--brand/ionos-blue-800)',
                }}
              >
                Start hosting your site today
              </h2>
              <p
                className="text-base leading-relaxed opacity-70"
                style={{ fontFamily: 'var(--base/font/body)' }}
              >
                Create your free account in seconds. No credit card required —
                just your email address and a secure password to get started.
              </p>
            </div>

            {/* Sign-up form */}
            <div className="flex flex-col gap-4">
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
                style={{ backgroundColor: 'var(--brand/ionos-sky-300)' }}
              >
                Create free account
              </Button>
              <p
                className="text-xs opacity-50 text-center"
                style={{ fontFamily: 'var(--base/font/body)' }}
              >
                By signing up you agree to our Terms of Service and Privacy Policy.
              </p>
            </div>
          </div>

          {/* ── RIGHT: Feature Bullet Points ─────────────────────────── */}
          <div className="flex flex-col gap-8 justify-center">
            {features.map((feature) => (
              <div key={feature.title} className="flex items-start gap-4">
                {/* Icon badge */}
                <div
                  className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: 'var(--brand/ionos-sky-300)' }}
                >
                  <Icon group="system" name={feature.icon} size={20} color="white" />
                </div>

                {/* Text */}
                <div>
                  <h3
                    className="text-base font-semibold mb-1"
                    style={{
                      fontFamily: 'var(--base/font/body)',
                      color: 'var(--brand/ionos-blue-800)',
                    }}
                  >
                    {feature.title}
                  </h3>
                  <p
                    className="text-sm leading-relaxed opacity-70"
                    style={{ fontFamily: 'var(--base/font/body)' }}
                  >
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* ── Footer strip ─────────────────────────────────────────────── */}
        <div
          className="w-full py-6 px-12 flex items-center justify-between"
          style={{ backgroundColor: 'var(--brand/ionos-blue-900)' }}
        >
          <p
            className="text-sm text-white opacity-60"
            style={{ fontFamily: 'var(--base/font/body)' }}
          >
            © 2026 IONOS SE — All rights reserved.
          </p>
          <div className="flex gap-6">
            {['Privacy Policy', 'Terms of Service', 'Imprint'].map((link) => (
              <a
                key={link}
                href="#"
                className="text-sm text-white opacity-60 hover:opacity-100 transition-opacity"
                style={{ fontFamily: 'var(--base/font/body)' }}
              >
                {link}
              </a>
            ))}
          </div>
        </div>

      </Surface>
    </ThemeProvider>
  );
}
