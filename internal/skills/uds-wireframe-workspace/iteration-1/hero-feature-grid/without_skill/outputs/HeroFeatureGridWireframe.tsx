import React from 'react';

// UDS component imports
import ThemeProvider from '@ionos-web-design-system/react/theme-provider';
import ThemeInverter from '@ionos-web-design-system/react/theme-inverter';
import Surface from '@ionos-web-design-system/react/surface';
import HeroTile from '@ionos-web-design-system/react/hero-tile';
import Text from '@ionos-web-design-system/react/text';
import Button from '@ionos-web-design-system/react/button';
import Box from '@ionos-web-design-system/react/box';
import Icon from '@ionos-web-design-system/react/icon';

// Icons from the UDS icon system
import { cloudLight, server, globe } from '@ionos-web-design-system/icon/system';

// ---------------------------------------------------------------------------
// Feature card data
// ---------------------------------------------------------------------------

interface FeatureCardData {
  icon: unknown;
  title: string;
  description: string;
  ctaLabel: string;
}

const FEATURE_CARDS: FeatureCardData[] = [
  {
    icon: cloudLight,
    title: 'Web Hosting',
    description:
      'Fast, reliable hosting with one-click WordPress installs, free SSL, and 24/7 support. Perfect for personal sites and small businesses.',
    ctaLabel: 'Explore Web Hosting',
  },
  {
    icon: server,
    title: 'VPS Hosting',
    description:
      'Full root access, dedicated resources, and scalable performance. Ideal for growing applications that need more power and flexibility.',
    ctaLabel: 'Explore VPS',
  },
  {
    icon: globe,
    title: 'Domains',
    description:
      'Find and register your perfect domain from 500+ extensions. Bundle with hosting for free domain privacy and seamless DNS management.',
    ctaLabel: 'Search Domains',
  },
];

// ---------------------------------------------------------------------------
// FeatureCard sub-component
// ---------------------------------------------------------------------------

function FeatureCard({ icon, title, description, ctaLabel }: FeatureCardData) {
  return (
    <Box
      visual={{
        icon: true,
        iconContent: <Icon icon={icon} size="xLarge" />,
      }}
      footer={
        <Button concept="brand" variant="secondary" size="medium">
          {ctaLabel}
        </Button>
      }
    >
      <Text asChild variant="headingLg" className="mb-2">
        <h3>{title}</h3>
      </Text>
      <Text variant="body" className="text-subtle">
        {description}
      </Text>
    </Box>
  );
}

// ---------------------------------------------------------------------------
// Main page component
// ---------------------------------------------------------------------------

export default function HeroFeatureGridWireframe() {
  return (
    // ThemeProvider reads data-brand / data-platform / data-color-scheme from
    // the HTML root element. Set those attributes in your HTML or layout file:
    //   <html data-brand="ionos" data-platform="comfortable" data-color-scheme="light">
    <ThemeProvider>
      <Surface variant="base" asChild>
        <main>
          {/* ----------------------------------------------------------------
              Hero Section — forced dark background via ThemeInverter
          ----------------------------------------------------------------- */}
          <ThemeInverter forceColorScheme="dark">
            <Surface variant="base" asChild>
              <section aria-labelledby="hero-headline">
                <HeroTile
                  backgroundColor="highlight"
                  className="min-h-[480px] px-8 py-10 lg:py-14"
                  text={
                    <div className="flex flex-col gap-5 max-w-2xl">
                      {/* Headline */}
                      <Text asChild variant="heading5xl">
                        <h1 id="hero-headline">
                          Your Online Presence,{' '}
                          <Text className="text-brand">Starts Here.</Text>
                        </h1>
                      </Text>

                      {/* Subline */}
                      <Text asChild variant="bodyLg" className="text-subtle">
                        <p>
                          From blazing-fast web hosting to powerful VPS and memorable
                          domain names — IONOS gives you everything you need to build,
                          grow, and scale your business online.
                        </p>
                      </Text>

                      {/* CTA button */}
                      <div className="pt-2">
                        <Button
                          concept="brand"
                          variant="primary"
                          size="large"
                        >
                          Get Started for Free
                        </Button>
                      </div>
                    </div>
                  }
                />
              </section>
            </Surface>
          </ThemeInverter>

          {/* ----------------------------------------------------------------
              3-Column Feature Card Row
          ----------------------------------------------------------------- */}
          <Surface variant="subtle" asChild>
            <section
              aria-label="Featured products"
              className="px-8 py-10 lg:py-12"
            >
              {/* Section heading */}
              <Text asChild variant="heading3xl" className="mb-7 text-center">
                <h2>Everything You Need to Go Online</h2>
              </Text>

              {/* 3-column grid — collapses to 1 col on mobile */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {FEATURE_CARDS.map((card) => (
                  <FeatureCard key={card.title} {...card} />
                ))}
              </div>
            </section>
          </Surface>
        </main>
      </Surface>
    </ThemeProvider>
  );
}
