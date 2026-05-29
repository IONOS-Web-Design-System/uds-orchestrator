// Wireframe illustration — not production code
import { ThemeProvider, Surface } from '@ionos-web-design-system/react';
import { ThemeInverter } from '@ionos-web-design-system/react/theme-inverter';
import { Button } from '@ionos-web-design-system/react/button';
import { Card } from '@ionos-web-design-system/react/card';
import { NavigationBar } from '@ionos-web-design-system/react/navigation-bar';
import { Icon } from '@ionos-web-design-system/react/icon';

// ─── Animation styles ──────────────────────────────────────────────────────

const animationStyles = `
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .hero-enter {
    animation: fadeInUp 0.5s ease-out forwards;
  }
  .hero-enter-delay {
    animation: fadeInUp 0.5s ease-out 0.15s forwards;
    opacity: 0;
  }
  .hero-enter-cta {
    animation: fadeInUp 0.5s ease-out 0.3s forwards;
    opacity: 0;
  }
  .card-enter {
    animation: fadeInUp 0.35s ease-out forwards;
    opacity: 0;
  }
`;

// ─── Feature card data ─────────────────────────────────────────────────────

const features = [
  {
    icon: 'hosting',
    title: 'Web Hosting',
    description:
      'Launch your website with fast, reliable shared hosting. Included SSL, one-click WordPress, and 99.99% uptime guarantee.',
    badge: 'Most popular',
    price: 'From €3.00/mo',
    cta: 'Get web hosting',
  },
  {
    icon: 'vps',
    title: 'VPS Hosting',
    description:
      'Full root access on dedicated virtual resources. Scale CPU, RAM, and SSD storage independently as your traffic grows.',
    badge: null,
    price: 'From €2.00/mo',
    cta: 'Configure your VPS',
  },
  {
    icon: 'domains',
    title: 'Domain Names',
    description:
      'Claim your perfect address from 500+ extensions. Free WHOIS privacy, DNS management, and email forwarding included.',
    badge: null,
    price: 'From €1.00/yr',
    cta: 'Search domains',
  },
] as const;

// ─── Navigation ────────────────────────────────────────────────────────────

function SiteNav() {
  return (
    <NavigationBar
      brand="ionos"
      items={[
        { label: 'Products', href: '#' },
        { label: 'Solutions', href: '#' },
        { label: 'Pricing', href: '#' },
        { label: 'Support', href: '#' },
      ]}
    />
  );
}

// ─── Hero Section ──────────────────────────────────────────────────────────

