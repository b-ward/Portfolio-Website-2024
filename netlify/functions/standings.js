// Netlify Function: proxies Sportradar standings request server-side
// Reads API key from process.env.SPORTRADAR_NBA_API_KEY

export async function handler(event, context) {
  const API_KEY = process.env.SPORTRADAR_NBA_API_KEY
  if (!API_KEY) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Server misconfiguration: missing SPORTRADAR_NBA_API_KEY' }),
    }
  }

  const url = `https://api.sportradar.com/nba/trial/v8/en/seasons/2025/REG/standings.json?api_key=${API_KEY}`

  try {
    const res = await fetch(url)
    const text = await res.text()

    // If the upstream returned non-JSON (HTML error) we still forward the status and body.
    if (!res.ok) {
      return {
        statusCode: res.status,
        headers: { 'content-type': res.headers.get('content-type') || 'text/plain' },
        body: text,
      }
    }

    return {
      statusCode: 200,
      headers: { 'content-type': 'application/json' },
      body: text,
    }
  } catch (err) {
    return {
      statusCode: 502,
      body: JSON.stringify({ error: err.message || 'Upstream request failed' }),
    }
  }
}
