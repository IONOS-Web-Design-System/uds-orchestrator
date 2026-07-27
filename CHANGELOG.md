# Changelog

## [2.15.1](https://github.com/IONOS-Web-Design-System/uds-orchestrator/compare/v2.15.0...v2.15.1) (2026-07-27)


### Bug Fixes

* **uds-wireframe:** scope small-format/screen-content rules so they stop leaking into every bundle ([8089d29](https://github.com/IONOS-Web-Design-System/uds-orchestrator/commit/8089d295f4ece9e84ea26e7bbc2d9a7935c7b81e))


### Documentation

* **uds-wireframe:** repoint two connector-line references that no longer resolve ([99f9a0a](https://github.com/IONOS-Web-Design-System/uds-orchestrator/commit/99f9a0af020b9a92f60f8f685d947dbc89df62bc))
* **uds-wireframe:** split the pop-out rule into a folder; character renders at native aspect ([aa15332](https://github.com/IONOS-Web-Design-System/uds-orchestrator/commit/aa153325b0223083f3955a60e11e9aa39ed6e215))
* **uds-wireframe:** stop teaching a root overflow:hidden for the pop-out character ([4fe6059](https://github.com/IONOS-Web-Design-System/uds-orchestrator/commit/4fe605978f5761992eb5a0b7490c9415a330822a))
* **uds-wireframe:** teach the literal staticFile slug so the character gate can see it ([caf4d0c](https://github.com/IONOS-Web-Design-System/uds-orchestrator/commit/caf4d0ca7fa3faf0732d0a5d1808a0bf8e853449))

## [2.15.0](https://github.com/IONOS-Web-Design-System/uds-orchestrator/compare/v2.14.1...v2.15.0) (2026-07-24)


### Features

* **wireframe:** flexible highlight element anchored bottom-left, off the frame ([1a095c1](https://github.com/IONOS-Web-Design-System/uds-orchestrator/commit/1a095c17f15dcbf529e9f5472dbd951fc284088b))
* **wireframe:** product-pop-out character grounded + lower body behind cards (hide cutout), face-safe kept ([edbe9e2](https://github.com/IONOS-Web-Design-System/uds-orchestrator/commit/edbe9e2d0be2443d8572ca90a4b4d3f84e12d7ea))
* **wireframe:** product-pop-out consumes fixed scaffold; character in front + face-safe ([717e9b5](https://github.com/IONOS-Web-Design-System/uds-orchestrator/commit/717e9b55bfd015653353f11c18a6ab5b42974446))


### Bug Fixes

* **ai-features:** AI badges must use the gradient, never a flat purple fill ([40c3f13](https://github.com/IONOS-Web-Design-System/uds-orchestrator/commit/40c3f13b29fbd08c2c2e50a8f8913c40a9f77272))
* **wireframe:** correct occlusion direction (character tucks behind cards) + align card wording ([253d9ca](https://github.com/IONOS-Web-Design-System/uds-orchestrator/commit/253d9cafc246ea3506ebb1ace19b3662dc184ef4))
* **wireframe:** highlight entrance flies in from the left to match bottom-left placement ([07fd35e](https://github.com/IONOS-Web-Design-System/uds-orchestrator/commit/07fd35e5ae868947fcd054260b791ae56b80300b))
* **wireframe:** keep brand hex out of shared frame-anatomy; reference brand color rule for the dark fallback ([c863ca4](https://github.com/IONOS-Web-Design-System/uds-orchestrator/commit/c863ca44783508ed0b1176d4c9c1a49567dcc121))
* **wireframe:** mandate opaque interface base plate for transparent-root composites ([a95e962](https://github.com/IONOS-Web-Design-System/uds-orchestrator/commit/a95e9627a9bef866d9a8d16bae5f34c8b2c8b7f2))
* **wireframe:** opaque hex-fallback on the highlight surface + name outer-plate scheme hex ([0736ae6](https://github.com/IONOS-Web-Design-System/uds-orchestrator/commit/0736ae6bf6f7f55ebe3536a0591f7735a82f0e8c))

## [2.14.1](https://github.com/IONOS-Web-Design-System/uds-orchestrator/compare/v2.14.0...v2.14.1) (2026-07-23)


### Bug Fixes

* **wireframe:** channel small-format AI gradient to a BADGE (not motif/chrome); surface-theme allows badge ([1c22f8f](https://github.com/IONOS-Web-Design-System/uds-orchestrator/commit/1c22f8f2ec239933895e272782663338dcd6c97a))
* **wireframe:** small-format AI features apply the brand gradient to the motif (no CTA at this scale) ([a73273f](https://github.com/IONOS-Web-Design-System/uds-orchestrator/commit/a73273f712b11dcf94d8785d4711c8a46145a173))
* **wireframe:** spec the AI badge size (~24-32px accent, not hero) ([7bb242e](https://github.com/IONOS-Web-Design-System/uds-orchestrator/commit/7bb242ec2f6bdb04cd1ed545a4e05b4ad00bcfd0))

## [2.14.0](https://github.com/IONOS-Web-Design-System/uds-orchestrator/compare/v2.13.2...v2.14.0) (2026-07-23)


### Features

* **skills:** forbid marketing heading/subheading in generated assets (host renders it) ([c92387e](https://github.com/IONOS-Web-Design-System/uds-orchestrator/commit/c92387e7ca91f891f124312e3f2ba2b2d2441105))
* **uds-wireframe:** add shared screen-content bare-interface render rule (Phase 2b) ([321944f](https://github.com/IONOS-Web-Design-System/uds-orchestrator/commit/321944f7b3bcd125533a466691d5c571b3cbf7ef))
* **uds-wireframe:** bind embedded interface base theme to colorScheme (Phase 2c) ([fc1e660](https://github.com/IONOS-Web-Design-System/uds-orchestrator/commit/fc1e66033f41d37daa3213753fbe7d6c168581cb))
* **uds-wireframe:** scope tags — decorative-mode + animation rules excluded from still composites (Phase 2a) ([f74e7b5](https://github.com/IONOS-Web-Design-System/uds-orchestrator/commit/f74e7b56c39d871067fdd123b792c87265dde6e2))


### Bug Fixes

* **rules:** highlight-card opaque token (C4) + AI base-surface defers to colorScheme (Phase 1) ([b28cc7c](https://github.com/IONOS-Web-Design-System/uds-orchestrator/commit/b28cc7c51db383f4600f873f4ef23112df4e4c01))
* **rules:** purge 'render a headline' instructions; message region = negative space (C2, Phase 1) ([4126307](https://github.com/IONOS-Web-Design-System/uds-orchestrator/commit/4126307111f4674d9082d9a5c808a00ebfe5e9bd))
* **style-guide:** correct brand-font table + surface authoritative brand-overview (Phase 1) ([31f8a9e](https://github.com/IONOS-Web-Design-System/uds-orchestrator/commit/31f8a9e340ae3eb1fff0db6babf252498f16be07))
* **uds-wireframe:** drop card backdropFilter from embed code sample to match opaque canonical (Phase 3b W2 review) ([c984d37](https://github.com/IONOS-Web-Design-System/uds-orchestrator/commit/c984d37a4cf630c8434df4b2c1276bff2d20183b))
* **uds-wireframe:** hardcode AI-gradient hex in ai-animations Remotion template with token-name comment (Phase 3b W1 review) ([d94e1f8](https://github.com/IONOS-Web-Design-System/uds-orchestrator/commit/d94e1f8532d6ece952234937eddd7b4c455e9801))
* **uds-wireframe:** panel glass→surface wording in embed-color-harmony (Phase 3c / 3b Minor) ([33e56c8](https://github.com/IONOS-Web-Design-System/uds-orchestrator/commit/33e56c8bc07ac50067c400e2fcaab1a8da3059c5))
* **uds-wireframe:** reconcile embed-file card chrome to canonical opaque-not-glass rule (Phase 3b W2 review) ([7e29fa3](https://github.com/IONOS-Web-Design-System/uds-orchestrator/commit/7e29fa3962946e0798ec75f9c2941270993f8f4a))
* **uds-wireframe:** remove IONOS brand values from shared frame geometry (Phase 3a review) ([1cf5e91](https://github.com/IONOS-Web-Design-System/uds-orchestrator/commit/1cf5e91eebfb751ee38030c34e205435b37551b7))
* **uds-wireframe:** remove IONOS font-name from shared decorative primitive (Phase 3b W4) ([9d6f44e](https://github.com/IONOS-Web-Design-System/uds-orchestrator/commit/9d6f44e9b2047606ae2e053c45f78b00ffe8ce1a))
* **uds-wireframe:** remove literal brand-string leak from shared decorative primitives (Phase 3a review) ([b58430d](https://github.com/IONOS-Web-Design-System/uds-orchestrator/commit/b58430d2d9d5f9f1f64597eebf607422dec10aef))
* **uds-wireframe:** tokenize residual IONOS hex in shared embed geometry (Phase 3a) ([a166675](https://github.com/IONOS-Web-Design-System/uds-orchestrator/commit/a1666751dd7f507952bc94c8a6875b609f14e828))
* **wireframe:** product-frame shell derives from colorScheme; dark navy gated, not default (C1, Phase 1) ([d17e8a6](https://github.com/IONOS-Web-Design-System/uds-orchestrator/commit/d17e8a659351c52ddc2a95b4f52fac88c63cdee2))
* **wireframe:** replace broken Figma /-path CSS tokens with valid tokens/hex (C3, Phase 1) ([3e91c2f](https://github.com/IONOS-Web-Design-System/uds-orchestrator/commit/3e91c2fc2e13a1010a89914465ac33cd4a17ad6b))
* **wireframe:** reword composition placeholder-content examples — functional labels, not marketing headline (C2 follow-up) ([817480f](https://github.com/IONOS-Web-Design-System/uds-orchestrator/commit/817480fbe7adadbdebdb14df6454f46985a26342))
* **wireframe:** reword floating-card/background-full card slots — no marketing headline (C2 follow-up) ([17f44ac](https://github.com/IONOS-Web-Design-System/uds-orchestrator/commit/17f44ac0ead711d4b0dcb2c9f639996bc0ff9212))


### Code Refactoring

* **uds-wireframe:** AI-gradient/palette hex → tokens + SoT pointers in ionos rules (Phase 3b W1) ([ee093b4](https://github.com/IONOS-Web-Design-System/uds-orchestrator/commit/ee093b4a923eb929f6bb90733e377a7709c928b9))
* **uds-wireframe:** dedup floating-card chrome to shared/floating-card.md + fix shared→ionos pointer (Phase 3b W2) ([5288c8f](https://github.com/IONOS-Web-Design-System/uds-orchestrator/commit/5288c8f29b6325e8f56ea3ab3971cdedfd0b8ac9))
* **uds-wireframe:** dedup text-stability prose to remotion shared-motion-text.md (Phase 3b W3) ([4978042](https://github.com/IONOS-Web-Design-System/uds-orchestrator/commit/497804276462276b3bbbd639b53b653bc3482fbb))
* **uds-wireframe:** migrate rules to rules/shared + rules/ionos folders (Phase 2b) ([43a9489](https://github.com/IONOS-Web-Design-System/uds-orchestrator/commit/43a948955f1bf23a550393bb5c4b2ef03d9f297a))
* **uds-wireframe:** prune codegen-dead HTML-preview/variant-switcher/localhost content (Phase 3c) ([390867e](https://github.com/IONOS-Web-Design-System/uds-orchestrator/commit/390867e99b383ac5e445981f2f283a07a19dcdb1))
* **uds-wireframe:** split decorative-mode primitives into shared/ (Phase 3a) ([3c9668d](https://github.com/IONOS-Web-Design-System/uds-orchestrator/commit/3c9668d19ed941ec7586e39b6122a05742aa9a2d))
* **uds-wireframe:** split embed-contract into per-style scope-tagged files (Phase 3a) ([69e9bce](https://github.com/IONOS-Web-Design-System/uds-orchestrator/commit/69e9bcee993692c8f87b0d43a1f50535f862dde0))
* **uds-wireframe:** split product-frame into ionos color values + shared frame geometry (Phase 3a IONOS-lock) ([237b5a7](https://github.com/IONOS-Web-Design-System/uds-orchestrator/commit/237b5a70e01e26ba41a899f7953b56d14f1459e0))

## [2.13.2](https://github.com/IONOS-Web-Design-System/uds-orchestrator/compare/v2.13.1...v2.13.2) (2026-07-21)


### Bug Fixes

* **uds-wireframe:** drop fabricated var(--color-ai-generating-accent); use concrete accent + pointer ([9052978](https://github.com/IONOS-Web-Design-System/uds-orchestrator/commit/90529788c9d962061aa10cf02170878d4abecca3))


### Documentation

* **asset-moderator:** delete obsolete center-crop rules; align feature-length budget ([5ce76bd](https://github.com/IONOS-Web-Design-System/uds-orchestrator/commit/5ce76bdb3a7bd53e488c54523cc3e1d1398f7a34))
* **asset-moderator:** purge remaining center-crop guidance + align feature-length in sibling rules ([1a7d253](https://github.com/IONOS-Web-Design-System/uds-orchestrator/commit/1a7d2537e19fac865b2bbaf6f1880a6afb83665b))
* **uds-image:** defer photoreal colour temperature to the brand rules (fix warm/cool contradiction) ([24513a3](https://github.com/IONOS-Web-Design-System/uds-orchestrator/commit/24513a356e8ab19283c8ebbd00508dc6fcc4d7d2))
* **uds-image:** ethnicity rule uses explicit Market field first, prose fallback ([07703ff](https://github.com/IONOS-Web-Design-System/uds-orchestrator/commit/07703ffcf50f45002af7121adc0f44f08ec6897a))
* **uds-image:** forbid abstract UI overlays/AI marks in photoreal scenes ([4c72732](https://github.com/IONOS-Web-Design-System/uds-orchestrator/commit/4c72732fd8fd8fe665d5bf8668936ff0b0fc62e9))
* **uds-wireframe:** neutralize brand-coupled prose in shared contract; drop stale gradient hex annotation ([f796ebf](https://github.com/IONOS-Web-Design-System/uds-orchestrator/commit/f796ebf0e4c285d8aedebb0886770ef6778de0da))
* **uds-wireframe:** shared embed-contract (all brands) + author product-pop-out/device-mockup composite styles ([b706c0a](https://github.com/IONOS-Web-Design-System/uds-orchestrator/commit/b706c0a1e53a8c68a10b0d183aa8bf416d467294))

## [2.13.1](https://github.com/IONOS-Web-Design-System/uds-orchestrator/compare/v2.13.0...v2.13.1) (2026-07-17)


### Bug Fixes

* **imagine:** align /imagine with the moderator's unified references[] contract ([fd89066](https://github.com/IONOS-Web-Design-System/uds-orchestrator/commit/fd8906631c874ca33d58d5501a332205dd879907))

## [2.13.0](https://github.com/IONOS-Web-Design-System/uds-orchestrator/compare/v2.12.1...v2.13.0) (2026-07-16)


### Features

* **moderator:** parse structured component briefs, never echo copy into assets ([bb11327](https://github.com/IONOS-Web-Design-System/uds-orchestrator/commit/bb11327662755901baf576a37e892bc24da58304))
* **moderator:** wire brief-parsing rule into SKILL + enrichment hook-ins ([9d5d878](https://github.com/IONOS-Web-Design-System/uds-orchestrator/commit/9d5d8785e9e63da907f29b3d2f9a725130fa0c73))


### Bug Fixes

* **moderator:** reconcile no-echo rule with reframe + hybrid-headline contracts ([00e7119](https://github.com/IONOS-Web-Design-System/uds-orchestrator/commit/00e711978c987b1e35693caf8eee0d4c2cd09d1e))

## [2.12.1](https://github.com/IONOS-Web-Design-System/uds-orchestrator/compare/v2.12.0...v2.12.1) (2026-07-14)


### Bug Fixes

* **imagine:** human-interactive rules use the direct public-cloud moderator API ([957dfe2](https://github.com/IONOS-Web-Design-System/uds-orchestrator/commit/957dfe2ac1d7dc97d4bfdadae5c084b4bb574ebb))

## [2.12.0](https://github.com/IONOS-Web-Design-System/uds-orchestrator/compare/v2.11.0...v2.12.0) (2026-07-10)


### Features

* **imagine:** default token to ~/.claude/settings.json env + setup script ([b44903a](https://github.com/IONOS-Web-Design-System/uds-orchestrator/commit/b44903ad6a1c65e194d5ad6e9e22d1b2634ea4a6))

## [2.11.0](https://github.com/IONOS-Web-Design-System/uds-orchestrator/compare/v2.10.0...v2.11.0) (2026-07-10)


### Features

* **imagine:** default MODERATOR_BASE to the HTTPS sslip.io endpoint ([b896c3c](https://github.com/IONOS-Web-Design-System/uds-orchestrator/commit/b896c3c9ff6157cf54f6710a2ba0dac367e0c0d2))
* **imagine:** submit/rerender/poll direct to moderator with a bearer key ([ac473a3](https://github.com/IONOS-Web-Design-System/uds-orchestrator/commit/ac473a3d3200d380bd3406ee69ad152fdf8450a0))

## [2.10.0](https://github.com/IONOS-Web-Design-System/uds-orchestrator/compare/v2.9.0...v2.10.0) (2026-07-09)


### Features

* **imagine:** make Figma role handling explicit and consistent with the moderator ([9ec917c](https://github.com/IONOS-Web-Design-System/uds-orchestrator/commit/9ec917cf9df50af7020728e0097a2281d50a7079))
* **imagine:** make Figma role handling explicit and consistent with the moderator ([4c655d8](https://github.com/IONOS-Web-Design-System/uds-orchestrator/commit/4c655d808128c4e0bc28c3e7ca74f71e1f4465af))

## [2.9.0](https://github.com/IONOS-Web-Design-System/uds-orchestrator/compare/v2.8.0...v2.9.0) (2026-07-08)


### Features

* **imagine:** emit ordered figmaReferences for multiple Figma links ([339d468](https://github.com/IONOS-Web-Design-System/uds-orchestrator/commit/339d4685136d19aa4559d2705504517f1cc2362b))
* **remotion-skill:** camera-move correctness rule (zoom + pan) ([07b8460](https://github.com/IONOS-Web-Design-System/uds-orchestrator/commit/07b8460a4aecad2f6b4270ed6dfc5c6133cfb01b))


### Documentation

* **imagine:** surface the moderator's figmaUrl reference field ([1b3bd0b](https://github.com/IONOS-Web-Design-System/uds-orchestrator/commit/1b3bd0b2f4c6bde1f1f86a30bae022ccba937612))
* **imagine:** surface the moderator's figmaUrl reference field ([4b664e7](https://github.com/IONOS-Web-Design-System/uds-orchestrator/commit/4b664e74e07c5f52848e56a05e5b5e6fd67e041c))

## [2.8.0](https://github.com/IONOS-Web-Design-System/uds-orchestrator/compare/v2.7.0...v2.8.0) (2026-07-08)


### Features

* **imagine:** submit/rerender via token-free n8n ingress webhooks ([de6b561](https://github.com/IONOS-Web-Design-System/uds-orchestrator/commit/de6b561cc7b74fdc7458d1b17fe88a07a90197ff))
* **imagine:** submit/rerender via token-free n8n ingress webhooks ([2cd711a](https://github.com/IONOS-Web-Design-System/uds-orchestrator/commit/2cd711a85db17838f553c9b751adcdd14efc5439))


### Bug Fixes

* **imagine:** repoint external/VPN path to the moderator directly (n8n removed) ([f58af97](https://github.com/IONOS-Web-Design-System/uds-orchestrator/commit/f58af976d9a38815b1b2f70baf4fc66210162c7c))

## [2.7.0](https://github.com/IONOS-Web-Design-System/uds-orchestrator/compare/v2.6.0...v2.7.0) (2026-07-06)


### Features

* **showroom:** alias MyWebsite → ai-website-builder ([7b64188](https://github.com/IONOS-Web-Design-System/uds-orchestrator/commit/7b64188876dab3255ea73f8653f37b7d947d0a7f))


### Bug Fixes

* **uds-wireframe:** backdrop never darkened (no scrim/overlay; text-shadow or local panel only) + backdrop always static (no zoom/fade/pan/parallax; only floating UI animates) ([d80d2c6](https://github.com/IONOS-Web-Design-System/uds-orchestrator/commit/d80d2c64425828ef5eb44c6f7e16801bac87b0f3))

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
