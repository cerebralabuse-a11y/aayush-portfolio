export function createPortfolioApi(url, key, request = fetch) {
  const base = url?.replace(/\/$/, '');
  const configured = Boolean(base && key);

  async function rpc(name, body = {}) {
    if (!configured) throw new Error('Contact is unavailable here. Please use email.');
    let response;
    try {
      response = await request(`${base}/rest/v1/rpc/${name}`, {
        method: 'POST',
        headers: { apikey: key, 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(12000),
      });
    } catch {
      throw new Error('Connection unavailable. Please try again or use email.');
    }
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      if (error.code === 'P0429') throw new Error('Too many requests. Please try again later or use email.');
      if (error.code === '22023') throw new Error('Please check your name, email and message length.');
      throw new Error('Could not connect. Please try again or use email.');
    }
    return response.status === 204 ? null : response.json();
  }

  return {
    configured,
    image(path) {
      return configured ? `${base}/storage/v1/object/public/portfolio-images/${encodeURIComponent(path.split('/').pop())}` : path;
    },
    getClicks: () => rpc('get_portfolio_clicks'),
    incrementClicks: () => rpc('increment_portfolio_clicks'),
    sendMessage: fields => rpc('submit_portfolio_message', fields),
  };
}
