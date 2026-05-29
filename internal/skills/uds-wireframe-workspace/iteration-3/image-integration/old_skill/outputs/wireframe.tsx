// Wireframe illustration — not production code
import { ThemeProvider, Surface } from '@ionos-web-design-system/react';
import { Button } from '@ionos-web-design-system/react/button';
import { TextField } from '@ionos-web-design-system/react/text-field';
import { Card } from '@ionos-web-design-system/react/card';
import { Icon } from '@ionos-web-design-system/react/icon';
import { ThemeInverter } from '@ionos-web-design-system/react/theme-inverter';

// Local hero image — only resolves when rendered in a dev server with filesystem access.
// For Next.js / Storybook, copy to public/ and use a relative URL instead.
const heroImageSrc = '/Users/boweixiao/Desktop/hero-mockup.png';

const features = [
  {
    iconName: 'lightning',
    title: 'Blazing-Fast Performance',
    description:
      'NVMe SSD storage and a global CDN ensure sub-second load times for visitors anywhere in the world.',
  },
  {
    iconName: 'lock',
    title: 'Enterprise-Grade Security',
    description:
      'Free SSL certificates, DDoS protection, and daily automated backups keep your site secure around the clock.',
  },
  {
    iconName: 'globe',
    title: '99.99% Uptime Guarantee',
    description:
      'Redundant data centres across Europe and North America mean your website is always reachable.',
  },
];

export default function IONOSHostingPageWireframe() {
  return (
    <ThemeProvider brand="ionos" colorScheme="light" platform="comfortable">

      {/* ── Hero Section — full-width image filling the top of the page ── */}
      <div className="relative w-full h-[480px] overflow-hidden">
        {/* Hero image */}
        <img
          src={heroImageSrc}
          alt="IONOS web hosting hero mockup"
          className="w-full h-full object-cover"
        />
        {/* Dark brand overlay for text legibility */}
        <div
          className="absolute inset-0 opacity-60"
          style={{ background: 'var(--brand/ionos-blue-800)' }}
        />
        {/* Hero headline and sub-copy centered over the image */}
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
          <h1
            className="text-5xl font-semibold leading-tight"
            style={{
              fontFamily: 'Overpass, sans-serif',
              color: 'var(--neutral/white)',
            }}
          >
            Professional Web Hosting
            <br />
            Built for Growth
          </h1>
          <p
            className="mt-4 text-lg max-w-xl opacity-90"
            style={{
              fontFamily: 'Open Sans, sans-serif',
              color: 'var(--neutral/white)',
            }}
          >
            Launch your website in minutes — reliable, secure, and scalable
            hosting from IONOS.
          </p>
        </div>
      </div>

      {/* ── 2-Column Layout — sign-up form | feature bullets ── */}
      <Surface>
        <div className="max-w-5xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 gap-12 items-start">

          {/* Left column — Headline + sign-up form */}
          <div>
            <h2
              className="text-3xl font-semibold mb-2"
              style={{
                fontFamily: 'Overpass, sans-serif',
                color: 'var(--brand/ionos-blue-700)',
              }}
            >
              Get Started Today
            </h2>
            <p
              className="text-base mb-8 opacity-70"
              style={{ fontFamily: 'Open Sans, sans-serif' }}
            >
              Create your free account and have your site live in under
              5 minutes.
            </p>

            <form
              className="flex flex-col gap-4"
              onSubmit={(e) => e.preventDefault()}
            >
              <TextField
                label="Email address"
                type="email"
                placeholder="you@example.com"
                onChange={() => {}}
              />
              <TextField
                label="Password"
                type="password"
                placeholder="Create a secure password"
                onChange={() => {}}
              />
              <Button
                variant="primary"
                className="w-full mt-2"
                onClick={() => {}}
              >
                Create Free Account
              </Button>
              <p
                className="text-xs text-center opacity-50"
                style={{ fontFamily: 'Open Sans, sans-serif' }}
              >
                No credit card required. Cancel anytime.
              </p>
            </form>
          </div>

          {/* Right column — 3 feature bullet points with icons */}
          <div className="flex flex-col gap-5">
            <h2
              className="text-3xl font-semibold mb-1"
              style={{
                fontFamily: 'Overpass, sans-serif',
                color: 'var(--brand/ionos-blue-700)',
              }}
            >
              Why Choose IONOS?
            </h2>

            {features.map((feature) => (
              <Card
                key={feature.title}
                className="flex items-start gap-4 p-5 transition-transform duration-200 ease-out hover:-translate-y-1 hover:shadow-lg cursor-default"
              >
                {/* Icon badge */}
                <div
                  className="w-10 h-10 flex items-center justify-center rounded-full shrink-0"
                  style={{ background: 'var(--brand/ionos-blue-100)' }}
                >
                  <Icon
                    group="system"
                    name={feature.iconName}
                    size={20}
                    style={{ color: 'var(--brand/ionos-blue-700)' }}
                  />
                </div>

                {/* Text */}
                <div>
                  <h3
                    className="text-base font-semibold mb-1"
                    style={{
                      fontFamily: 'Overpass, sans-serif',
                      color: 'var(--brand/ionos-blue-800)',
                    }}
                  >
                    {feature.title}
                  </h3>
                  <p
                    className="text-sm leading-relaxed opacity-70"
                    style={{ fontFamily: 'Open Sans, sans-serif' }}
                  >
                    {feature.description}
                  </p>
                </div>
              </Card>
            ))}
          </div>

        </div>
      </Surface>

    </ThemeProvider>
  );
}
