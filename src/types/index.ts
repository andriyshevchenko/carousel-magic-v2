// ── Carousel Magic V2 – Type Definitions ──

export type SlideFormat = '1080x1080' | '1080x1350';

export interface Theme {
  id: string;
  name: string;
  category: 'dark' | 'light';
  // canvas
  bg: string;            // slide background (can be gradient)
  fg: string;            // primary text
  muted: string;         // secondary / muted text
  accent: string;        // accent colour (links, highlights, dots)
  accentAlt: string;     // secondary accent
  // code editor chrome
  editorBg: string;
  editorBorder: string;
  editorHeaderBg: string;
  editorHeaderFg: string;
  // syntax colours
  syntax: {
    keyword: string;
    string: string;
    number: string;
    comment: string;
    function: string;
    variable: string;
    type: string;
    operator: string;
    punctuation: string;
    tag: string;
    attribute: string;
    plain: string;
  };
  // traffic light overrides (optional)
  trafficRed?: string;
  trafficYellow?: string;
  trafficGreen?: string;
  // optional decorative
  patternOpacity?: number;
}

export interface FontSet {
  id: string;
  label: string;
  heading: string;
  body: string;
  code: string;
}

export type SlideType = 'hook' | 'content' | 'code' | 'cta';

export interface Slide {
  id: string;
  type: SlideType;
  // hook / content
  title?: string;
  subtitle?: string;
  body?: string;
  // code slide
  code?: string;
  codeLang?: string;
  codeCaption?: string;
  codeTextAbove?: string;   // arbitrary text/bullets shown above the code block
  codeTextBelow?: string;   // arbitrary text shown below the code block

}

export interface CarouselConfig {
  format: SlideFormat;
  themeId: string;
  fontSetId: string;
  authorName: string;
  authorHandle: string;
  authorInitials: string;
  showNavDots: boolean;
  showSlideNumbers: boolean;
  showAuthorBadge: boolean;
  showSwipeHint: boolean;
  ctaSocials: {
    linkedin?: string;
    twitter?: string;
    github?: string;
    website?: string;
  };
}

export interface CarouselTemplate {
  id: string;
  name: string;
  createdAt: number;
  config: CarouselConfig;
  slides: Slide[];
}

export interface CarouselState {
  config: CarouselConfig;
  slides: Slide[];
  activeSlideIndex: number;
}

export const PORTRAIT_FORMAT: SlideFormat = '1080x1350';
export const SQUARE_FORMAT: SlideFormat = '1080x1080';
