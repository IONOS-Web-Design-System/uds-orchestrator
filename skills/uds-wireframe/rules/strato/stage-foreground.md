---
styles: [strato-stage-pair]
---

# STRATO stage — foreground types and background kinds

## 1. When it applies

Only the STRATO corporate stage's pair: the abstract app frame behind the person and the highlight in front of them. The brief names the foreground's type ("Foreground type: …") and the frame's kind ("Background kind: …"). Draw exactly that type and kind; never mix two types.

The foreground highlights the product's KEY MOMENT, named in the brief's "Key moment" line: the foreground is built from exactly those objects, so no two products share a card. The type gives the composition, the key moment gives the objects. A product without a key moment has none: "Foreground type: none" means the foreground stays EMPTY (`foreground={null}`), and "Background kind: none" means the background stays empty (`background={null}`). An empty layer is a complete answer, never a gap to fill.

## 2. Every foreground

- Chat, reaction and connector draw a card, `<StageCard ai={…}>`: it hugs its content and clips anything beyond, so everything sits inside it. Icons draw NO card: the tiles float (3.1).
- It is built from the key moment's objects, at most four of one kind, aligned on one grid. Two products of one type still differ: their objects, glyphs and their order come from their own key moments.
- The AI mark appears once, and the type decides where: on an icons or chat card the objects ARE the mark (gradient tiles, the assistant's gradient bubble) and there is no `<StageBadge>`; a reaction or connector card carries its one `<StageBadge>`. A non-AI product uses the primary blue instead of the AI gradient (`StageTile ai={false}`, `stageAccentFill(false)`), and its badge is `<StageBadge ai={false} glyph={…}>`.
- A headline is optional, at most four words, in `<StageText>`, and only where the type below allows it. Every other text is a skeleton bar, except labels the brief gives verbatim.
- A glyph from `@ionos-web-design-system/icon` is passed as its `svgData` string (`glyph={svgData}`); a supplied catalog logo is an `<Img>` at full colour.
- Motion is subtle and tiny: frame 0 already holds the final layout; only the accent the type names moves; nothing travels, resizes, morphs, bounces or overshoots; no cursor, click, press or typing.

## 3. The four types

### 3.1 icons — icon-only (example: Marketing Suite)

When: a complex context that refers to several products, channels or processes at once — a suite, listings across Google, Maps and directories, an all-in-one plan.

Picture: NO card and no glass container. Two to four floating `<StageTile glow>` tiles stacked in ONE column at the foreground slot's left edge, so the column hangs over the app frame's left edge as if attached to it (a small stagger of the middle tile is allowed). Each tile holds exactly ONE white glyph that names a channel, product or discipline of the key moment:
- a platform is its UDS social icon: `import { svgData as googleSvg } from '@ionos-web-design-system/icon/social/google'` (also `social/instagram`, `social/facebook`, `social/linkedin`, `social/wordpress`, `social/youtube`);
- a discipline is a UDS system icon: `system/filled-star` for reviews, `system/filled-chat` for messages and posts, `system/filled-location` for listings, `system/filled-search` for search, `system/filled-globe` for a website, `system/filled-lock` for security;
- `<StageTile ai glow glyph={googleSvg} size={…}>` for an AI product (AI gradient, white glyph, its own glow), `<StageTile ai={false} glow …>` otherwise (primary blue); a size of about a quarter of the slot width.

The foreground is just the column: `<div style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap }}>` with the tiles. A supplied catalog logo is full colour and belongs in the frame, never on a tile; a tile never holds two glyphs, or a glyph next to a logo. No card, no headline, no bars and no `<StageBadge>`: the tiles are the mark.

Motion: the tiles fade in one after another, top to bottom (about 120 ms apart, at most a 6 px rise), then hold.

### 3.2 chat — chat-related (example: Chat Assistant)

When: the point is a conversation — an AI chat, phone or messaging assistant, a customer talking to the business.

Picture: a chat card of two or three bubbles stacked vertically and alternating sides. The customer's bubble is neutral (a light surface with grey bars); the assistant's bubble carries the AI gradient (gradient bars on a light bubble, or a gradient bubble with white bars); a non-AI chat answers in the primary blue. No headline and no badge: the assistant's bubble is the mark.

Motion: the bubbles appear in conversation order (opacity, at most a 6 px rise); before the answer, three small dots may pulse once in its place; nothing else moves.

### 3.3 reaction — reaction-focused (example: Reputation Manager)

When: the product reacts to something that came in — a review, a message, an email, a booking, an alert — and the point is HOW it reacted.

Picture: two stacked parts. On top, the incoming item at rest: a review with an avatar dot, five stars and bars; a message; an email header. Below it, the reaction card: the reply as bars, or as a headline of at most four words that IS the reply's words in caps (e.g. "VIELEN DANK FÜR IHRE BEWERTUNG."), with one small `<StageBadge>` at its corner. The key element (the stars, the reply's edge) is highlighted with the accent outline (`stageOutline`) or a soft glow.

Motion: smooth. The incoming item is at rest from frame 0; the reaction fades and rises in (at most 6 px, about 400 ms, ease-out); its highlight eases in just after it; one gentle pulse on the key element; then hold.

### 3.4 connector — external connector (example: Marketing Manager)

When: the product connects to, or publishes to, external products or services — social networks, marketplaces, Google, payment or mail providers.

Picture: a centred stack. One `<StageBadge>` on top; an optional headline of at most three words naming the product (e.g. "MARKETING MANAGER"); then a row of two to four external logos (the supplied catalog logos at full colour, all the same size), each with a check box under it — most checked, one may stay empty.

Motion: the checks tick in one after another, left to right (each a 150 ms fade with at most a 1.05 scale); nothing else moves.

## 4. Background kinds

The frame's chrome (window, bar, sidebar, panels) is always light grey, low contrast, with no brand colour, and its text is skeleton bars. The frame is static.

The frame shows the product as the person on stage uses it for their own business, named in the brief's "Person on stage" line: a travel blogger's WordPress hosting runs their travel blog, a coffee roaster's social planner holds coffee posts, a florist's mailbox holds flower orders. That business shows in the frame's one cue and in at most two UDS glyphs of it (a map pin and a camera for the travel blog); a supplied photo or template was chosen for it. Without that line, the frame shows the product alone.

- **frame** — skeleton content plus the product's cue: third-party logos at full colour where the product shows that platform.
- **hero** — the same frame with ONE supplied stock photo embedded as the page's hero image, or as the images of posts or a gallery (`<Img>`, objectFit cover, its own colours).
- **template** — the supplied website or app template fills the frame's viewport (`<Img>`, objectFit cover, objectPosition top, its own colours, never redrawn); only the frame's bar stays light grey.
- **none** — no frame: the background stays empty (`background={null}`).

## 5. Anti-patterns

- A generic badge + headline + bars card; two types mixed on one card.
- The same card for two products: objects that are not the key moment's.
- A card, tile or placeholder when the Foreground type is none; a frame when the Background kind is none.
- Icons inside a glass card, a row of logo chips, or a logo and a glyph sharing a tile.
- More than four objects of one kind; anything outside the card.
- The brief's Foreground sentence printed as copy.
- Tiles, chips or bubbles that resize, travel, morph or bounce; a cursor or typing.
- A hero photo or template redrawn as skeleton, or tinted grey.
- A frame that shows another business than the person on stage's.
