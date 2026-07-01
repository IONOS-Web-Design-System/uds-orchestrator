# Changelog

## [2.6.0](https://github.com/IONOS-Web-Design-System/uds-orchestrator/compare/v2.5.2...v2.6.0) (2026-07-01)


### Features

* **uds-showroom:** catalog frontmatter (displayName/category/aiTier/aliases) ([cf1cdc3](https://github.com/IONOS-Web-Design-System/uds-orchestrator/commit/cf1cdc367f49e52be5d163d2e4a43e46c8df9681))
* **uds-showroom:** seed ionos catalog — 16 AI personas + non-AI stubs ([43d164b](https://github.com/IONOS-Web-Design-System/uds-orchestrator/commit/43d164b49cfdf9399132166c787001ce81c49e6b))

## [2.5.2](https://github.com/IONOS-Web-Design-System/uds-orchestrator/compare/v2.5.1...v2.5.2) (2026-07-01)


### Bug Fixes

* **module:** add module field in imagine payload ([0f017ea](https://github.com/IONOS-Web-Design-System/uds-orchestrator/commit/0f017ead51b58199d5c9530c104033449f8577e1))

## [2.5.1](https://github.com/IONOS-Web-Design-System/uds-orchestrator/compare/v2.5.0...v2.5.1) (2026-07-01)


### Bug Fixes

* **imagine:** retire job polling via n8n broker ([9b5d85d](https://github.com/IONOS-Web-Design-System/uds-orchestrator/commit/9b5d85d5b69df65bd9213bff7736ec6dd0bf8b4e))

## [2.5.0](https://github.com/IONOS-Web-Design-System/uds-orchestrator/compare/v2.4.1...v2.5.0) (2026-06-29)


### Features

* **skills:** character-appearance reasoning + image-type & brand-style refinements ([50a67cd](https://github.com/IONOS-Web-Design-System/uds-orchestrator/commit/50a67cdc919d4edec2df70d9013dbc6d2539544f))
* **uds-asset-moderator:** reframe mis-scoped low-info requests into content cards ([1da6b7c](https://github.com/IONOS-Web-Design-System/uds-orchestrator/commit/1da6b7c86c86c0917507fdbee5517a1783d4d986))
* **uds-showroom:** persona skill + ionos/ai-app-builder DJ persona ([7211ac4](https://github.com/IONOS-Web-Design-System/uds-orchestrator/commit/7211ac4983b974a391aad3d4c5b1c617d85ed2f5))


### Bug Fixes

* **image-skills:** retire obsolete crop-safety rules (center-crop removed in image-svc) ([2b6c844](https://github.com/IONOS-Web-Design-System/uds-orchestrator/commit/2b6c8448336e027c11af411f56c5265a855502a4))

## [2.4.1](https://github.com/IONOS-Web-Design-System/uds-orchestrator/compare/v2.4.0...v2.4.1) (2026-06-24)


### Miscellaneous

* **image:** audit image skills, setup the clear image types and remove the contradicts rules ([5ca9c7f](https://github.com/IONOS-Web-Design-System/uds-orchestrator/commit/5ca9c7fa72acbd5c6a23b9b8a1d2204057ce1862))

## [2.4.0](https://github.com/IONOS-Web-Design-System/uds-orchestrator/compare/v2.3.0...v2.4.0) (2026-06-24)


### Features

* **asset-moderator:** rubric — illustration intent defaults to still, animation needs a quoted motion cue ([9d171e2](https://github.com/IONOS-Web-Design-System/uds-orchestrator/commit/9d171e2376244f10c142fc445dd82332420a4fab))
* **imagine:** add composition-pattern inference step to human-interactive flow ([55373a8](https://github.com/IONOS-Web-Design-System/uds-orchestrator/commit/55373a874d628e41ae3e68114a089471c79dedf7))
* **imagine:** dedicated still-or-animated round + what-motion follow-up ([176df7a](https://github.com/IONOS-Web-Design-System/uds-orchestrator/commit/176df7abb6676f0882a8ffccede1baeb9eed9091))
* **moderator:** encode composition pattern name in illustration feature text ([ffd31c3](https://github.com/IONOS-Web-Design-System/uds-orchestrator/commit/ffd31c3c10868eab04330d3f688ad5d2e2941bfd))
* **uds-asset-moderator:** preserve explicit device-frame intent in enrichment ([5432279](https://github.com/IONOS-Web-Design-System/uds-orchestrator/commit/5432279a48b73142df918b11bb85d8f109cad578))
* **wireframe:** add connector-line pattern + consolidate panel chrome rules ([73077b6](https://github.com/IONOS-Web-Design-System/uds-orchestrator/commit/73077b6d2aa67bf0ab3aa756bad1e3329e731878))


### Bug Fixes

* **imagine:** correct indentation and blank-line in composition-pattern block ([a5fe0a3](https://github.com/IONOS-Web-Design-System/uds-orchestrator/commit/a5fe0a35d154433f187262b301ca67b93ef7d546))
* **imagine:** harden brief format check for lower model like haiku ([35f80a8](https://github.com/IONOS-Web-Design-System/uds-orchestrator/commit/35f80a87bdfdafbfbf5fd8724b7cd8f9ccc25231))
* **remotion-best-practices:** zero-width typing cursor to stop trailing-word reflow ([1c66a0e](https://github.com/IONOS-Web-Design-System/uds-orchestrator/commit/1c66a0e5e3dbbeadd25d2424e019aaa38c679b7f))
* **skills:** resolve AI-template/affordance rule conflicts (per IONOS-team decisions) ([8d542ee](https://github.com/IONOS-Web-Design-System/uds-orchestrator/commit/8d542eeb6c6b3181617ce83782fa533ed48b5427))
* **wireframe:** add image-backdrop and small-format to rules index + pattern routing ([735f73a](https://github.com/IONOS-Web-Design-System/uds-orchestrator/commit/735f73afb739a4c3ec45740926bca2caf6353bcb))
* **wireframe:** align AIFloatingHighlight shadow to 0.35 (matches product-frame.md) ([bd0a957](https://github.com/IONOS-Web-Design-System/uds-orchestrator/commit/bd0a957abf3a4579ad263c0a87f916a1537f01ec))


### Documentation

* **imagine:** ask still-or-animated before the loop follow-up (match human-interactive order) ([f4b0705](https://github.com/IONOS-Web-Design-System/uds-orchestrator/commit/f4b07050105d641190f5137dbfa10ce33d8f2757))
* **skills:** document the floating-card embed style (Figma 82:202 / 162:306) ([70378a1](https://github.com/IONOS-Web-Design-System/uds-orchestrator/commit/70378a17989a204090fac2cc720b165e031949ea))

## [2.3.0](https://github.com/IONOS-Web-Design-System/uds-orchestrator/compare/v2.2.1...v2.3.0) (2026-06-17)


### Features

* **imagine:** graceful sandbox handoff + accept pasted briefs ([e3713c8](https://github.com/IONOS-Web-Design-System/uds-orchestrator/commit/e3713c8a34b70429865c8bf001b1c97325eaa0c8))
* **imagine:** post-result multi-language re-render flow ([932cb52](https://github.com/IONOS-Web-Design-System/uds-orchestrator/commit/932cb52d7879adf4e68c3083e1f72bf8f90e2b1d))
* **imagine:** proactive 3-way post-process menu; images regenerate (no re-render) ([054f7f2](https://github.com/IONOS-Web-Design-System/uds-orchestrator/commit/054f7f2e571394e6f07d9506fcb7b598d99b6d76))


### Bug Fixes

* **imagine:** wire moderation-principles rule, correct durationSec range, complete brief assembly ([9693c32](https://github.com/IONOS-Web-Design-System/uds-orchestrator/commit/9693c32aff1e6326bc173a133260deeeeb5507fd))

## [2.2.1](https://github.com/IONOS-Web-Design-System/uds-orchestrator/compare/v2.2.0...v2.2.1) (2026-06-17)


### Bug Fixes

* **imagine:** submit flat UnifiedBrief to imagine-trigger (no payload wrapper); add local/cowork run guard ([af0fd14](https://github.com/IONOS-Web-Design-System/uds-orchestrator/commit/af0fd14780b8de78882143791394dd56a2ec2aa0))

## [2.2.0](https://github.com/IONOS-Web-Design-System/uds-orchestrator/compare/v2.1.0...v2.2.0) (2026-06-17)


### Features

* **imagine:** token-free external path via unauthenticated imagine-* bridge ([0770e4a](https://github.com/IONOS-Web-Design-System/uds-orchestrator/commit/0770e4ac627c51b9643d64538be01bee4be9a7f0))


### Documentation

* **imagine:** align human-interactive submit notes with token-free bridge ([2008ef6](https://github.com/IONOS-Web-Design-System/uds-orchestrator/commit/2008ef6b4ac57f13d2af18c620833b397b614754))

## [2.1.0](https://github.com/IONOS-Web-Design-System/uds-orchestrator/compare/v2.0.2...v2.1.0) (2026-06-16)


### Features

* **imagine:** external API submission via n8n moderator-trigger + first-time setup guide ([fc29df0](https://github.com/IONOS-Web-Design-System/uds-orchestrator/commit/fc29df01880775cbcfdaece3fe95146b17c81062))

## [2.0.2](https://github.com/IONOS-Web-Design-System/uds-orchestrator/compare/v2.0.1...v2.0.2) (2026-06-16)


### Documentation

* **skills:** image-generation look refinements + module-specific generation bias ([003244b](https://github.com/IONOS-Web-Design-System/uds-orchestrator/commit/003244be904abb568d04ee0b679dd76b8d1ae818))
* **skills:** refine /imagine prompt layer + image-generation guidance ([1dd7a1f](https://github.com/IONOS-Web-Design-System/uds-orchestrator/commit/1dd7a1f820bbadf0264a863e45a0cce9a86e78e0))

## [2.0.1](https://github.com/IONOS-Web-Design-System/uds-orchestrator/compare/v2.0.0...v2.0.1) (2026-06-15)


### Documentation

* **skills:** pending skill working-tree edits ([79820ab](https://github.com/IONOS-Web-Design-System/uds-orchestrator/commit/79820ab55abc5fb9b710b6292a06101d38ada81e))
* **skills:** text-stability, color-token, and small-format guidance hardening ([62a9012](https://github.com/IONOS-Web-Design-System/uds-orchestrator/commit/62a9012f9a6946c484bc19ec428ac27dd080b30a))

## [2.0.0](https://github.com/IONOS-Web-Design-System/uds-orchestrator/compare/v1.9.0...v2.0.0) (2026-06-12)


### ⚠ BREAKING CHANGES

* **skills:** image-backdrop hybrid composition — pointer + full-bleed styles replace screen embed

### Features

* **imagine:** human interactive layer for prompt engineering ([3dc9129](https://github.com/IONOS-Web-Design-System/uds-orchestrator/commit/3dc91293e8f5b4a2c937d447daf313219639b954))
* **skills:** color-harmony supervision — backdrop rule derives root gradient from measured imagery tones ([3ead27b](https://github.com/IONOS-Web-Design-System/uds-orchestrator/commit/3ead27b5162e807cf1f7fb4eafda0ecc8c8fa2c1))
* **skills:** dimension-aware hybrid styles — interface-asset, backdrop crop + Ken Burns motion ([d43efe1](https://github.com/IONOS-Web-Design-System/uds-orchestrator/commit/d43efe10714defddb5fb414b87e786e082e75d58))
* **skills:** image-backdrop hybrid composition — pointer + full-bleed styles replace screen embed ([dc13f3f](https://github.com/IONOS-Web-Design-System/uds-orchestrator/commit/dc13f3f541d68224f986dac86788f75da14dc794))
* **skills:** punch-through screen embed + floating-panel style for hybrid ([8024a88](https://github.com/IONOS-Web-Design-System/uds-orchestrator/commit/8024a883193992e026a4ef78903ffb188a4e98f1))
* **uds-wireframe:** one-frame rule — scene wrapper carries imagery + in-frame typography through backdrop motion; annotations draw in after settle ([c65264b](https://github.com/IONOS-Web-Design-System/uds-orchestrator/commit/c65264ba94d9df722095934d68c2270439c85768))
* **uds-wireframe:** purposed backdrop motion — highlight zoom (transformOrigin-tied), entrance fade+move, interaction response; idle Ken Burns banned ([460947e](https://github.com/IONOS-Web-Design-System/uds-orchestrator/commit/460947e21e7f51f566d1ab0966bc985a90b3747d))


### Bug Fixes

* **uds-wireframe:** backdrop connector is always axis-aligned — div-based flat runs or L-elbow, slanted lines disallowed ([7425020](https://github.com/IONOS-Web-Design-System/uds-orchestrator/commit/7425020d1766f37385201e703ca436595d1aee11))
* **uds-wireframe:** strict-TS-safe quadToMatrix3d — 4-tuple param survives noUncheckedIndexedAccess gate ([0e177c2](https://github.com/IONOS-Web-Design-System/uds-orchestrator/commit/0e177c299e0e3b66c3ba8eb4553d2ad38aef7a16))

## [1.9.0](https://github.com/IONOS-Web-Design-System/uds-orchestrator/compare/v1.8.0...v1.9.0) (2026-06-11)


### Features

* **illustration:** improve illustration skills ([bf4504f](https://github.com/IONOS-Web-Design-System/uds-orchestrator/commit/bf4504ff14cd6c95ebad618f4cae6dedb6a01568))
* **illustration:** improve illustration skills ([d1a0002](https://github.com/IONOS-Web-Design-System/uds-orchestrator/commit/d1a00024f01451d25dea196c20a14b59f6ef5b3f))
* uds-asset-moderator skill — mode rubric, shared context, hybrid decomposition ([3996ec8](https://github.com/IONOS-Web-Design-System/uds-orchestrator/commit/3996ec8946d3388b8c5b5ce935a71c4e90113e99))
* **uds-image:** human-focused image types — face-visibility priority ladder, type rules, diversity + environment guidance, evals ([f7a4a8b](https://github.com/IONOS-Web-Design-System/uds-orchestrator/commit/f7a4a8b6f1b3a2ad043c2e25f7f94e996e08418f))
* **uds-wireframe:** rule for embedding animated UI into a generated image's screen quad ([e95b7df](https://github.com/IONOS-Web-Design-System/uds-orchestrator/commit/e95b7df560c9b34a3a62caf046dba1fd38aa8eb7))

## [1.8.0](https://github.com/IONOS-Web-Design-System/uds-orchestrator/compare/v1.7.1...v1.8.0) (2026-06-10)


### Features

* **uds-image:** brand-aware image-generation skill ([8562626](https://github.com/IONOS-Web-Design-System/uds-orchestrator/commit/8562626035e58821f4ac697b1db36f711eac7a31))
* **uds-image:** minimal skill stub for image-svc craft step ([dca263c](https://github.com/IONOS-Web-Design-System/uds-orchestrator/commit/dca263c3fb018bdf73f2cb041cd21a9f5085b8b8))
* **uds-image:** shared + per-brand image rules (ionos photoreal/cutout + 7 brands) ([88bdd77](https://github.com/IONOS-Web-Design-System/uds-orchestrator/commit/88bdd770edb1644f19dcd8e839b72a8d7a638af4))

## [1.7.1](https://github.com/IONOS-Web-Design-System/uds-orchestrator/compare/v1.7.0...v1.7.1) (2026-06-04)


### Miscellaneous

* **animation:** polish frame and typo animations ([58f2503](https://github.com/IONOS-Web-Design-System/uds-orchestrator/commit/58f250322b9cc30bac54d03877881a76df4f015a))

## [1.7.0](https://github.com/IONOS-Web-Design-System/uds-orchestrator/compare/v1.6.0...v1.7.0) (2026-06-04)


### Features

* **illustration:** cluster to ionos brand specific rules ([260adfe](https://github.com/IONOS-Web-Design-System/uds-orchestrator/commit/260adfeb88aaaf2f2518bbbb8cbcb86e6204176e))

## [1.6.0](https://github.com/IONOS-Web-Design-System/uds-orchestrator/compare/v1.5.1...v1.6.0) (2026-06-02)


### Features

* **illustration:** ai specific color definition ([53a85b2](https://github.com/IONOS-Web-Design-System/uds-orchestrator/commit/53a85b251bed85fe083387a6faa04b1b3cb07631))


### Bug Fixes

* **ci:** sync-sideload targets coreinstaller@VM and ~/pipeline/uds-orchestrator ([e36b4fb](https://github.com/IONOS-Web-Design-System/uds-orchestrator/commit/e36b4fb02b13da79b006c50947663979d6b914d6))


### Miscellaneous

* **illustration:** new ionos specific ai setting ([c5e4b86](https://github.com/IONOS-Web-Design-System/uds-orchestrator/commit/c5e4b863e7c52f5abce23d65e879154acaf693f9))

## [1.5.1](https://github.com/IONOS-Web-Design-System/uds-orchestrator/compare/v1.5.0...v1.5.1) (2026-05-29)


### Bug Fixes

* **skills:** correct four audit findings across illustration + react skills ([29d5b89](https://github.com/IONOS-Web-Design-System/uds-orchestrator/commit/29d5b899ab6797d823eb7408431af60bb6242b1e))

## [1.5.0](https://github.com/IONOS-Web-Design-System/uds-orchestrator/compare/v1.4.0...v1.5.0) (2026-05-29)


### Features

* **skills:** add illustration pipeline + remotion skills; move wireframe-workspace to internal ([5b8212b](https://github.com/IONOS-Web-Design-System/uds-orchestrator/commit/5b8212bfd4d454d1af143e4f314d3142d1c42e93))

## [1.4.0](https://github.com/IONOS-Web-Design-System/uds-orchestrator/compare/v1.3.0...v1.4.0) (2026-05-19)


### Features

* **skills:** sync from UDS — May 2026 component changes ([ed03cf6](https://github.com/IONOS-Web-Design-System/uds-orchestrator/commit/ed03cf6e8b9e3a88c525d0c7e6dd406e2dbe7061))

## [1.3.0] - 2026-04-23

### Features
- Full input elements and navigation rules
- Optimized skill entry file and new rules
- Automated release workflow

### Bug Fixes
- Use PAT to resolve CI permission issue
