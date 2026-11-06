# Advent 2026 — Parish of the Nativity of the Blessed Virgin Mary

A static Advent calendar site: an animated wreath hero and a door for every day from 29 November to Christmas. Each door opens onto a window with that day's reading, reflection and song of the day.

## Files

- `index.html` — page structure
- `styles.css` — all styling
- `app.js` — wreath animation, calendar doors, window and song logic
- `content.js` — **the only file you need to edit** to add readings, reflections and songs for each day

## Filling in a day

Open `content.js` and add or edit the entry for that date, e.g.

```js
"2026-12-02": {
  reading: "Isaiah 25:6–10",
  readingText: "On this mountain the Lord will prepare a banquet for all peoples.",
  reflection: ["First paragraph…", "Second paragraph…"],
  song: { title: "People, Look East", by: "Eleanor Farjeon", youtubeId: "abc123" }
}
```

Empty fields show a "to be added" note on the site.

## Previewing

Every door currently opens with a click, whatever the date. Add `?today=2026-12-08` to the address to see the site as it will look on that day (today's door highlighted, wreath candles lit for that week).

Run locally with `python3 -m http.server` and visit http://localhost:8000/

## Settings (top of `content.js`)

- `roseSunday` — which Sunday's door and wreath candle are rose (currently 4)
- `lockFutureDoors` — currently `false`. Set to `true` to keep each door shut until its date; `?preview` in the address then unlocks them all for testing
