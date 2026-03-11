# uds-orchestrator

Claude Code plugin for the IONOS Universal Design System (UDS). Orchestrates the full UDS development workflow: project setup, component/token best practices, Figma-to-code translation, and browser-based verification.

## Installation

**Option A: Via marketplace (recommended for teams)**

```
# Inside Claude Code, run:
/plugin marketplace add IONOS-Web-Design-System/uds-orchestrator

# Then install the plugin:
/plugin install uds-orchestrator@ionos-uds
```

Installation scopes:
- Default (`user`): Available in all your projects (`~/.claude/settings.json`)
- `--scope project`: Shared with team via version control (`.claude/settings.json`)
- `--scope local`: This machine only (`.claude/settings.local.json`)

For team-wide adoption, use `--scope project` so every collaborator gets the plugin automatically.

**Option B: Direct install from GitHub**

```
/plugin install uds-orchestrator@IONOS-Web-Design-System/uds-orchestrator
```

**Updating:**

```
/plugin update uds-orchestrator@ionos-uds
```

## Local Development & Testing

```bash
# Clone the repo
git clone git@github.com:IONOS-Web-Design-System/uds-orchestrator.git
cd uds-orchestrator

# Test the plugin in a Claude Code session (loads for that session only)
claude --plugin-dir .

# Or from another project directory:
claude --plugin-dir /path/to/uds-orchestrator

# Inside the Claude Code session, verify:
# - Skills appear: ask about UDS components / project setup / React performance
# - Commands work: /uds-component button, /uds-audit, etc.
# - MCP loads: Playwright MCP should be available

# To pick up changes without restarting:
/reload-plugins
```

## Commands

| Command | Description |
| --- | --- |
| `/uds-setup <brand> [platform]` | Scaffold a new project with UDS + Tailwind CSS v4 |
| `/uds-audit` | Audit an existing project for UDS configuration issues |
| `/uds-figma-build <figma-url>` | Build UDS React code from a Figma design URL |
| `/uds-verify <figma-url>` | Verify implementation against a Figma design |
| `/uds-component <name>` | Quick component reference lookup |

### Examples

```
/uds-setup ionos comfortable
/uds-audit
/uds-figma-build https://figma.com/design/ABC123/MyDesign?node-id=1-2
/uds-verify https://figma.com/design/ABC123/MyDesign?node-id=1-2
/uds-component button
```

## Skills

The plugin includes three skills that activate automatically based on context:

### uds-usage-best-practices

Comprehensive reference for building UIs with UDS components and tokens. Activates when you're working with UDS components, design tokens, Figma-to-code translation, or anything involving `@ionos-web-design-system`.

- 30+ React component rule files
- Token quick reference (spacing, colors, borders, typography)
- Figma-to-code workflow with asset decision tree
- Post-build verification checklist

### uds-project-setup

Project scaffolding and configuration. Activates when setting up a new UDS project, configuring CSS/Tailwind, or troubleshooting missing styles.

- CSS import order rules
- Brand-to-font mapping
- Tailwind v4 verification checklist
- Audit workflow for existing projects
- Common setup failure troubleshooting

### vercel-react-best-practices

React and Next.js performance optimization guidelines from Vercel Engineering. Activates when writing, reviewing, or refactoring React/Next.js code for performance.

- 51 rules across 8 priority categories
- Covers: waterfalls, bundle size, server/client performance, re-renders, rendering

## MCP Setup

### Figma MCP

The Figma MCP is **platform-managed** by Claude Code. No configuration needed in this plugin — it's available automatically when connected.

To authenticate:
1. Claude Code will prompt for Figma authentication on first use
2. Grant access to the Figma files you want to work with
3. If auth expires, re-authenticate via Claude Code's MCP settings

### Playwright MCP

Configured in this plugin's `.mcp.json`. Used for browser-based verification.

Requirements:
- Node.js installed (for `npx` execution)
- Your app must be running locally (`npm run dev`)

## Supported Brands

| Brand | CSS Import Key |
| --- | --- |
| IONOS | `ionos` |
| STRATO | `strato` |
| Fasthosts | `fasthosts` |
| home.pl | `homepl` |
| Strefa | `strefa` |
| UDAG | `udag` |
| World4You | `world4you` |
| Arsys | `arsys` |

## License

Apache 2.0 — see [LICENSE](LICENSE).
