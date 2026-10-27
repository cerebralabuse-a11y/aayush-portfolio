export const palettes = {
  latte: { label: 'Latte', bg: '#eff1f5', text: '#4c4f69', muted: '#5c5f77', line: '#aeb2c5', 'subtle-line': '#ccd0da', pill: '#e3e6ee', 'pill-line': '#ccd0da', card: '#eff1f5', dialog: '#f7f8fc' },
  frappe: { label: 'Frappe', bg: '#303446', text: '#c6d0f5', muted: '#b5bddc', line: '#737994', 'subtle-line': '#51576d', pill: '#3b3f56', 'pill-line': '#626880', card: '#303446', dialog: '#373b50' },
  macchiato: { label: 'Macchiato', bg: '#24273a', text: '#cad3f5', muted: '#b8c0e0', line: '#6e738d', 'subtle-line': '#494d64', pill: '#2c3046', 'pill-line': '#5b6078', card: '#24273a', dialog: '#2b2e43' },
  mocha: { label: 'Mocha', bg: '#1e1e2e', text: '#cdd6f4', muted: '#b3bcd8', line: '#50536b', 'subtle-line': '#36384f', pill: '#27293b', 'pill-line': '#393c55', card: '#1e1e2e', dialog: '#242436' },
};

export const accents = {
  peach: { label: 'Peach', dark: '#fab387', light: '#a84c16' },
  rose: { label: 'Rose', dark: '#f2cdcd', light: '#a33b53' },
  pink: { label: 'Pink', dark: '#f5c2e7', light: '#9b347d' },
  mauve: { label: 'Mauve', dark: '#cba6f7', light: '#7536b8' },
  red: { label: 'Red', dark: '#f38ba8', light: '#ae2537' },
  yellow: { label: 'Yellow', dark: '#f9e2af', light: '#7a5b00' },
  green: { label: 'Green', dark: '#a6e3a1', light: '#2c6b27' },
  teal: { label: 'Teal', dark: '#94e2d5', light: '#086c64' },
  sky: { label: 'Sky', dark: '#89dceb', light: '#086b84' },
  blue: { label: 'Blue', dark: '#89b4fa', light: '#245cbb' },
};

export const indiaTime = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23',
});

export const indiaDate = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'Asia/Kolkata', weekday: 'short', day: 'numeric', month: 'short',
});
