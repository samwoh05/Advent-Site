# Advent 2026 — Parish of the Nativity of the Blessed Virgin Mary

A static Advent calendar site: an animated wreath hero, a door for every day from 29 November to Christmas, and a song of the day.

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

Doors stay locked until their date. While building, open the site with:

- `?preview` — unlocks every door
- `?today=2026-12-08` — shows the site as it will look on that day

Run locally with `python3 -m http.server` and visit http://localhost:8000/?preview

## Settings (top of `content.js`)

- `roseSunday` — which Sunday's door and wreath candle are rose (currently 4)
- `lockFutureDoors` — set to `false` to unlock every door permanently