function HeroSection() {
  return (
    <ThemeInverter>
      <Surface
        style={{
          background: `linear-gradient(160deg, var(--brand/ionos-blue-900) 0%, var(--brand/ionos-blue-800) 100%)`,
          padding: '96px 64px',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorative radial glow — brand Sky accent */}
        <div
          aria-hidden
          style={{
            position: 'absolute',
            top: '-80px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '600px',
            height: '600px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(17, 199, 230, 0.12) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        {/* Eyebrow label */}
        <p
          className="hero-enter"
          style={{
            fontFamily: 'var(--base/font/body)',
            fontSize: '0.75rem',
            fontWeight: 600,
            letterSpacing: '0.56px',
            textTransform: 'uppercase',
            color: 'var(--brand/ionos-sky-300)',
            marginBottom: '16px',
          }}
        >
          IONOS Hosting
        </p>

        {/* H1 — Overpass, the brand headline typeface */}
        <h1
          className="hero-enter"
          style={{
            fontFamily: 'var(--base/font/heading)',
            fontSize: 'clamp(2.25rem, 5vw, 3.5rem)',
            fontWeight: 600,
            color: 'var(--neutral/white)',
            lineHeight: 1.15,
            maxWidth: '720px',
            margin: '0 auto 20px',
          }}
        >
          Everything you need to succeed online
        </h1>

        {/* Subline — Open Sans body */}
        <p
          className="hero-enter-delay"
          style={{
            fontFamily: 'var(--base/font/body)',
            fontSize: '1.125rem',
            color: 'var(--neutral/white)',
            opacity: 0.8,
            maxWidth: '520px',
            margin: '0 auto 40px',
            lineHeight: 1.6,
          }}
        >
          Hosting, domains, and VPS from the provider trusted by 12 million customers across Europe.
        </p>

        {/* CTA — Sky is the single focal-point CTA color per brand rules */}
        <div className="hero-enter-cta" style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button
            variant="primary"
            size="lg"
            style={{ backgroundColor: 'var(--brand/ionos-sky-300)', color: 'var(--brand/ionos-blue-800)' }}
            onClick={() => {}}
          >
            Get started free
          </Button>
          <Button
            variant="ghost"
            size="lg"
            style={{ color: 'var(--neutral/white)', borderColor: 'rgba(255,255,255,0.4)' }}
            onClick={() => {}}
          >
            See all products
          </Button>
        </div>

        {/* Social proof bar */}
        <p
          style={{
            fontFamily: 'var(--base/font/body)',
            fontSize: '0.8125rem',
            color: 'var(--neutral/white)',
            opacity: 0.5,
            marginTop: '40px',
          }}
        >
          No setup fees · Cancel anytime · 30-day money-back guarantee
        </p>
      </Surface>
    </ThemeInverter>
  );
}

// ─── Feature Card ──────────────────────────────────────────────────────────

function FeatureCard({
  icon,
  title,
  description,
  badge,
  price,
  cta,
  animationDelay,
}: (typeof features)[number] & { animationDelay: number }) {
  return (
    <div
      className="card-enter"
      style={{
        animationDelay: `${animationDelay}ms`,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
    >
      <Card
        className="transition-transform duration-200 ease-out hover:-translate-y-1 hover:shadow-lg cursor-pointer"
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          padding: '28px',
          position: 'relative',
          border: '1px solid var(--neutral/cool-grey-100)',
        }}
      >
        {/* Optional "Most popular" badge */}
        {badge && (
          <span
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              backgroundColor: 'rgba(17, 199, 230, 0.12)',
              color: 'var(--brand/ionos-blue-800)',
              borderLeft: '3px solid var(--brand/ionos-sky-300)',
              fontFamily: 'var(--base/font/body)',
              fontSize: '0.6875rem',
              fontWeight: 600,
              letterSpacing: '0.56px',
              textTransform: 'uppercase',
              padding: '3px 10px',
              borderRadius: '999px',
            }}
          >
            {badge}
          </span>
        )}

        {/* Product icon */}
        <div
          style={{
            width: '52px',
            height: '52px',
            borderRadius: '12px',
            background: `linear-gradient(135deg, var(--brand/ionos-blue-600), var(--brand/ionos-blue-800))`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '20px',
            flexShrink: 0,
          }}
        >
          <Icon group="ionos" name={icon} size={28} style={{ color: 'var(--neutral/white)' }} />
        </div>

        {/* Title — Open Sans (UI context, not a marketing headline) */}
        <h3
          style={{
            fontFamily: 'var(--base/font/body)',
            fontSize: '1.125rem',
            fontWeight: 600,
            color: 'var(--brand/ionos-blue-800)',
            marginBottom: '10px',
          }}
        >
          {title}
        </h3>

        {/* Description */}
        <p
          style={{
            fontFamily: 'var(--base/font/body)',
            fontSize: '0.9375rem',
            color: 'var(--brand/ionos-blue-800)',
            opacity: 0.7,
            lineHeight: 1.6,
            flex: 1,
            marginBottom: '24px',
          }}
        >
          {description}
        </p>

        {/* Price */}
        <p
          style={{
            fontFamily: 'var(--base/font/heading)',
            fontSize: '1.25rem',
            fontWeight: 600,
            color: 'var(--brand/ionos-blue-600)',
            marginBottom: '16px',
          }}
        >
          {price}
        </p>

        {/* CTA */}
        <Button variant="secondary" size="md" onClick={() => {}}>
          {cta}
        </Button>
      </Card>
    </div>
  );
}

// ─── Feature Grid Section ──────────────────────────────────────────────────

function FeatureGridSection() {
  return (
    <Surface
      style={{
        background: 'var(--neutral/cool-grey-100)',
        padding: '72px 64px',
      }}
    >
      {/* Section heading */}
      <div style={{ textAlign: 'center', marginBottom: '48px' }}>
        <h2
          style={{
            fontFamily: 'var(--base/font/heading)',
            fontSize: 'clamp(1.5rem, 3vw, 2.25rem)',
            fontWeight: 600,
            color: 'var(--brand/ionos-blue-800)',
            marginBottom: '12px',
          }}
        >
          Choose your hosting solution
        </h2>
        <p
          style={{
            fontFamily: 'var(--base/font/body)',
            fontSize: '1rem',
            color: 'var(--brand/ionos-blue-800)',
            opacity: 0.65,
            maxWidth: '460px',
            margin: '0 auto',
            lineHeight: 1.6,
          }}
        >
          Whether you're launching a blog or scaling an enterprise platform, we have the right plan for you.
        </p>
      </div>

      {/* 3-column card grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '24px',
          maxWidth: '1100px',
          margin: '0 auto',
        }}
      >
        {features.map((feature, i) => (
          <FeatureCard key={feature.title} {...feature} animationDelay={i * 100} />
        ))}
      </div>
    </Surface>
  );
}

// ─── Root wireframe export ─────────────────────────────────────────────────

export default function HeroFeatureGridWireframe() {
  return (
    <ThemeProvider brand="ionos" colorScheme="light" platform="comfortable">
      <style>{animationStyles}</style>

      {/* Navigation */}
      <SiteNav />

      {/* Hero — dark background, headline, subline, CTA */}
      <HeroSection />

      {/* 3-column feature card row */}
      <FeatureGridSection />
    </ThemeProvider>
  );
}
