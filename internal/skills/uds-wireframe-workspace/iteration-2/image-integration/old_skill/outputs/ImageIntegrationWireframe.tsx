// Wireframe illustration — not production code
import { ThemeProvider, Surface, Button, Card } from '@ionos-web-design-system/react';

const animationStyle = `
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .animate-enter {
    animation: fadeInUp 0.45s ease-out forwards;
  }
  .animate-enter-delay-1 {
    animation: fadeInUp 0.45s ease-out 0.1s forwards;
    opacity: 0;
  }
  .animate-enter-delay-2 {
    animation: fadeInUp 0.45s ease-out 0.2s forwards;
    opacity: 0;
  }
  .animate-enter-delay-3 {
    animation: fadeInUp 0.45s ease-out 0.3s forwards;
    opacity: 0;
  }
`;

const heroImageSrc = '/Users/boweixiao/Desktop/hero-mockup.png';

const features = [
  {
    icon: '⚡',
    title: 'Blazing-Fast Performance',
    description: 'NVMe SSD storage and a global CDN ensure sub-second load times, no matter where your visitors are.',
  },
  {
    icon: '🔒',
    title: 'Enterprise-Grade Security',
    description: 'Free SSL certificates, DDoS protection, and daily automated backups keep your site safe around the clock.',
  },
  {
    icon: '🌍',
    title: '99.99% Uptime Guarantee',
    description: 'Redundant data centres across Europe and North America mean your website is always available.',
  },
];

export default function ImageIntegrationWireframe() {
  return (
    <ThemeProvider data-brand="ionos">
      <style>{animationStyle}</style>

      {/* ── Hero Section ── */}
      <div className="relative w-full h-[480px] overflow-hidden">
        {/* Hero image fills the top of the page */}
        <img
          src={heroImageSrc}
          alt="IONOS Web Hosting hero mockup"
          className="w-full h-full object-cover"
        />
        {/* Brand overlay for legibility */}
        <div
          className="absolute inset-0 opacity-55"
          style={{ background: 'var(--brand/ionos-blue-800, #003d8f)' }}
        />
        {/* Hero text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-6 text-center animate-enter">
          <h1
            className="text-5xl font-semibold leading-tight"
            style={{ fontFamily: 'Overpass, sans-serif' }}
          >
            Professional Web Hosting
            <br />
            Built for Growth
          </h1>
          <p
            className="mt-4 text-lg opacity-90 max-w-xl"
            style={{ fontFamily: 'Open Sans, sans-serif' }}
          >
            Launch your website in minutes. Reliable, secure, and scalable hosting from IONOS.
          </p>
        </div>
      </div>

      {/* ── 2-Column Layout ── */}
      <Surface>
        <div className="max-w-5xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 gap-12 items-start">

          {/* Left column — Headline + Sign-up form */}
          <div className="animate-enter-delay-1">
            <h2
              className="text-3xl font-semibold mb-3"
              style={{ fontFamily: 'Overpass, sans-serif', color: 'var(--brand/ionos-blue-700, #0050b3)' }}
            >
              Get Started Today
            </h2>
            <p
              className="text-base mb-8 opacity-75"
              style={{ fontFamily: 'Open Sans, sans-serif' }}
            >
              Create your free account and have your site live in under 5 minutes.
            </p>

            <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
              {/* Email field */}
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="email"
                  className="text-sm font-medium"
                  style={{ fontFamily: 'Open Sans, sans-serif' }}
                >
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  className="w-full rounded-md border px-4 py-2.5 text-sm outline-none transition focus:ring-2"
                  style={{
                    borderColor: 'var(--neutral/cool-grey-300, #c8cdd5)',
                    fontFamily: 'Open Sans, sans-serif',
                  }}
                  onChange={() => {}}
                />
              </div>

              {/* Password field */}
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="password"
                  className="text-sm font-medium"
                  style={{ fontFamily: 'Open Sans, sans-serif' }}
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  placeholder="Create a secure password"
                  className="w-full rounded-md border px-4 py-2.5 text-sm outline-none transition focus:ring-2"
                  style={{
                    borderColor: 'var(--neutral/cool-grey-300, #c8cdd5)',
                    fontFamily: 'Open Sans, sans-serif',
                  }}
                  onChange={() => {}}
                />
              </div>

              {/* Submit button */}
              <Button
                variant="primary"
                className="mt-2 w-full transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-md"
                onClick={() => {}}
              >
                Create Free Account
              </Button>

              <p
                className="text-xs text-center opacity-50 mt-1"
                style={{ fontFamily: 'Open Sans, sans-serif' }}
              >
                No credit card required. Cancel anytime.
              </p>
            </form>
          </div>

          {/* Right column — Feature bullet points */}
          <div className="flex flex-col gap-6 animate-enter-delay-2">
            <h2
              className="text-3xl font-semibold mb-1"
              style={{ fontFamily: 'Overpass, sans-serif', color: 'var(--brand/ionos-blue-700, #0050b3)' }}
            >
              Why IONOS Hosting?
            </h2>

            {features.map((feature, i) => (
              <Card
                key={feature.title}
                className="flex items-start gap-4 p-5 transition-transform duration-200 ease-out hover:-translate-y-1 hover:shadow-lg cursor-default"
                style={{
                  animation: 'fadeInUp 0.45s ease-out forwards',
                  animationDelay: `${0.3 + i * 0.1}s`,
                  opacity: 0,
                }}
              >
                {/* Icon */}
                <div
                  className="text-2xl w-10 h-10 flex items-center justify-center rounded-full shrink-0"
                  style={{ background: 'var(--brand/ionos-blue-100, #dce9ff)' }}
                  aria-hidden="true"
                >
                  {feature.icon}
                </div>

                {/* Text */}
                <div>
                  <h3
                    className="text-base font-semibold mb-1"
                    style={{ fontFamily: 'Overpass, sans-serif' }}
                  >
                    {feature.title}
                  </h3>
                  <p
                    className="text-sm opacity-70 leading-relaxed"
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
