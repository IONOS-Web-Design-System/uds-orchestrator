import React from "react";
import {
  ThemeProvider,
  Surface,
  Text,
  TextInput,
  Button,
} from "@ionos-web-design-system/components";

// Feature bullet point data
const features = [
  {
    icon: "⚡",
    title: "Blazing Fast Performance",
    description: "99.9% uptime guarantee with SSD-powered servers.",
  },
  {
    icon: "🔒",
    title: "Secure by Default",
    description: "Free SSL certificate and daily backups included.",
  },
  {
    icon: "🛠️",
    title: "Easy Management",
    description: "One-click WordPress install and intuitive control panel.",
  },
];

const ImageIntegrationWireframe: React.FC = () => {
  return (
    <ThemeProvider brand="ionos" platform="web" colorScheme="light">
      <Surface>
        {/* Hero Image — fills top of page */}
        <div
          style={{
            width: "100%",
            maxHeight: "480px",
            overflow: "hidden",
            position: "relative",
          }}
        >
          <img
            src="/Users/boweixiao/Desktop/hero-mockup.png"
            alt="IONOS Web Hosting Hero"
            style={{
              width: "100%",
              height: "480px",
              objectFit: "cover",
              display: "block",
            }}
          />
        </div>

        {/* 2-Column Layout below hero */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "48px",
            padding: "48px 64px",
            maxWidth: "1200px",
            margin: "0 auto",
          }}
        >
          {/* Left Column — Headline + Sign-up Form */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "24px",
            }}
          >
            <Text variant="headline-l" as="h1">
              Start Your Online Journey with IONOS
            </Text>
            <Text variant="body-m" color="secondary">
              Reliable web hosting trusted by millions of websites worldwide.
              Get started today.
            </Text>

            {/* Sign-up Form */}
            <form
              onSubmit={(e) => e.preventDefault()}
              style={{ display: "flex", flexDirection: "column", gap: "16px" }}
            >
              <TextInput
                label="Email Address"
                type="email"
                placeholder="you@example.com"
                name="email"
              />
              <TextInput
                label="Password"
                type="password"
                placeholder="Create a password"
                name="password"
              />
              <Button variant="primary" type="submit" fullWidth>
                Create Free Account
              </Button>
            </form>
          </div>

          {/* Right Column — Feature Bullet Points */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "32px",
              justifyContent: "center",
            }}
          >
            {features.map((feature, index) => (
              <div
                key={index}
                style={{ display: "flex", alignItems: "flex-start", gap: "16px" }}
              >
                {/* Icon placeholder */}
                <div
                  style={{
                    fontSize: "28px",
                    lineHeight: 1,
                    flexShrink: 0,
                    marginTop: "2px",
                  }}
                  aria-hidden="true"
                >
                  {feature.icon}
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                  <Text variant="headline-xs" as="h3">
                    {feature.title}
                  </Text>
                  <Text variant="body-s" color="secondary">
                    {feature.description}
                  </Text>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Surface>
    </ThemeProvider>
  );
};

export default ImageIntegrationWireframe;
