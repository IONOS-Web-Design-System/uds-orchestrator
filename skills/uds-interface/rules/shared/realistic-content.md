# Realistic content

A high-fidelity interface must read as the REAL product screen a customer would see.

- **Derive everything from the brief's context**: product name, the user's business (bakery,
  workshop, studio), the task in progress. Labels, menu items, table headers and sample data
  are concrete and consistent with that story — never "Lorem ipsum", "Item 1", "Label".
- **Sample data is plausible and local**: names, prices, dates and units in the market's
  language and format (de: "1.240,00 €", "12. März"; en: "€1,240.00", "Mar 12").
- **Density follows the real product, not the canvas**: a dashboard shows the regions the real
  product has (navigation, header, content); every region carries real content.
- **All copy comes from `texts.*`** (per-market re-renders translate it), and so do formatted
  prices, dates and units ("1.240,00 €", "12. März"): their format is market-specific. Only
  unformatted numbers (a count, a percentage value) may be literals.
- **No invented demonstration layer**: elements this render's embed style or module contract
  defines (e.g. a background-pointer panel/connector, a floating card, the product-pop-out
  highlight) are contract-named — draw them with realistic content. Add no floating highlight
  cards, connector lines, pop-outs or callouts beyond what the contract defines.
