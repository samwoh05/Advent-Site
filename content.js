/* =====================================================================
   ADVENT CONTENT
   ---------------------------------------------------------------------
   This is the only file you need to edit to fill in each day.

   For each date you can set:
     title       – shown as the heading inside the window
                   (leave out to use e.g. "Tuesday of the First Week of Advent")
     subtitle    – a small line under the title (feast, O Antiphon, etc.)
     reading     – Scripture reference, e.g. "Mark 13:33–37"
     readingText – the passage itself, or a short excerpt
     reflection  – your reflection; use an array for several paragraphs
     activity    – use instead of reflection: the window heading then
                   reads "Activity" instead of "Reflection"
     song        – { title, by, youtubeId } or { title, by, spotifyId }
                   youtubeId is the part after "v=" in a YouTube link,
                   e.g. https://www.youtube.com/watch?v=abc123  ->  "abc123"
                   spotifyId is the part after "/track/" in a Spotify link,
                   e.g. https://open.spotify.com/track/0oPd...?si=x  ->  "0oPd..."
   Anything left empty shows a quiet "to be added" note on the site.
   ===================================================================== */

window.ADVENT = {
  year: 2026,
  firstSunday: "2026-11-29",

  // Which Sunday is rose (door, wreath candle and theme label all follow).
  // 3 = Gaudete Sunday (Joy), the traditional rose Sunday.
  roseSunday: 3,

  // false: every door opens with a click, whatever the date.
  // true:  doors for future days stay shut until their date
  //        (add ?preview to the address to unlock them all while testing).
  // ?today=2026-12-08 in the address shows the site as it will look on that day.
  lockFutureDoors: false,

  days: {
    "2026-11-29": {
      title: "First Sunday of Advent",
      reading: "Mark 13:33–37",
      readingText: "Be on your guard, stay awake, because you never know when the time will come.",
      reflection: "",
      song: { title: "Creator of the Stars of Night", by: "Conditor alme siderum, 7th-century hymn", spotifyId: "" }
    },
    "2026-11-30": { title: "Saint Andrew, Apostle", subtitle: "Feast" },
    "2026-12-01": {
      reflection: "What’s your disposition entering the Advent season, and what is something you’re seeking hope for in your life?"
    },
    "2026-12-02": {
      activity: "Create a wishlist of what you want to achieve going into the New Year."
    },
    "2026-12-03": {
      subtitle: "Memorial of Saint Francis Xavier",
      activity: "Go on a rosary walk in nature."
    },
    "2026-12-04": {
      activity: "Go for Holy Hour at Nativity."
    },
    "2026-12-06": {
      title: "Second Sunday of Advent",
      reading: "Mark 1:1–8",
      readingText: "A voice cries in the wilderness: Prepare a way for the Lord, make his paths straight.",
      song: { title: "On Jordan’s Bank the Baptist’s Cry", by: "Charles Coffin, 1736", youtubeId: "" }
    },
    "2026-12-07": { subtitle: "Memorial of Saint Ambrose" },
    "2026-12-08": {
      title: "The Immaculate Conception of the Blessed Virgin Mary",
      subtitle: "Solemnity",
      reading: "Luke 1:26–38",
      song: { title: "Immaculate Mary", by: "The Lourdes Hymn", youtubeId: "" }
    },
    "2026-12-09": { subtitle: "Saint Juan Diego" },
    "2026-12-11": {
      activity: "Set up a Nativity scene at your home."
    },
    "2026-12-12": { title: "Our Lady of Guadalupe" },
    "2026-12-13": {
      title: "Third Sunday of Advent",
      subtitle: "Gaudete Sunday",
      reading: "John 1:6–8, 19–28",
      song: { title: "Gaudete", by: "Piae Cantiones, 1582", youtubeId: "" }
    },
    "2026-12-14": { subtitle: "Memorial of Saint John of the Cross" },
    "2026-12-15": {
      activity: "Call or meet a friend and tell them how much joy they bring into your life."
    },
    "2026-12-17": {
      subtitle: "O Sapientia — O Wisdom",
      reflection: "What are you grateful for this year?",
      song: { title: "O Come, O Come, Emmanuel", by: "Veni Emmanuel", youtubeId: "" }
    },
    "2026-12-18": {
      subtitle: "O Adonai — O Lord of Israel",
      activity: "Go for the Penitential Service."
    },
    "2026-12-19": {
      subtitle: "O Radix Jesse — O Root of Jesse",
      activity: "Bake Christmas treats with the family and tag us on Instagram!"
    },
    "2026-12-20": {
      title: "Fourth Sunday of Advent",
      subtitle: "O Clavis David — O Key of David",
      reading: "Luke 1:26–38",
      song: { title: "The Angel Gabriel from Heaven Came", by: "Basque carol, arr. Edgar Pettman", youtubeId: "" }
    },
    "2026-12-21": { subtitle: "O Oriens — O Morning Star" },
    "2026-12-22": { subtitle: "O Rex Gentium — O King of the Nations" },
    "2026-12-23": {
      subtitle: "O Emmanuel — O God-with-us",
      activity: "Attend Simbang Gabi at 8pm, led by Fr. Greg."
    },
    "2026-12-24": {
      title: "Christmas Eve",
      song: { title: "Come, Thou Long-Expected Jesus", by: "Charles Wesley, 1744", youtubeId: "" }
    },
    "2026-12-25": {
      title: "The Nativity of the Lord",
      subtitle: "Christmas Day",
      reading: "John 1:1–18",
      readingText: "The Word was made flesh, and lived among us.",
      song: { title: "Feliz Navidad", by: "José Feliciano", spotifyId: "0oPdaY4dXtc3ZsaG17V972" }
    }
  }
};
