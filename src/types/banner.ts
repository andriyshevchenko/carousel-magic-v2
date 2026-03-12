// ── LinkedIn Banner – Type Definitions ──

export const BANNER_WIDTH = 1584;
export const BANNER_HEIGHT = 396;

export type BannerLayoutId =
    | 'centered'
    | 'left-aligned'
    | 'split'
    | 'minimal'
    | 'gradient-wave'
    | 'tech-grid'
    | 'newsletter'
    | 'brand-promo';

export interface BannerLayout {
    id: BannerLayoutId;
    name: string;
    description: string;
}

export interface BannerConfig {
    /** Primary headline text */
    headline: string;
    /** Secondary tagline / subtitle */
    tagline: string;
    /** Optional list of skill/keyword tags */
    tags: string[];
    /** Theme ID (reuses carousel themes) */
    themeId: string;
    /** Font set ID (reuses carousel fonts) */
    fontSetId: string;
    /** Layout template */
    layoutId: BannerLayoutId;
    /** Optional accent icon emoji */
    accentEmoji: string;
    /** Show decorative elements */
    showDecoration: boolean;
    /** Custom accent color override (empty = use theme accent) */
    accentColorOverride: string;
    /** Author name displayed on the banner */
    authorName: string;
    /** Author website URL */
    authorWebsite: string;
    /** CTA button text (e.g. "Subscribe in my featured section") */
    ctaButtonText: string;
    /** Social proof text (e.g. "Join 35,000+ engineers") */
    socialProof: string;
    /** Word in headline to highlight in accent color */
    highlightWord: string;
}

export const DEFAULT_BANNER_CONFIG: BannerConfig = {
    headline: 'Software Engineer & Tech Blogger',
    tagline: 'Building the future with code, one commit at a time',
    tags: ['TypeScript', 'React', 'Azure', 'AI/ML', '.NET'],
    themeId: 'one-dark-pro',
    fontSetId: 'inter-jetbrains',
    layoutId: 'centered',
    accentEmoji: '🚀',
    showDecoration: true,
    accentColorOverride: '',
    authorName: '',
    authorWebsite: '',
    ctaButtonText: '',
    socialProof: '',
    highlightWord: '',
};

export const BANNER_LAYOUTS: BannerLayout[] = [
    { id: 'newsletter', name: 'Newsletter', description: 'Influencer-style: bold headline, social proof, CTA button' },
    { id: 'brand-promo', name: 'Brand Promo', description: 'Bold uppercase headline with accent keyword & CTA' },
    { id: 'centered', name: 'Centered', description: 'Balanced centered layout with headline, tagline, and tags' },
    { id: 'left-aligned', name: 'Left Aligned', description: 'Left-aligned text with decorative right side' },
    { id: 'split', name: 'Split', description: 'Two-column split with accent divider' },
    { id: 'minimal', name: 'Minimal', description: 'Clean minimal design with subtle typography' },
    { id: 'gradient-wave', name: 'Gradient Wave', description: 'Dynamic gradient with wave decoration' },
    { id: 'tech-grid', name: 'Tech Grid', description: 'Technical grid pattern with code-style accents' },
];
