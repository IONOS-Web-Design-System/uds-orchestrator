// Wireframe illustration — not production code
import {
  ThemeProvider,
  Surface,
  Button,
  Card,
} from '@ionos-web-design-system/react';
import { ThemeInverter } from '@ionos-web-design-system/react/theme-inverter';
import { NavigationBar } from '@ionos-web-design-system/react/navigation-bar';

// Feature card data — placeholder content contextually matched to IONOS hosting products
const featureCards = [
  {
    title: 'Web Hosting',
    description:
      'Fast, reliable hosting with 99.98% uptime. Includes free SSL, 1-click WordPress installer, and 24/7 support.',
    cta: 'From €3.99/mo',
  },
  {
    title: 'VPS',
    description:
      'Full root access, dedicated resources, and Linux or Windows options. Scale CPU and RAM on demand.',
    cta: 'From €2.00/mo',
  },
  {
    title: 'Domains',
    description:
      'Register from 500+ extensions including .com, .io, and country domains. Free privacy protection included.',
    cta: 'From €1/1st year',
  },
];

export default function HeroFeatureGridWireframe() {
  return (
    <ThemeProvider brand="ionos" colorScheme="light" platform="comfortable">
      <Surface>
        {/* Navigation */}
        <NavigationBar
          brand="ionos"
          items={[
            { label: 'Products', href: '#' },
            { label: 'Solutions', href: '#' },
            { label: 'Pricing', href: '#' },
            { label: 'Support', href: '#' },
          ]}
        />

        {/* Hero Section — dark background via ThemeInverter */}
        <ThemeInverter>
          <Surface
            style={{
              background: `linear-gradient(160deg, var(--brand/ionos-blue-900), var(--brand/ionos-blue-800))`,
            }}
            className="px-8 py-24 text-center flex flex-col items-center"
          >
            {/* Eyebrow label */}
            <span
              className="text-sm font-semibold uppercase tracking-widest mb-4"
              style={{ color: 'var(--brand/ionos-sky-300)' }}
            >
              IONOS Cloud & Hosting
            </span>

            {/* Main headline — Overpass for impact */}
            <h1
              className="text-5xl font-semibold leading-tight max-w-3xl mb-5"
              style={{ fontFamily: 'var(--base/font/heading)' }}
            >
              Everything you need to get your business online
            </h1>

            {/* Subline — Open Sans body copy */}
            <p
              className="text-xl max-w-xl mb-10 opacity-80"
              style={{ fontFamily: 'var(--base/font/body)' }}
            >
              Domains, hosting, email, and cloud servers — all in one place.
              Trusted by 8 million customers across Europe.
            </p>

            {/* CTA row */}
            <div className="flex gap-4 justify-center">
              <Button variant="primary" size="lg" onClick={() => {}}>
                Get started free
              </Button>
              <Button variant="secondary" size="lg" onClick={() => {}}>
                See all products
              </Button>
            </div>
          </Surface>
        </ThemeInverter>

        {/* 3-Column Feature Card Row */}
        <Surface className="px-8 py-16">
          {/* Section heading */}
          <div className="text-center mb-10">
            <h2
              className="text-3xl font-semibold mb-2"
              style={{ fontFamily: 'var(--base/font/heading)', color: 'var(--brand/ionos-blue-800)' }}
            >
              Our most popular products
            </h2>
            <p
              className="text-base opacity-60"
              style={{ fontFamily: 'var(--base/font/body)' }}
            >
              Start small or scale big — every plan includes free migration assistance.
            </p>
          </div>

          {/* Card grid */}
          <div className="grid grid-cols-3 gap-6 max-w-5xl mx-auto">
            {featureCards.map((item) => (
              <Card key={item.title}>
                {/* Card icon placeholder */}
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
                  style={{ background: 'var(--brand/ionos-blue-600)' }}
                >
                  <span className="text-white text-xl font-bold">
                    {item.title.charAt(0)}
                  </span>
                </div>

                {/* Card title */}
                <h3
                  className="text-xl font-semibold mb-2"
                  style={{
                    fontFamily: 'var(--base/font/heading)',
                    color: 'var(--brand/ionos-blue-800)',
                  }}
                >
                  {item.title}
                </h3>

                {/* Card description */}
                <p
                  className="text-sm leading-relaxed mb-5 opacity-70"
                  style={{ fontFamily: 'var(--base/font/body)' }}
                >
                  {item.description}
                </p>

                {/* Pricing CTA */}
                <div className="mt-auto flex items-center justify-between">
                  <span
                    className="text-sm font-semibold"
                    style={{ color: 'var(--brand/ionos-sky-300)' }}
                  >
                    {item.cta}
                  </span>
                  <Button variant="tertiary" size="sm" onClick={() => {}}>
                    Learn more
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </Surface>
      </Surface>
    </ThemeProvider>
  );
}
