---
decorative: true
---

# Device Frame Wrapping (Decorative Mode)

Every decorative wireframe is rendered **inside a device frame**. The frame provides the composition anchor and makes elements that float outside it feel intentionally "popped out".

Choose the frame based on context the user describes:
| User says | Frame to use |
|-----------|-------------|
| "mobile", "app", "phone" | Phone frame |
| "desktop", "dashboard", "browser", "website" | Laptop frame |
| "web app", "SaaS tool", "admin panel" | macOS window (default) |
| "Windows app", "enterprise tool" | Windows window |
| No context | macOS window |

## macOS Window Frame
```tsx
const MacWindowFrame = ({ children }: { children: React.ReactNode }) => (
  <div style={{
    borderRadius: 12, overflow: 'hidden',
    boxShadow: '0 0 0 1px rgba(255,255,255,0.07), 0 40px 100px rgba(0,0,0,0.7)',
  }}>
    <div style={{
      height: 40, background: 'rgba(36,36,40,0.98)',
      display: 'flex', alignItems: 'center', padding: '0 14px', gap: 8,
      borderBottom: '1px solid rgba(255,255,255,0.07)', backdropFilter: 'blur(20px)',
    }}>
      {[['#ff5f57','#e0443e'],['#febc2e','#d4a018'],['#28c840','#1aab29']].map(([fill,shadow],i) => (
        <div key={i} style={{ width: 12, height: 12, borderRadius: '50%', background: fill, boxShadow: `inset 0 -1px 0 ${shadow}` }} />
      ))}
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
        <div style={{ width: 120, height: 8, borderRadius: 4, background: 'rgba(255,255,255,0.12)' }} />
      </div>
    </div>
    {children}
  </div>
);
```

## Laptop Frame
```tsx
const LaptopFrame = ({ children, width = 880 }: { children: React.ReactNode; width?: number }) => (
  <div style={{ display: 'inline-block', position: 'relative' }}>
    <div style={{
      width, background: 'linear-gradient(180deg, #323236 0%, #28282c 100%)',
      borderRadius: '14px 14px 0 0', padding: '18px 18px 0',
      boxShadow: '0 0 0 1px rgba(255,255,255,0.07), 0 40px 100px rgba(0,0,0,0.7)',
    }}>
      <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#3e3e42', margin: '0 auto 10px' }} />
      <div style={{ borderRadius: '6px 6px 0 0', overflow: 'hidden' }}>
        {children}
      </div>
    </div>
    {/* Keyboard hinge */}
    <div style={{
      width: width * 1.08, marginLeft: -(width * 0.04), height: 20,
      background: 'linear-gradient(180deg, #3a3a3e 0%, #2a2a2e 100%)',
      borderRadius: '0 0 6px 6px', boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
    }} />
  </div>
);
```

## Phone Frame
```tsx
const PhoneFrame = ({ children, width = 320 }: { children: React.ReactNode; width?: number }) => (
  <div style={{
    width, background: 'linear-gradient(180deg, #2e2e32 0%, #222226 100%)',
    borderRadius: 44, padding: '14px 10px',
    boxShadow: '0 0 0 1px rgba(255,255,255,0.07), inset 0 0 0 1px rgba(0,0,0,0.5), 0 40px 100px rgba(0,0,0,0.7)',
  }}>
    {/* Dynamic island / notch */}
    <div style={{ width: 88, height: 20, background: '#1a1a1e', borderRadius: 10, margin: '0 auto 8px',
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
      <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#2e2e32' }} />
      <div style={{ width: 40, height: 4, borderRadius: 2, background: '#2e2e32' }} />
    </div>
    <div style={{ borderRadius: 28, overflow: 'hidden' }}>{children}</div>
    {/* Home indicator */}
    <div style={{ width: 96, height: 4, background: 'rgba(255,255,255,0.25)', borderRadius: 2, margin: '8px auto 0' }} />
  </div>
);
```

## Windows Window Frame
```tsx
const WindowsFrame = ({ children }: { children: React.ReactNode }) => (
  <div style={{
    borderRadius: '8px 8px 4px 4px', overflow: 'hidden',
    boxShadow: '0 0 0 1px rgba(255,255,255,0.07), 0 32px 80px rgba(0,0,0,0.6)',
  }}>
    <div style={{
      height: 32, background: 'rgba(28,28,32,0.98)',
      display: 'flex', alignItems: 'center', padding: '0 0 0 12px',
      borderBottom: '1px solid rgba(255,255,255,0.06)',
    }}>
      <div style={{ width: 96, height: 7, borderRadius: 3, background: 'rgba(255,255,255,0.20)' }} />
      <div style={{ marginLeft: 'auto', display: 'flex' }}>
        {/* Windows control icons — use system icons, never emoji */}
        {[
          { name: 'minus', close: false },
          { name: 'crop-square', close: false },
          { name: 'x', close: true },
        ].map(({ name, close }, i) => (
          <div key={i} style={{ width: 46, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon group="system" name={name} size={12} style={{ color: 'rgba(255,255,255,0.65)' }} />
          </div>
        ))}
      </div>
    </div>
    {children}
  </div>
);
```
