# Serializd-inspired TV diary

An unofficial, browser-based TV tracking and community app inspired by the features of Serializd. This project is not affiliated with Serializd.

## Run it with live TV data

1. Create a TMDB account and request an **API Read Access Token** in the API settings.
2. Copy `.env.example` to `.env` and paste the token as `TMDB_ACCESS_TOKEN`.
3. Run `npm start` with Node.js 18 or newer, then open `http://localhost:3000`.

The small Node server serves the app and proxies the allowed TMDB requests. The token stays on the server and `.env` is ignored by Git. For a Vercel deployment, set `TMDB_ACCESS_TOKEN` as a project environment variable; `api/tmdb.js` provides the serverless proxy. A static GitHub Pages deployment cannot run that private API proxy.

## Included

- Home activity feed and community reviews
- Live trending and search results from TMDB, with show, season, episode, and poster metadata
- Show discovery, sorting, and show detail pages
- Show tracking states: watching, watched, paused, and dropped
- Season and episode lists with episode ratings and diary reviews
- Series ratings, watchlist, review likes, and profile statistics
- Community lists and personal list creation

Tracking, ratings, likes, follows, and lists are saved in browser storage; the community feed remains local sample content. TMDB data and images require attribution. This is a non-commercial fan project and is not affiliated with Serializd or TMDB.
