# uds-orchestrator

Claude Code plugin for the IONOS Universal Design System (UDS).

## Repository Structure

```
.claude-plugin/plugin.json     — Plugin identity (name, description, author)
.mcp.json                      — Playwright MCP configuration
commands/                      — Slash commands (/uds-setup, /uds-audit, etc.)
skills/
  uds-usage-best-practices/    — Component/token usage skill (SKILL.md + 51 rules)
  uds-project-setup/           — Project scaffolding skill (SKILL.md + 5 rules)
  vercel-react-best-practices/ — React/Next.js perf skill (SKILL.md + AGENTS.md + 51 rules)
```

## Conventions

- **Rule files** go in `skills/{skill-name}/rules/` with kebab-case names
- **Component rules** use prefix `react-` (e.g., `react-button.md`)
- **Token rules** use prefix `core-` (e.g., `core-spacing-tokens.md`)
- **Workflow rules** use prefix `workflow-` (e.g., `workflow-figma-to-code.md`)
- **Setup rules** use prefix `setup-` (e.g., `setup-css-imports.md`)
- **Commands** go in `commands/` with YAML frontmatter (`description`, `allowed-tools`)
- **SKILL.md** files must have YAML frontmatter with `name` and `description`

## Adding a New Component Rule

1. Create `skills/uds-usage-best-practices/rules/react-{component-name}.md`
2. Include: import statement, key props, usage examples, common mistakes
3. Add the component to the quick reference table in `skills/uds-usage-best-practices/SKILL.md` section 4

## Adding a New Command

1. Create `commands/{command-name}.md` with YAML frontmatter
2. Required frontmatter: `description` and `allowed-tools`
3. Document in README.md

## MCP Configuration

- **Playwright MCP**: Declared in `.mcp.json` — uses `npx @playwright/mcp@latest`
- **Figma MCP**: Platform-managed by Claude Code — NOT declared in `.mcp.json`

## Local Testing

```bash
# Launch Claude Code with this plugin loaded from the local directory
claude --plugin-dir .

# Verify:
# 1. /uds-component button — should read rules/react-button.md and summarize
# 2. /uds-audit — should scan project for UDS issues
# 3. Ask "how do I set up UDS with Tailwind v4?" — should trigger uds-project-setup skill
# 4. Ask about React performance — should trigger vercel-react-best-practices skill
# 5. Playwright MCP should appear in available tools

# Use /reload-plugins to pick up file changes without restarting
```

## Release Workflow

Releases are automated via [release-please](https://github.com/googleapis/release-please).

**How it works:**

1. Use [Conventional Commits](https://www.conventionalcommits.org/) in all commit messages:
   - `feat: ...` → MINOR bump (new commands, rules, skills)
   - `fix: ...` → PATCH bump (rule fixes, typos, minor edits)
   - `feat!: ...` or `BREAKING CHANGE:` footer → MAJOR bump (breaking changes)
   - `chore: ...`, `docs: ...`, `refactor: ...` → no version bump
2. Merge to `main` — release-please auto-creates/updates a **Release PR**
3. Review the Release PR (version bump, CHANGELOG, version file changes)
4. Merge the Release PR to trigger the release:
   - Git tag (`vX.Y.Z`) created automatically
   - GitHub Release with changelog published automatically
   - `plugin.json` and `marketplace.json` versions bumped automatically
5. Users update via: `/plugin update uds-orchestrator@ionos-uds`

**Important:** Do NOT manually edit version numbers in `.claude-plugin/plugin.json`
or `.claude-plugin/marketplace.json`. Let release-please handle all version bumps.
