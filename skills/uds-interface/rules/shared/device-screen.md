---
styles: [bare-interface]
---

# Device screen

This render becomes the content of a device's screen in a generated photograph (laptop, tablet,
phone, desktop). The canvas IS the screen.

- Fill the canvas edge-to-edge: no device frame, no outer margin, no drop shadow around the UI.
- Match the device: laptop/desktop (1280×800) → full desktop app layout; tablet (1024×768) →
  touch-friendly spacing; phone (390×844) → single-column mobile layout with a bottom or top bar.
- Legible at device scale: body text ≥ 14px, primary actions ≥ 40px tall, strong contrast.
- One clear state: the screen shows the product mid-task (the moment the brief describes), not
  an empty shell and not a marketing page.
