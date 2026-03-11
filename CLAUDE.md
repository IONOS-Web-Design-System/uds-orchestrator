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

1. Bump `version` in `.claude-plugin/plugin.json` AND `.claude-plugin/marketplace.json`
2. Commit and push to `main`
3. Tag the release: `git tag v1.0.0 && git push --tags`
4. Users update via: `/plugin update uds-orchestrator@ionos-uds`

**Version bumping rules (semver):**
- PATCH (1.0.x): Rule file updates, typo fixes, minor SKILL.md edits
- MINOR (1.x.0): New commands, new rule files, new skills
- MAJOR (x.0.0): Breaking changes to command arguments or skill structure
