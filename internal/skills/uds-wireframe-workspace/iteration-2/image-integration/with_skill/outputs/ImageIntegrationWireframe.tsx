// Wireframe illustration — not production code

import { ThemeProvider, Surface } from '@ionos-web-design-system/react';
import { NavigationBar } from '@ionos-web-design-system/react/navigation-bar';
import { Button } from '@ionos-web-design-system/react/button';
import { TextField } from '@ionos-web-design-system/react/text-field';
import { Icon } from '@ionos-web-design-system/react/icon';

// Hero image — local file provided by user.
// Note: local paths only work when rendered in a dev server with filesystem access.
// For Next.js / Storybook, copy the file into `public/` and use `/hero-mockup.png`.
const heroImageSrc = '/Users/boweixiao/Desktop/hero-mockup.png';

const animationStyles = `
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .wf-enter {
    animation: fadeInUp 0.45s ease-out forwards;
  }
  .wf-enter-delay-1 { animation-delay: 80ms;  opacity: 0; }
  .wf-enter-delay-2 { animation-delay: 160ms; opacity: 0; }
  .wf-enter-delay-3 { animation-delay: 240ms; opacity: 0; }
`;

const features = [
  {
    icon: 'shield',
    title: '99.9% Uptime Guarantee',
    description:
      'Your website stays online around the clock, backed by enterprise-grade infrastructure and automatic failover.',
  },
  {
    icon: 'speed',
    title: 'Blazing-Fast SSD Hosting',
    description:
      'All plans run on NVMe SSD storage with global CDN — your pages load in milliseconds, anywhere in the world.',
  },
  {
    icon: 'support',
    title: '24/7 Expert Support',
    description:
      'Our hosting specialists are available day and night via live chat, phone, and email to keep you unblocked.',
  },
];

export default function ImageIntegrationWireframe() {
  return (
    <ThemeProvider brand="ionos" colorScheme="light" platform="comfortable">
      <style>{animationStyles}</style>

      {/* ── Navigation ── */}
      <NavigationBar
        brand="ionos"
        items={[
          { label: 'Web Hosting', href: '#' },
          { label: 'VPS & Cloud', href: '#' },
          { label: 'Domains', href: '#' },
          { label: 'Pricing', href: '#' },
        ]}
      />

      {/* ── Hero — full-width image fills top of page ── */}
      <div className="relative w-full h-[520px] overflow-hidden">
        <img
          src={heroImageSrc}
          alt="IONOS web hosting — hero mockup"
          className="w-full h-full object-cover"
        />
        {/* Dark overlay so the IONOS Sky CTA reads clearly on any photo */}
        <div
          className="absolute inset-0"
          style={{ background: 'var(--brand/ionos-blue-800)', opacity: 0.55 }}
        />
        {/* Centered hero text floated over the image */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-8 text-center wf-enter">
          <p
            className="text-sm font-semibold uppercase tracking-widest mb-3"
            style={{ color: 'var(--brand/ionos-sky-300)', fontFamily: 'var(--base/font/body)' }}
          >
            Web Hosting by IONOS
          </p>
          <h1
            className="text-5xl font-semibold mb-4 leading-tight"
            style={{ fontFamily: 'var(--base/font/heading)', color: '#ffffff' }}
          >
            Your website starts here.
          </h1>
          <p
            className="text-lg mb-8 max-w-xl"
            style={{ fontFamily: 'var(--base/font/body)', opacity: 0.85 }}
          >
            Fast, secure, and always online — everything you need to launch and grow your presence on the web.
          </p>
          <Button variant="primary" size="lg" onClick={() => {}}>
            Get started free
          </Button>
        </div>
      </div>

      {/* ── 2-Column section ── */}
      <Surface>
        <div className="max-w-6xl mx-auto px-8 py-16 grid grid-cols-2 gap-16 items-start">

          {/* ── Left column: Sign-up form ── */}
          <div className="wf-enter wf-enter-delay-1">
            <h2
              className="text-3xl font-semibold mb-3 leading-snug"
              style={{
                fontFamily: 'var(--base/font/heading)',
                color: 'var(--brand/ionos-blue-800)',
              }}
            >
              Create your free account
            </h2>
            <p
              className="text-base mb-8"
              style={{ fontFamily: 'var(--base/font/body)', opacity: 0.7 }}
            >
              Get started in minutes. No credit card required for your first 30 days.
            </p>

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
              <Button variant="primary" size="lg" onClick={() => {}}>
                Create account
              </Button>
              <p
                className="text-xs text-center"
                style={{ fontFamily: 'var(--base/font/body)', opacity: 0.5 }}
              >
                By signing up you agree to our{' '}
                <span style={{ color: 'var(--brand/ionos-sky-300)', cursor: 'pointer' }}>
                  Terms of Service
                </span>{' '}
                and{' '}
                <span style={{ color: 'var(--brand/ionos-sky-300)', cursor: 'pointer' }}>
                  Privacy Policy
                </span>
                .
              </p>
            </div>
          </div>

          {/* ── Right column: Feature bullet points ── */}
          <div className="wf-enter wf-enter-delay-2 flex flex-col gap-8 pt-2">
            <h2
              className="text-2xl font-semibold mb-2"
              style={{
                fontFamily: 'var(--base/font/heading)',
                color: 'var(--brand/ionos-blue-800)',
              }}
            >
              Why thousands of businesses choose IONOS
            </h2>

            {features.map((feature, i) => (
              <div
                key={feature.title}
                className="flex gap-4 items-start wf-enter"
                style={{ animationDelay: `${280 + i * 80}ms`, opacity: 0 }}
              >
                {/* Icon badge */}
                <div
                  className="shrink-0 w-11 h-11 rounded-full flex items-center justify-center"
                  style={{ background: 'var(--brand/ionos-sky-300)', opacity: 0.15 + 0 }}
                >
                  <div
                    className="w-11 h-11 rounded-full flex items-center justify-center"
                    style={{ background: 'rgba(17,199,230,0.15)' }}
                  >
                    <Icon group="system" name={feature.icon} size={22} />
                  </div>
                </div>

                {/* Text */}
                <div>
                  <h3
                    className="text-base font-semibold mb-1"
                    style={{
                      fontFamily: 'var(--base/font/heading)',
                      color: 'var(--brand/ionos-blue-800)',
                    }}
                  >
                    {feature.title}
                  </h3>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ fontFamily: 'var(--base/font/body)', opacity: 0.7 }}
                  >
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Surface>
    </ThemeProvider>
  );
}
