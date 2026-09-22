# Tournament Table Task

Football standings table. Header row frozen, Position + Club columns frozen, everything else scrolls both ways, same as the Google Sheet mockup in the brief.

Requirements:

1. The entire top (header) row is vertically sticky: it must not scroll vertically.
2. The remaining rows must scroll vertically as one unit.
3. The 'Position' and 'Club' columns are horizontally sticky: they must not scroll horizontally.
4. The remaining columns must scroll horizontally as one unit.

Proof-of-concept demo with static data:

```bash
npm install
npm run dev
```

## My approach

### Started with the input data

A club standing is a flat shape object: `{ position, club, url, W/D/L/GF/GA/GD/pts, last five results }`. Wrote a `TeamStanding` type plus a validator. In the real app this would come from an API (probably with a more layered structure).

### Columns config

Could've just hardcoded a `<th>`/`<td>` pair per column, but that breaks the moment something changes (business logic or user preference), like reordering columns (pitfall 1) or adding a new one. Instead I created a config file, `standingsTableConfig`, with a `columns` array where each entry is `{ key, header, cellType, bold, render }`. The table just loops over it for the header row and every body row, so adding or reordering columns is a config change, not a component change:

- To reorder columns: modify array order.
- New column needed: add a new column object.
- `render()` lets a column return plain text or something with logic set: Club renders a link, Last 5 renders a `<ul>`.

`leaderPosition` and `dropZone` live in the same config object. They're row-highlight thresholds (first place, and dropped from tournament from position 18 down), so changing the highlighting is a config change too.

## Structure

### UI components

- `StandingsTable`: the one component. Gets the config in its constructor, the validated standings through `setStandings()`, and renders itself into the `#app` mount point.
- `.standings` (`<div>`): the scroll viewport, the only element with `overflow: auto`. Everything sticky is positioned relative to it.
- native `<table>`: semantic table instead of a div grid, so column alignment and web accessibility (`th` with `scope`) work natively, without extra code.
- header cells (`<th scope="col">`): sticky to the top.
- frozen cells, Position and Club (`<th scope="row">` in the body): sticky to the left (pitfall 4).
- stat cells (`<td>`): scroll in both directions.

### View hierarchy

One scroll container, everything else sits relative to it:

```
#app                               mount point (main.ts)
  StandingsTable                   renders the tree below (StandingsTable.ts)
    div.standings                  scroll container: max-height 100vh
      table.standings__table
        thead
          tr
            th Position, th Club   sticky corner (top: 0, left: 0, z-index: 4)
            th Matches - Last 5    sticky top (top: 0, z-index: 3)
        tbody
          tr x one per club
            th Position, th Club   sticky left (left: 0, z-index: 2)
            td x X                 scroll with the viewport
```

Data flow: the static data (`Standings`) is checked by `validateStandings()`, then given to the table (`StandingsTable`) with `setStandings()`, which renders the rows (pitfall 5). What the table looks like (which columns, their order, which rows are highlighted) comes separately from `standingsTableConfig`, passed in when the table is created.

## The sticky part

- header row: `position: sticky; top: 0;` on the header `<th>`s
- first & second columns: `position: sticky;`, picked with `:nth-child(1)` / `:nth-child(2)` so it applies to both header and body cells
- first column: `left: 0;`, fixed to `var(--first-column-width)` (min and max) (pitfall 3)
- second column: `left: var(--first-column-width)`. Has to match the first column's actual rendered width, so it's a shared CSS variable, not a magic number in two places.
- z-index layers: frozen body cells `2`, header cells `3`, corner (top left header cells of the frozen columns) `4`. The corner needs the highest, or it slides under the header when scrolled horizontally.
- every cell has a background, otherwise scrolled content shows through the sticky ones
- the `.standings` div needs a bounded height (`max-height: 100vh`). Otherwise sticky does not stick and the page scrolls instead of the table (pitfall 2).

## Pitfalls

1. The sticky CSS picks the first two columns by position (`:nth-child(1)` / `:nth-child(2)`), not by which column they are, and the second column's `left` offset is the first column's fixed width (`--first-column-width`). The config lets you put any column in those two slots, but the width does not adapt to the content: a wide column like Club in first place gets clipped. Position works there only because it's narrow. If this needed to be dynamic, I'd measure the first column's real width and write it into the CSS variable with JS.
2. The scroll container needs a bounded height (`max-height: 100vh`). Without a limit it grows to fit every row in the table, so it never overflows: the page scrolls instead of the table and the sticky header has nothing to stick against. On its own screen that can look fine and pass all four requirements, but it breaks the moment the table sits inside a real page with its own header/nav. Even then `100vh` ignores that header, so in a real layout the height should come from the layout itself (flex/grid, or `calc(100vh - header height)`).
3. `table-layout: fixed` needs explicit widths. With it the browser takes column widths from the CSS, not from the content. The second column sticks at `left: var(--first-column-width)`, so that variable and the first column's real width must be the same value. If they drift apart, the second column overlaps the first or leaves a gap, and scrolled content shows through it.
4. Narrow screens. Two frozen columns take a big share of a phone-sized viewport, which leaves little room for the scrolling columns.
5. No virtualization. Every club is rendered as a real row in the DOM. That's fine for 20 rows but with a few hundred, the browser has to create and lay out every cell up front, so load and scroll get slower. The fix is rendering only the rows in view, but a native `<table>` makes that more complex: spacer rows, rows of a fixed height etc.

## Edge cases

- Empty standings: renders header only, empty `tbody`. No crash, nothing to scroll.
- Misconfigured `leaderPosition`/`dropZone`: nothing stops them overlapping, which would apply both highlight classes to the same row.
- Long content in a scrolling column: the frozen columns clip with an ellipsis (pitfall 1), but the stat columns just use `white-space: nowrap` with no overflow handling, so a long value there would widen or overflow instead of clipping.

## Stack

Vanilla TS + Vite + Sass (+ BEM). Native `position: sticky` covers the whole problem.
