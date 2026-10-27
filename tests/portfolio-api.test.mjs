import test from 'node:test';
import assert from 'node:assert/strict';
import { createPortfolioApi } from '../src/portfolio-api.js';

test('public API handles configuration, RPC errors and image URLs honestly', async () => {
  const local = createPortfolioApi();
  assert.equal(local.image('/assets/test.jpg'), '/assets/test.jpg');
  await assert.rejects(local.sendMessage({}), /unavailable/);
  const calls = [];
  const api = createPortfolioApi('https://test.supabase.co/', 'public-key', async (url, options) => {
    calls.push({ url, ...options });
    return Response.json(calls.length);
  });
  assert.equal(await api.getClicks(), 1);
  assert.equal(await api.incrementClicks(), 2);
  assert.match(calls[1].url, /\/rpc\/increment_portfolio_clicks$/);
  assert.equal(calls[1].headers.apikey, 'public-key');
  assert.equal(api.image('/assets/test image.jpg'), 'https://test.supabase.co/storage/v1/object/public/portfolio-images/test%20image.jpg');
  const limited = createPortfolioApi('https://test.supabase.co', 'public-key', async () => Response.json({ code: 'P0429' }, { status: 400 }));
  await assert.rejects(limited.sendMessage({}), /Too many requests/);
  const denied = createPortfolioApi('https://test.supabase.co', 'public-key', async () => new Response('Denied', { status: 403 }));
  await assert.rejects(denied.incrementClicks(), /Could not connect/);
  const inbox = createPortfolioApi('https://test.supabase.co', 'public-key', async () => new Response(null, { status: 204 }));
  assert.equal(await inbox.sendMessage({}), null);
  const offline = createPortfolioApi('https://test.supabase.co', 'public-key', async () => { throw new TypeError('Failed to fetch'); });
  await assert.rejects(offline.sendMessage({}), /Connection unavailable/);
});
