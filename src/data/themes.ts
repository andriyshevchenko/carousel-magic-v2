import type { Theme } from '../types';

// Helper – shared traffic light colours
const TL = { trafficRed: '#FF5F57', trafficYellow: '#FEBC2E', trafficGreen: '#28C840' };

export const THEMES: Theme[] = [
  // ═══════════════════════════════════════════════════
  //  DARK THEMES
  // ═══════════════════════════════════════════════════

  // 1 ── One Dark Pro (Atom-inspired classic)
  {
    id: 'one-dark-pro', name: 'One Dark Pro', category: 'dark',
    bg: '#282c34', fg: '#abb2bf', muted: '#5c6370', accent: '#61afef', accentAlt: '#c678dd',
    editorBg: '#21252b', editorBorder: '#181a1f', editorHeaderBg: '#21252b', editorHeaderFg: '#9da5b4',
    syntax: { keyword: '#c678dd', string: '#98c379', number: '#d19a66', comment: '#5c6370', function: '#61afef', variable: '#e06c75', type: '#e5c07b', operator: '#56b6c2', punctuation: '#abb2bf', tag: '#e06c75', attribute: '#d19a66', plain: '#abb2bf' },
    ...TL,
  },

  // 2 ── Dracula
  {
    id: 'dracula', name: 'Dracula', category: 'dark',
    bg: '#282a36', fg: '#f8f8f2', muted: '#6272a4', accent: '#bd93f9', accentAlt: '#ff79c6',
    editorBg: '#1e1f29', editorBorder: '#191a21', editorHeaderBg: '#1e1f29', editorHeaderFg: '#6272a4',
    syntax: { keyword: '#ff79c6', string: '#f1fa8c', number: '#bd93f9', comment: '#6272a4', function: '#50fa7b', variable: '#f8f8f2', type: '#8be9fd', operator: '#ff79c6', punctuation: '#f8f8f2', tag: '#ff79c6', attribute: '#50fa7b', plain: '#f8f8f2' },
    ...TL,
  },

  // 3 ── Catppuccin Mocha
  {
    id: 'catppuccin-mocha', name: 'Catppuccin Mocha', category: 'dark',
    bg: '#1e1e2e', fg: '#cdd6f4', muted: '#585b70', accent: '#cba6f7', accentAlt: '#f38ba8',
    editorBg: '#181825', editorBorder: '#11111b', editorHeaderBg: '#181825', editorHeaderFg: '#585b70',
    syntax: { keyword: '#cba6f7', string: '#a6e3a1', number: '#fab387', comment: '#585b70', function: '#89b4fa', variable: '#f38ba8', type: '#89dceb', operator: '#94e2d5', punctuation: '#cdd6f4', tag: '#f38ba8', attribute: '#f9e2af', plain: '#cdd6f4' },
    ...TL,
  },

  // 4 ── Catppuccin Macchiato
  {
    id: 'catppuccin-macchiato', name: 'Catppuccin Macchiato', category: 'dark',
    bg: '#24273a', fg: '#cad3f5', muted: '#5b6078', accent: '#c6a0f6', accentAlt: '#ed8796',
    editorBg: '#1e2030', editorBorder: '#181926', editorHeaderBg: '#1e2030', editorHeaderFg: '#5b6078',
    syntax: { keyword: '#c6a0f6', string: '#a6da95', number: '#f5a97f', comment: '#5b6078', function: '#8aadf4', variable: '#ed8796', type: '#91d7e3', operator: '#8bd5ca', punctuation: '#cad3f5', tag: '#ed8796', attribute: '#eed49f', plain: '#cad3f5' },
    ...TL,
  },

  // 5 ── Night Owl
  {
    id: 'night-owl', name: 'Night Owl', category: 'dark',
    bg: '#011627', fg: '#d6deeb', muted: '#637777', accent: '#82aaff', accentAlt: '#c792ea',
    editorBg: '#011627', editorBorder: '#0b2942', editorHeaderBg: '#0b2942', editorHeaderFg: '#5f7e97',
    syntax: { keyword: '#c792ea', string: '#ecc48d', number: '#f78c6c', comment: '#637777', function: '#82aaff', variable: '#addb67', type: '#ffcb8b', operator: '#7fdbca', punctuation: '#d6deeb', tag: '#7fdbca', attribute: '#addb67', plain: '#d6deeb' },
    ...TL,
  },

  // 6 ── GitHub Dark
  {
    id: 'github-dark', name: 'GitHub Dark', category: 'dark',
    bg: '#0d1117', fg: '#e6edf3', muted: '#7d8590', accent: '#58a6ff', accentAlt: '#bc8cff',
    editorBg: '#161b22', editorBorder: '#30363d', editorHeaderBg: '#161b22', editorHeaderFg: '#7d8590',
    syntax: { keyword: '#ff7b72', string: '#a5d6ff', number: '#79c0ff', comment: '#8b949e', function: '#d2a8ff', variable: '#ffa657', type: '#79c0ff', operator: '#ff7b72', punctuation: '#e6edf3', tag: '#7ee787', attribute: '#79c0ff', plain: '#e6edf3' },
    ...TL,
  },

  // 7 ── Nord
  {
    id: 'nord', name: 'Nord', category: 'dark',
    bg: '#2e3440', fg: '#d8dee9', muted: '#4c566a', accent: '#88c0d0', accentAlt: '#b48ead',
    editorBg: '#2e3440', editorBorder: '#3b4252', editorHeaderBg: '#3b4252', editorHeaderFg: '#4c566a',
    syntax: { keyword: '#81a1c1', string: '#a3be8c', number: '#b48ead', comment: '#616e88', function: '#88c0d0', variable: '#d8dee9', type: '#8fbcbb', operator: '#81a1c1', punctuation: '#eceff4', tag: '#81a1c1', attribute: '#8fbcbb', plain: '#d8dee9' },
    ...TL,
  },

  // 8 ── Ayu Dark
  {
    id: 'ayu-dark', name: 'Ayu Dark', category: 'dark',
    bg: '#0a0e14', fg: '#b3b1ad', muted: '#5c6773', accent: '#e6b450', accentAlt: '#f07178',
    editorBg: '#0d1016', editorBorder: '#1d202b', editorHeaderBg: '#0d1016', editorHeaderFg: '#5c6773',
    syntax: { keyword: '#ff8f40', string: '#c2d94c', number: '#e6b450', comment: '#5c6773', function: '#ffb454', variable: '#f07178', type: '#59c2ff', operator: '#f29668', punctuation: '#b3b1ad', tag: '#39bae6', attribute: '#59c2ff', plain: '#b3b1ad' },
    ...TL,
  },

  // 9 ── Ayu Mirage
  {
    id: 'ayu-mirage', name: 'Ayu Mirage', category: 'dark',
    bg: '#1f2430', fg: '#cbccc6', muted: '#5c6773', accent: '#ffcc66', accentAlt: '#f28779',
    editorBg: '#1a1e29', editorBorder: '#33394a', editorHeaderBg: '#1a1e29', editorHeaderFg: '#5c6773',
    syntax: { keyword: '#ffa759', string: '#bae67e', number: '#ffcc66', comment: '#5c6773', function: '#ffd580', variable: '#f28779', type: '#73d0ff', operator: '#f29e74', punctuation: '#cbccc6', tag: '#5ccfe6', attribute: '#73d0ff', plain: '#cbccc6' },
    ...TL,
  },

  // 10 ── Monokai Pro
  {
    id: 'monokai-pro', name: 'Monokai Pro', category: 'dark',
    bg: '#2d2a2e', fg: '#fcfcfa', muted: '#727072', accent: '#ffd866', accentAlt: '#ff6188',
    editorBg: '#221f22', editorBorder: '#19181a', editorHeaderBg: '#221f22', editorHeaderFg: '#727072',
    syntax: { keyword: '#ff6188', string: '#ffd866', number: '#ab9df2', comment: '#727072', function: '#a9dc76', variable: '#fcfcfa', type: '#78dce8', operator: '#ff6188', punctuation: '#fcfcfa', tag: '#ff6188', attribute: '#78dce8', plain: '#fcfcfa' },
    ...TL,
  },

  // 11 ── Tokyo Night
  {
    id: 'tokyo-night', name: 'Tokyo Night', category: 'dark',
    bg: '#1a1b26', fg: '#a9b1d6', muted: '#565f89', accent: '#7aa2f7', accentAlt: '#bb9af7',
    editorBg: '#1a1b26', editorBorder: '#292e42', editorHeaderBg: '#1f2335', editorHeaderFg: '#565f89',
    syntax: { keyword: '#bb9af7', string: '#9ece6a', number: '#ff9e64', comment: '#565f89', function: '#7aa2f7', variable: '#c0caf5', type: '#2ac3de', operator: '#89ddff', punctuation: '#a9b1d6', tag: '#f7768e', attribute: '#73daca', plain: '#a9b1d6' },
    ...TL,
  },

  // 12 ── Material Palenight
  {
    id: 'material-palenight', name: 'Material Palenight', category: 'dark',
    bg: '#292d3e', fg: '#a6accd', muted: '#676e95', accent: '#82aaff', accentAlt: '#c792ea',
    editorBg: '#292d3e', editorBorder: '#1b1e2b', editorHeaderBg: '#1b1e2b', editorHeaderFg: '#676e95',
    syntax: { keyword: '#c792ea', string: '#c3e88d', number: '#f78c6c', comment: '#676e95', function: '#82aaff', variable: '#f07178', type: '#ffcb6b', operator: '#89ddff', punctuation: '#a6accd', tag: '#f07178', attribute: '#ffcb6b', plain: '#a6accd' },
    ...TL,
  },

  // 13 ── Gruvbox Dark
  {
    id: 'gruvbox-dark', name: 'Gruvbox Dark', category: 'dark',
    bg: '#282828', fg: '#ebdbb2', muted: '#928374', accent: '#fabd2f', accentAlt: '#fb4934',
    editorBg: '#1d2021', editorBorder: '#3c3836', editorHeaderBg: '#3c3836', editorHeaderFg: '#928374',
    syntax: { keyword: '#fb4934', string: '#b8bb26', number: '#d3869b', comment: '#928374', function: '#fabd2f', variable: '#83a598', type: '#8ec07c', operator: '#fe8019', punctuation: '#ebdbb2', tag: '#fb4934', attribute: '#8ec07c', plain: '#ebdbb2' },
    ...TL,
  },

  // 14 ── Solarized Dark
  {
    id: 'solarized-dark', name: 'Solarized Dark', category: 'dark',
    bg: '#002b36', fg: '#839496', muted: '#586e75', accent: '#268bd2', accentAlt: '#d33682',
    editorBg: '#002b36', editorBorder: '#073642', editorHeaderBg: '#073642', editorHeaderFg: '#586e75',
    syntax: { keyword: '#859900', string: '#2aa198', number: '#d33682', comment: '#586e75', function: '#268bd2', variable: '#b58900', type: '#cb4b16', operator: '#859900', punctuation: '#839496', tag: '#268bd2', attribute: '#b58900', plain: '#839496' },
    ...TL,
  },

  // 15 ── Shades of Purple
  {
    id: 'shades-of-purple', name: 'Shades of Purple', category: 'dark',
    bg: '#2d2b55', fg: '#e3dfff', muted: '#7c76c7', accent: '#fad000', accentAlt: '#ff628c',
    editorBg: '#1e1e3f', editorBorder: '#191843', editorHeaderBg: '#1e1e3f', editorHeaderFg: '#7c76c7',
    syntax: { keyword: '#ff9d00', string: '#a5ff90', number: '#ff628c', comment: '#b362ff', function: '#fad000', variable: '#e3dfff', type: '#9effff', operator: '#ff9d00', punctuation: '#e3dfff', tag: '#ff9d00', attribute: '#fad000', plain: '#e3dfff' },
    ...TL,
  },

  // 16 ── Synthwave '84
  {
    id: 'synthwave-84', name: "Synthwave '84", category: 'dark',
    bg: '#262335', fg: '#e0def4', muted: '#848bbd', accent: '#f97e72', accentAlt: '#ff7edb',
    editorBg: '#241b2f', editorBorder: '#34294f', editorHeaderBg: '#241b2f', editorHeaderFg: '#848bbd',
    syntax: { keyword: '#fede5d', string: '#ff8b39', number: '#f97e72', comment: '#848bbd', function: '#36f9f6', variable: '#ff7edb', type: '#72f1b8', operator: '#fede5d', punctuation: '#e0def4', tag: '#72f1b8', attribute: '#fede5d', plain: '#e0def4' },
    ...TL, patternOpacity: 0.03,
  },

  // 17 ── Andromeda
  {
    id: 'andromeda', name: 'Andromeda', category: 'dark',
    bg: '#23262e', fg: '#d5ced9', muted: '#665c6d', accent: '#00e8c6', accentAlt: '#ee5d43',
    editorBg: '#1e2025', editorBorder: '#2b2d35', editorHeaderBg: '#1e2025', editorHeaderFg: '#665c6d',
    syntax: { keyword: '#c74ded', string: '#96e072', number: '#f39c12', comment: '#665c6d', function: '#ffe66d', variable: '#f92672', type: '#00e8c6', operator: '#ee5d43', punctuation: '#d5ced9', tag: '#f92672', attribute: '#ffe66d', plain: '#d5ced9' },
    ...TL,
  },

  // 18 ── Moonlight
  {
    id: 'moonlight', name: 'Moonlight', category: 'dark',
    bg: '#222436', fg: '#c8d3f5', muted: '#636da6', accent: '#82aaff', accentAlt: '#fca7ea',
    editorBg: '#1e2030', editorBorder: '#2f334d', editorHeaderBg: '#1e2030', editorHeaderFg: '#636da6',
    syntax: { keyword: '#c099ff', string: '#c3e88d', number: '#ff966c', comment: '#636da6', function: '#82aaff', variable: '#c8d3f5', type: '#65bcff', operator: '#86e1fc', punctuation: '#c8d3f5', tag: '#ff757f', attribute: '#ffc777', plain: '#c8d3f5' },
    ...TL,
  },

  // 19 ── Cobalt2
  {
    id: 'cobalt2', name: 'Cobalt2', category: 'dark',
    bg: '#193549', fg: '#e1efff', muted: '#357b9e', accent: '#ffc600', accentAlt: '#ff9d00',
    editorBg: '#15232d', editorBorder: '#0d3a58', editorHeaderBg: '#15232d', editorHeaderFg: '#357b9e',
    syntax: { keyword: '#ff9d00', string: '#a5ff90', number: '#ff628c', comment: '#0d9e6e', function: '#ffc600', variable: '#e1efff', type: '#80ffbb', operator: '#ff9d00', punctuation: '#e1efff', tag: '#ff9d00', attribute: '#ffc600', plain: '#e1efff' },
    ...TL,
  },

  // 20 ── Vitesse Dark
  {
    id: 'vitesse-dark', name: 'Vitesse Dark', category: 'dark',
    bg: '#121212', fg: '#dbd7ca', muted: '#758575', accent: '#4d9375', accentAlt: '#cb7676',
    editorBg: '#1a1a1a', editorBorder: '#2a2a2a', editorHeaderBg: '#1a1a1a', editorHeaderFg: '#758575',
    syntax: { keyword: '#4d9375', string: '#c98a7d', number: '#4c9a91', comment: '#758575', function: '#80a665', variable: '#bd976a', type: '#5da5e1', operator: '#cb7676', punctuation: '#dbd7ca', tag: '#4d9375', attribute: '#bd976a', plain: '#dbd7ca' },
    ...TL,
  },

  // ═══════════════════════════════════════════════════
  //  LIGHT THEMES
  // ═══════════════════════════════════════════════════

  // 21 ── GitHub Light
  {
    id: 'github-light', name: 'GitHub Light', category: 'light',
    bg: '#ffffff', fg: '#1f2328', muted: '#656d76', accent: '#0969da', accentAlt: '#8250df',
    editorBg: '#f6f8fa', editorBorder: '#d0d7de', editorHeaderBg: '#f6f8fa', editorHeaderFg: '#656d76',
    syntax: { keyword: '#cf222e', string: '#0a3069', number: '#0550ae', comment: '#6e7781', function: '#8250df', variable: '#953800', type: '#0550ae', operator: '#cf222e', punctuation: '#1f2328', tag: '#116329', attribute: '#0550ae', plain: '#1f2328' },
    ...TL,
  },

  // 22 ── Solarized Light
  {
    id: 'solarized-light', name: 'Solarized Light', category: 'light',
    bg: '#fdf6e3', fg: '#657b83', muted: '#93a1a1', accent: '#268bd2', accentAlt: '#d33682',
    editorBg: '#eee8d5', editorBorder: '#d6ccb0', editorHeaderBg: '#eee8d5', editorHeaderFg: '#93a1a1',
    syntax: { keyword: '#859900', string: '#2aa198', number: '#d33682', comment: '#93a1a1', function: '#268bd2', variable: '#b58900', type: '#cb4b16', operator: '#859900', punctuation: '#657b83', tag: '#268bd2', attribute: '#b58900', plain: '#657b83' },
    ...TL,
  },

  // 23 ── Ayu Light
  {
    id: 'ayu-light', name: 'Ayu Light', category: 'light',
    bg: '#fafafa', fg: '#575f66', muted: '#abb0b6', accent: '#ff9940', accentAlt: '#f07171',
    editorBg: '#f0f0f0', editorBorder: '#dcdcdc', editorHeaderBg: '#f0f0f0', editorHeaderFg: '#abb0b6',
    syntax: { keyword: '#fa8d3e', string: '#86b300', number: '#a37acc', comment: '#abb0b6', function: '#f2ae49', variable: '#f07171', type: '#399ee6', operator: '#ed9366', punctuation: '#575f66', tag: '#55b4d4', attribute: '#399ee6', plain: '#575f66' },
    ...TL,
  },

  // 24 ── Catppuccin Latte
  {
    id: 'catppuccin-latte', name: 'Catppuccin Latte', category: 'light',
    bg: '#eff1f5', fg: '#4c4f69', muted: '#9ca0b0', accent: '#8839ef', accentAlt: '#d20f39',
    editorBg: '#e6e9ef', editorBorder: '#ccd0da', editorHeaderBg: '#e6e9ef', editorHeaderFg: '#9ca0b0',
    syntax: { keyword: '#8839ef', string: '#40a02b', number: '#fe640b', comment: '#9ca0b0', function: '#1e66f5', variable: '#d20f39', type: '#04a5e5', operator: '#179299', punctuation: '#4c4f69', tag: '#d20f39', attribute: '#df8e1d', plain: '#4c4f69' },
    ...TL,
  },

  // 25 ── Gruvbox Light
  {
    id: 'gruvbox-light', name: 'Gruvbox Light', category: 'light',
    bg: '#fbf1c7', fg: '#3c3836', muted: '#928374', accent: '#b57614', accentAlt: '#9d0006',
    editorBg: '#f2e5bc', editorBorder: '#d5c4a1', editorHeaderBg: '#f2e5bc', editorHeaderFg: '#928374',
    syntax: { keyword: '#9d0006', string: '#79740e', number: '#8f3f71', comment: '#928374', function: '#b57614', variable: '#076678', type: '#427b58', operator: '#af3a03', punctuation: '#3c3836', tag: '#9d0006', attribute: '#427b58', plain: '#3c3836' },
    ...TL,
  },

  // 26 ── Vitesse Light
  {
    id: 'vitesse-light', name: 'Vitesse Light', category: 'light',
    bg: '#ffffff', fg: '#393a34', muted: '#a0ada0', accent: '#1e754f', accentAlt: '#ab5959',
    editorBg: '#f7f7f7', editorBorder: '#e4e4e4', editorHeaderBg: '#f7f7f7', editorHeaderFg: '#a0ada0',
    syntax: { keyword: '#1e754f', string: '#b56959', number: '#2f798a', comment: '#a0ada0', function: '#59873a', variable: '#b07d48', type: '#2e8f82', operator: '#ab5959', punctuation: '#393a34', tag: '#1e754f', attribute: '#b07d48', plain: '#393a34' },
    ...TL,
  },

  // 27 ── Rosé Pine Dawn
  {
    id: 'rose-pine-dawn', name: 'Rosé Pine Dawn', category: 'light',
    bg: '#faf4ed', fg: '#575279', muted: '#9893a5', accent: '#907aa9', accentAlt: '#b4637a',
    editorBg: '#f2e9e1', editorBorder: '#dfdad9', editorHeaderBg: '#f2e9e1', editorHeaderFg: '#9893a5',
    syntax: { keyword: '#907aa9', string: '#ea9d34', number: '#d7827e', comment: '#9893a5', function: '#286983', variable: '#575279', type: '#56949f', operator: '#b4637a', punctuation: '#575279', tag: '#b4637a', attribute: '#ea9d34', plain: '#575279' },
    ...TL,
  },

  // 28 ── Midnight Blue (gradient dark)
  {
    id: 'midnight-blue', name: 'Midnight Blue', category: 'dark',
    bg: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)', fg: '#e0e0ff', muted: '#7a78a0', accent: '#a78bfa', accentAlt: '#f472b6',
    editorBg: 'rgba(15,12,41,0.85)', editorBorder: 'rgba(255,255,255,0.08)', editorHeaderBg: 'rgba(15,12,41,0.9)', editorHeaderFg: '#7a78a0',
    syntax: { keyword: '#c084fc', string: '#86efac', number: '#fbbf24', comment: '#7a78a0', function: '#93c5fd', variable: '#f9a8d4', type: '#67e8f9', operator: '#f472b6', punctuation: '#e0e0ff', tag: '#c084fc', attribute: '#fbbf24', plain: '#e0e0ff' },
    ...TL, patternOpacity: 0.04,
  },

  // 29 ── Sunset Gradient
  {
    id: 'sunset-gradient', name: 'Sunset Gradient', category: 'dark',
    bg: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 40%, #0f3460 100%)', fg: '#e8e8f0', muted: '#6b7280', accent: '#f97316', accentAlt: '#ec4899',
    editorBg: 'rgba(26,26,46,0.9)', editorBorder: 'rgba(255,255,255,0.06)', editorHeaderBg: 'rgba(26,26,46,0.95)', editorHeaderFg: '#6b7280',
    syntax: { keyword: '#f97316', string: '#a3e635', number: '#fb923c', comment: '#6b7280', function: '#60a5fa', variable: '#f9a8d4', type: '#22d3ee', operator: '#fb7185', punctuation: '#e8e8f0', tag: '#f97316', attribute: '#fbbf24', plain: '#e8e8f0' },
    ...TL, patternOpacity: 0.03,
  },

  // 30 ── Minimal Dark
  {
    id: 'minimal-dark', name: 'Minimal Dark', category: 'dark',
    bg: '#111111', fg: '#e5e5e5', muted: '#666666', accent: '#ffffff', accentAlt: '#999999',
    editorBg: '#1a1a1a', editorBorder: '#333333', editorHeaderBg: '#1a1a1a', editorHeaderFg: '#666666',
    syntax: { keyword: '#e5e5e5', string: '#b8b8b8', number: '#d4d4d4', comment: '#555555', function: '#ffffff', variable: '#cccccc', type: '#aaaaaa', operator: '#e5e5e5', punctuation: '#999999', tag: '#ffffff', attribute: '#cccccc', plain: '#e5e5e5' },
    ...TL,
  },

  // 31 ── Minimal Light
  {
    id: 'minimal-light', name: 'Minimal Light', category: 'light',
    bg: '#ffffff', fg: '#1a1a1a', muted: '#999999', accent: '#000000', accentAlt: '#555555',
    editorBg: '#f5f5f5', editorBorder: '#e0e0e0', editorHeaderBg: '#f5f5f5', editorHeaderFg: '#999999',
    syntax: { keyword: '#1a1a1a', string: '#555555', number: '#333333', comment: '#aaaaaa', function: '#000000', variable: '#333333', type: '#666666', operator: '#1a1a1a', punctuation: '#666666', tag: '#000000', attribute: '#333333', plain: '#1a1a1a' },
    ...TL,
  },
];

export function getTheme(id: string): Theme {
  return THEMES.find(t => t.id === id) ?? THEMES[0];
}
