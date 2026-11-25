---
styles: [strato-stage-pair]
---

# STRATO stage — foreground types and background kinds

## 1. When it applies

Only the STRATO corporate stage's pair: the abstract app frame behind the person and the glass highlight card in front of them. The brief names the card's type ("Foreground type: …") and the frame's kind ("Background kind: …"). Draw exactly that type and kind; never mix two types.

## 2. Every card

- The card is `<StageCard ai={…}>`: it hugs its content and clips anything beyond, so everything sits inside it.
- It is built from the product's own key objects, at most four of one kind, aligned on one grid.
- The AI mark appears once: either the objects carry the AI gradient (`StageTile ai`, `stageAccentFill(true)` bars, a gradient bubble) or one small `<StageBadge ai>` sits at a corner of the card. A non-AI product uses the primary blue instead of the AI gradient and at most one small `<StageBadge ai={false} glyph={…}>` corner mark.
- A headline is optional, at most four words, in `<StageText>`, and only where the type below allows it. Every other text is a skeleton bar, except labels the brief gives verbatim.
- A glyph from `@ionos-web-design-system/icon` is passed as its `svgData` string (`glyph={svgData}`); a supplied catalog logo is an `<Img>` at full colour.
- Motion is subtle and tiny: frame 0 already holds the final layout; only the accent the type names moves; nothing travels, resizes, morphs, bounces or overshoots; no cursor, click, press or typing.

## 3. The four types

### 3.1 icons — icon-only (example: Marketing Suite)

When: a complex context that refers to several products, channels or processes at once — a suite, listings across Google, Maps and directories, an all-in-one plan.

Picture: two to four `<StageTile>` tiles in one column (or one row on a wide card), each with ONE glyph that names a channel or a product: a supplied logo or a UDS system icon (Google G, stars, map pin, globe, mail). Optionally ONE small bar card beside or under the tiles, with two or three gradient bars. No headline and no badge: the tiles are the mark.

Motion: the tiles fade in one after another (about 120 ms apart, at most a 6 px rise); then the bar card's first bar fills once from its left edge.

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

## 5. Anti-patterns

- A generic badge + headline + bars card; two types mixed on one card.
- More than four objects of one kind; anything outside the card.
- The brief's Foreground sentence printed as copy.
- Tiles, chips or bubbles that resize, travel, morph or bounce; a cursor or typing.
- A hero photo or template redrawn as skeleton, or tinted grey.
- A frame that shows another business than the person on stage's.
