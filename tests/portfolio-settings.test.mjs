import assert from 'node:assert/strict';
import test from 'node:test';
import { palettes, accents, indiaTime, indiaDate } from '../src/site-settings.js';

function luminance(hex) {
  const rgb = hex.match(/[\da-f]{2}/gi).map(part => {
    const channel = parseInt(part, 16) / 255;
    return channel <= .04045 ? channel / 12.92 : ((channel + .055) / 1.055) ** 2.4;
  });
  return rgb[0] * .2126 + rgb[1] * .7152 + rgb[2] * .0722;
}

test('every appearance choice keeps small accent text readable, and the clock uses IST across a date boundary', () => {
  for (const [theme, palette] of Object.entries(palettes)) {
    for (const accent of Object.values(accents)) {
      const values = [luminance(palette.bg), luminance(accent[theme === 'latte' ? 'light' : 'dark'])].sort((a, b) => b - a);
      assert.ok((values[0] + .05) / (values[1] + .05) >= 4.5, `${palette.label} / ${accent.label} must meet 4.5:1 contrast`);
    }
  }
  const utcEvening = new Date('2026-10-15T20:00:00Z');
  assert.equal(indiaTime.format(utcEvening), '01:30:00');
  assert.match(indiaDate.format(utcEvening), /Fri.*16 Oct/);
});
