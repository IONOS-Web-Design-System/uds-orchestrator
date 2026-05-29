// Wireframe illustration — not production code
import { ThemeProvider, Surface, Button, Card } from '@ionos-web-design-system/react';

const animationStyle = `
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .hero-enter {
    animation: fadeInUp 0.5s ease-out forwards;
  }
  @keyframes fadeInUp-card {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: translateY(0); }
  }
`;

const features = [
  {
    title: 'Web Hosting',
    icon: '🌐',
    description:
      'Fast, reliable hosting for your website. SSD storage, free SSL, and one-click WordPress install included.',
    cta: 'See Web Hosting Plans',
  },
  {
    title: 'VPS',
    icon: '🖥️',
    description:
      'Dedicated virtual resources that scale with your project. Root access, hourly billing, full control.',
    cta: 'Explore VPS',
  },
  {
    title: 'Domains',
    icon: '🔗',
    description:
      'Register your perfect domain name from over 500 extensions. Free WHOIS protection included.',
    cta: 'Find Your Domain',
  },
];

export default function HeroFeatureGridWireframe() {
  return (
    <ThemeProvider brand="ionos">
      <style>{animationStyle}</style>

      {/* Hero Section — dark background */}
      <Surface
        data-color-scheme="dark"
        className="w-full min-h-[480px] flex flex-col items-center justify-center px-6 py-20 text-center"
        style={{ background: 'var(--brand/ionos-blue-900, #003d8f)' }}
      >
        <div className="hero-enter max-w-2xl mx-auto flex flex-col items-center gap-6">
          {/* Headline */}
          <h1
            className="text-5xl font-semibold leading-tight"
            style={{
              fontFamily: 'Overpass, sans-serif',
              color: '#ffffff',
            }}
          >
            Everything Your Business Needs Online
          </h1>

          {/* Subline */}
          <p
            className="text-xl opacity-80"
            style={{
              fontFamily: 'Open Sans, sans-serif',
              color: '#ffffff',
            }}
          >
            Web hosting, VPS, and domains — all in one place. Start building
            today with IONOS.
          </p>

          {/* CTA Button */}
          <Button
            variant="primary"
            size="large"
            onClick={() => {}}
            className="mt-2"
          >
            Get Started
          </Button>
        </div>
      </Surface>

      {/* Feature Card Row — 3 columns */}
      <Surface
        className="w-full px-6 py-16"
        style={{ background: 'var(--background/neutral, #f5f6f7)' }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <Card
                key={feature.title}
                className="flex flex-col gap-4 p-6 cursor-pointer transition-transform duration-200 ease-out hover:-translate-y-1 hover:shadow-lg"
                style={{
                  animation: 'fadeInUp-card 0.35s ease-out forwards',
                  animationDelay: `${i * 80}ms`,
                  opacity: 0,
                }}
              >
                {/* Icon placeholder */}
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
                  style={{ background: 'var(--brand/ionos-blue-100, #dce9ff)' }}
                >
                  {feature.icon}
                </div>

                {/* Title */}
                <h3
                  className="text-xl font-semibold"
                  style={{ fontFamily: 'Overpass, sans-serif' }}
                >
                  {feature.title}
                </h3>

                {/* Description */}
                <p
                  className="text-sm opacity-70 flex-1"
                  style={{ fontFamily: 'Open Sans, sans-serif' }}
                >
                  {feature.description}
                </p>

                {/* Secondary CTA */}
                <Button
                  variant="secondary"
                  size="small"
                  onClick={() => {}}
                  className="self-start mt-2"
                >
                  {feature.cta}
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </Surface>
    </ThemeProvider>
  );
}
