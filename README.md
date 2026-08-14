# My Best Anime — Archive

A personal, editorial anime archive for collecting, ranking, and showcasing the anime you love.

Instead of presenting anime as a conventional gallery, **My Best Anime** treats your selections like a curated publication — with a dark editorial hero, a bookshelf-inspired collection, and a clean archive below.

## ✦ Concept

Pick your favorite anime and build your own personal collection.

The selected anime are transformed into a visual **manga bookshelf**, using their AniList cover artwork as the source material for the spine-like visuals.

The result is designed to feel less like a database and more like a personal collection someone would actually keep on a shelf.

## Features

- 🔎 **Anime Search** — Search AniList's anime database
- 📚 **10-Anime Collection** — Select up to 10 anime for your personal archive
- 🗂️ **Editorial Hero** — Dark, magazine-inspired archive presentation
- 📖 **Manga Shelf** — Selected anime covers are cropped into manga-spine-inspired volumes
- 💾 **Local Persistence** — Collection data is saved locally in the browser
- 🖼️ **Poster Export** — Export your completed collection as a 1080 × 1920 editorial poster
- 📱 **Responsive Design** — Designed for desktop and mobile screens
- 🚫 **Adult Content Filtering** — Adult anime are excluded from search results
- ⚡ **Client-Side Architecture** — No account or backend database required

## API

Anime data is provided by **AniList GraphQL**.

The application uses AniList for:

- Anime search
- Titles
- Cover artwork
- Anime IDs
- Release information
- Other metadata required by the archive

Adult anime are excluded from search using AniList's `isAdult: false` filter, with additional client-side filtering for clearly NSFW entries where appropriate.

Search requests are debounced and cached to reduce unnecessary API calls.

## Local Storage

The collection is designed to work without an account or backend.

Selected anime are stored locally using **IndexedDB**, allowing the archive to remain available between sessions without repeatedly requesting the same data from AniList.

A localStorage fallback can be used if IndexedDB is unavailable.

## Export

The archive can be exported as a vertical editorial poster.

**Export resolution:**

`1080 × 1920`

The exported poster is designed for:

- Social media sharing
- Phone viewing
- Discord sharing
- Personal collections
- Digital wallpapers

The export contains the visual archive rather than simply taking a screenshot of the webpage.

## Visual Direction

The site follows a dark editorial / archive aesthetic rather than a conventional SaaS interface.

### Hero

- Near-black background
- Large editorial typography
- Small monospaced metadata
- Thin rules and borders
- Generous negative space
- Restrained mauve/purple accents
- Bookshelf-inspired anime collection

### Archive

The lower section switches to a clean white presentation for the actual anime list.

The selected 10 anime are displayed in a structured two-column archive:

```text
01 — Anime Title             06 — Anime Title
02 — Anime Title             07 — Anime Title
03 — Anime Title             08 — Anime Title
04 — Anime Title             09 — Anime Title
05 — Anime Title             10 — Anime Title
```

The contrast between the dark editorial hero and clean archive creates a deliberate publication-like transition.

## Tech Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- AniList GraphQL API
- IndexedDB
- Canvas / client-side image processing
- Responsive CSS

## Project Structure

```text
my-best-anime/
├── public/
│   └── og-image.webp
│
├── src/
│   ├── components/
│   ├── data/
│   ├── hooks/
│   ├── utils/
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
│
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## Design Philosophy

**My Best Anime** is intentionally more editorial than application-like.

The goal is to make a simple anime selection tool feel like a personal publication:

> **ARCHIVE**  
> ISSUE 01  
> MY BEST ANIME  
> PERSONAL COLLECTION

The interface should stay restrained and let the selected anime become the primary visual content.

## Status

**Active experiment.**

The project is part of an ongoing collection of frontend experiments exploring interactive interfaces, visual storytelling, APIs, local browser storage, and creative web experiences.

---

**My Best Anime — Archive**

*Keep the anime worth remembering.*

---

<div align="center">
  <p>© 2026 レム</p>
</div>
