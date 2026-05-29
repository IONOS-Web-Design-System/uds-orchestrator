// Wireframe illustration — not production code
import ThemeProvider from '@ionos-web-design-system/react/theme-provider';
import ThemeInverter from '@ionos-web-design-system/react/theme-inverter';
import Surface from '@ionos-web-design-system/react/surface';
import Button from '@ionos-web-design-system/react/button';
import Card from '@ionos-web-design-system/react/card';
import Icon from '@ionos-web-design-system/react/icon';
import { serverLight, globeLight, domainLight } from '@ionos-web-design-system/icon/system';

// ─── Feature card data ────────────────────────────────────────────────────────

const FEATURES = [
  {
    icon: serverLight,
    title: 'Web Hosting',
    description:
      'Fast, reliable hosting with SSD storage, 99.99% uptime, and one-click WordPress installs. Perfect for websites of every size.',
    cta: 'Explore Web Hosting',
    price: 'From €1/mo',
  },
  {
    icon: serverLight,
    title: 'VPS',
    description:
      'Dedicated resources, full root access, and scalable RAM & CPU — the power you need to run demanding workloads.',
    cta: 'Configure Your VPS',
    price: 'From €4/mo',
  },
  {
    icon: domainLight,
    title: 'Domains',
    description:
      'Register your perfect domain from 500+ extensions. Free WHOIS privacy and DNS management included on every domain.',
    cta: 'Find Your Domain',
    price: 'From €1/year',
  },
];

// ─── Hero section ─────────────────────────────────────────────────────────────

function HeroSection() {
  return (
    <ThemeInverter forceColorScheme="dark">
      <Surface variant="base" asChild>
        <section
          style={{
            background: `linear-gradient(160deg, var(--brand/ionos-blue-900) 0%, var(--brand/ionos-blue-800) 100%)`,
            padding: '6rem 2rem',
            textAlign: 'center',
          }}
        >
          {/* Pre-headline badge */}
          <div
            style={{
              display: 'inline-block',
              background: 'rgba(17, 199, 230, 0.15)',
              border: '1px solid var(--brand/ionos-sky-300)',
              borderRadius: '999px',
              padding: '4px 16px',
              marginBottom: '1.5rem',
              fontFamily: 'var(--base/font/body)',
              fontSize: '0.8125rem',
              fontWeight: 600,
              letterSpacing: '0.56px',
              textTransform: 'uppercase',
              color: 'var(--brand/ionos-sky-300)',
            }}
          >
            IONOS Hosting Platform
          </div>

          {/* Headline */}
          <h1
            style={{
              fontFamily: 'var(--base/font/heading)',
              fontWeight: 600,
              fontSize: 'clamp(2.25rem, 5vw, 3.75rem)',
              lineHeight: 1.15,
              color: 'var(--neutral/white)',
              margin: '0 auto 1.5rem',
              maxWidth: '44rem',
            }}
          >
            Everything you need to grow online — all in one place.
          </h1>

          {/* Subline */}
          <p
            style={{
              fontFamily: 'var(--base/font/body)',
              fontSize: '1.1875rem',
              lineHeight: 1.65,
              color: 'var(--neutral/white)',
              opacity: 0.8,
              maxWidth: '34rem',
              margin: '0 auto 2.5rem',
            }}
          >
            Domains, hosting, VPS, and email from a single provider trusted by
            12 million customers worldwide.
          </p>

          {/* CTA cluster */}
          <div
            style={{
              display: 'flex',
              gap: '1rem',
              justifyContent: 'center',
              flexWrap: 'wrap',
            }}
          >
            <Button concept="brand" variant="primary" size="large" onClick={() => {}}>
              Get started for free
            </Button>
            <Button concept="monochrome" variant="secondary" size="large" onClick={() => {}}>
              View all products
            </Button>
          </div>

          {/* Trust line */}
          <p
            style={{
              marginTop: '2rem',
              fontFamily: 'var(--base/font/body)',
              fontSize: '0.875rem',
              color: 'var(--neutral/white)',
              opacity: 0.55,
            }}
          >
            No setup fees · Cancel anytime · 30-day money-back guarantee
          </p>
        </section>
      </Surface>
    </ThemeInverter>
  );
}

// ─── Feature card ─────────────────────────────────────────────────────────────

interface FeatureCardProps {
  icon: unknown;
  title: string;
  description: string;
  cta: string;
  price: string;
}

function FeatureCard({ icon, title, description, cta, price }: FeatureCardProps) {
  return (
    <Card
      variant="clickable"
      visual={{
        icon: true,
        iconContent: (
          <Icon
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            icon={icon as any}
            size="xLarge"
            style={{ color: 'var(--brand/ionos-blue-600)' }}
          />
        ),
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
          height: '100%',
        }}
      >
        <h2
          style={{
            fontFamily: 'var(--base/font/heading)',
            fontWeight: 600,
            fontSize: '1.375rem',
            color: 'var(--brand/ionos-blue-800)',
            margin: 0,
          }}
        >
          {title}
        </h2>

        <p
          style={{
            fontFamily: 'var(--base/font/body)',
            fontSize: '0.9375rem',
            lineHeight: 1.6,
            color: 'var(--brand/ionos-blue-800)',
            opacity: 0.75,
            margin: 0,
            flexGrow: 1,
          }}
        >
          {description}
        </p>

        <div
          style={{
            fontFamily: 'var(--base/font/body)',
            fontWeight: 700,
            fontSize: '0.875rem',
            color: 'var(--brand/ionos-sky-300)',
            letterSpacing: '0.2px',
          }}
        >
          {price}
        </div>

        <Button concept="brand" variant="secondary" size="medium" onClick={() => {}}>
          {cta}
        </Button>
      </div>
    </Card>
  );
}

// ─── Feature grid section ─────────────────────────────────────────────────────

function FeatureGridSection() {
  return (
    <Surface variant="subtle" asChild>
      <section style={{ padding: '5rem 2rem' }}>
        {/* Section heading */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2
            style={{
              fontFamily: 'var(--base/font/heading)',
              fontWeight: 600,
              fontSize: '2rem',
              color: 'var(--brand/ionos-blue-800)',
              margin: '0 0 0.75rem',
            }}
          >
            Pick the product that fits your goals
          </h2>
          <p
            style={{
              fontFamily: 'var(--base/font/body)',
              fontSize: '1.0625rem',
              color: 'var(--brand/ionos-blue-800)',
              opacity: 0.7,
              maxWidth: '36rem',
              margin: '0 auto',
            }}
          >
            Whether you're launching your first site or scaling a growing
            business, IONOS has the right hosting solution.
          </p>
        </div>

        {/* 3-column card grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '1.5rem',
            maxWidth: '72rem',
            margin: '0 auto',
          }}
        >
          {FEATURES.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>
      </section>
    </Surface>
  );
}

// ─── Root wireframe export ────────────────────────────────────────────────────

export default function HostingLandingWireframe() {
  return (
    <ThemeProvider>
      <main
        data-brand="ionos"
        data-platform="comfortable"
        data-color-scheme="light"
        style={{ minHeight: '100vh', fontFamily: 'var(--base/font/body)' }}
      >
        <HeroSection />
        <FeatureGridSection />
      </main>
    </ThemeProvider>
  );
}
