// ── SlideCanvas layout constants (unscaled, in 1080-space) ──

export const SLIDE = {
  // ── Edge insets ──
  /** Vertical inset from top/bottom edges (badge, nav dots, swipe hint) */
  EDGE_INSET: 28,
  /** Horizontal inset from left/right edges (badge, slide numbers) */
  SIDE_INSET: 36,
  /** Decorative dot-pattern grid spacing */
  PATTERN_GRID: 20,

  // ── Author badge ──
  AVATAR_SIZE: 60,
  BADGE_GAP: 14,
  AUTHOR_INITIALS_SIZE: 22,
  AUTHOR_NAME_SIZE: 22,
  AUTHOR_HANDLE_SIZE: 17,
  AUTHOR_COLUMN_GAP: 3,

  // ── Content area padding ──
  CONTENT_TOP_WITH_BADGE: 110,
  CONTENT_TOP_NO_BADGE: 80,
  CONTENT_SIDE_CODE: 48,
  CONTENT_SIDE_DEFAULT: 60,
  CONTENT_BOTTOM: 100,

  // ── Navigation dots ──
  NAV_DOT_SIZE: 10,
  NAV_DOT_ACTIVE_WIDTH: 26,
  NAV_DOT_RADIUS: 5,
  NAV_DOT_GAP: 8,

  // ── Slide number ──
  SLIDE_NUM_FONT_SIZE: 14,
  SLIDE_NUM_HEIGHT: 52,
  SLIDE_NUM_OFFSET_WITH_SWIPE: 100,

  // ── Swipe / next button ──
  SWIPE_BTN_SIZE: 52,
  SWIPE_BTN_RIGHT: 32,
  SWIPE_ARROW_SIZE: 22,

  // ── Decorative accent line (hook + CTA slides) ──
  ACCENT_LINE_WIDTH: 180,
  ACCENT_LINE_HEIGHT: 6,
  ACCENT_LINE_RADIUS: 3,
} as const;
