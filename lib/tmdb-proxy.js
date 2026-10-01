const allowedPath = /^\/(?:trending\/tv\/(?:day|week)|discover\/tv|search\/tv|tv\/\d+(?:\/season\/\d+)?|configuration)$/;
const allowedParams = new Set(["query", "language", "page", "include_adult", "sort_by", "first_air_date_year", "year"]);

module.exports = async function tmdbProxy(req, res) {
  if (req.method !== "GET") {
    res.writeHead(405, { "content-type": "application/json", allow: "GET" });
    res.end(JSON.stringify({ error: "Only GET requests are supported." }));
    return;
  }

  const requestUrl = new URL(req.url, "http://localhost");
  const path = requestUrl.searchParams.get("path") || "";
  if (!allowedPath.test(path)) {
    res.writeHead(400, { "content-type": "application/json" });
    res.end(JSON.stringify({ error: "That TMDB endpoint is not allowed." }));
    return;
  }

  const token = process.env.TMDB_ACCESS_TOKEN;
  const apiKey = process.env.TMDB_API_KEY;
  if (!token && !apiKey) {
    res.writeHead(503, { "content-type": "application/json" });
    res.end(JSON.stringify({ error: "TMDB_ACCESS_TOKEN is not configured on the server." }));
    return;
  }

  const target = new URL(`https://api.themoviedb.org/3${path}`);
  for (const [key, value] of requestUrl.searchParams) {
    if (key !== "path" && allowedParams.has(key)) target.searchParams.set(key, value);
  }
  if (!token && apiKey) target.searchParams.set("api_key", apiKey);

  try {
    const upstream = await fetch(target, {
      headers: token
        ? { accept: "application/json", authorization: `Bearer ${token}` }
        : { accept: "application/json" }
    });
    const body = await upstream.text();
    res.writeHead(upstream.status, {
      "content-type": upstream.headers.get("content-type") || "application/json",
      "cache-control": "public, max-age=300"
    });
    res.end(body);
  } catch {
    res.writeHead(502, { "content-type": "application/json" });
    res.end(JSON.stringify({ error: "Could not reach TMDB. Try again in a moment." }));
  }
};
