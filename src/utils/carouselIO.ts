import type { CarouselConfig, Slide } from '../types';

/** Short random ID */
export const uid = () => Math.random().toString(36).slice(2, 10);

/** Ensure a bullet line starts with • or - */
const formatBullet = (b: string) =>
    b.startsWith('•') || b.startsWith('-') ? b : `• ${b}`;

export const DEFAULT_CONFIG: CarouselConfig = {
    format: '1080x1080',
    themeId: 'one-dark-pro',
    fontSetId: 'inter-jetbrains',
    authorName: 'Andrii Shevchenko',
    authorHandle: '@andriy-shevchenko-dev',
    authorInitials: 'AS',
    showNavDots: true,
    showSlideNumbers: true,
    showAuthorBadge: true,
    showSwipeHint: true,
    ctaSocials: {},
};

/**
 * Parse raw text (possibly wrapped in a markdown code block) into a
 * validated carousel config + slides array, applying auto-fixes for
 * common AI-generated JSON mistakes.
 *
 * Throws on invalid / unparseable input.
 */
export function parseCarouselJson(rawText: string): {
    config: CarouselConfig;
    slides: Slide[];
    warnings: string[];
} {
    let raw = rawText.trim();

    // Auto-extract JSON from markdown code blocks (AI agents often wrap in ```json ... ```)
    const codeBlockRe = /```(?:json)?\s*\n([\s\S]*?)\n```/;
    const codeBlockMatch = codeBlockRe.exec(raw);
    if (codeBlockMatch) raw = codeBlockMatch[1].trim();

    const data = JSON.parse(raw);

    if (!Array.isArray(data.slides) || data.slides.length === 0) {
        throw new Error('Invalid carousel JSON: "slides" array is missing or empty');
    }

    // ── Auto-fix common AI mistakes ──
    const warnings: string[] = [];
    const fixedSlides: Slide[] = data.slides.map((s: Record<string, unknown>, i: number) => {
        const fixed: Record<string, unknown> = { id: uid() };

        // Fix wrong field names
        const type = (s.type || s.slideType || 'content') as string;
        const validTypes = ['hook', 'content', 'code', 'cta'];
        fixed.type = validTypes.includes(type) ? type : 'content';
        if (fixed.type !== s.type) warnings.push(`Slide ${i + 1}: type "${s.type as string ?? ''}" → "${fixed.type as string}"`);

        // Title: accept title, heading, header
        fixed.title = s.title || s.heading || s.header;

        // Subtitle
        fixed.subtitle = s.subtitle || s.subheading;

        // Body: accept body, text, content, bullets, points
        const bodyRaw = s.body || s.text || s.content || s.bullets || s.points;
        if (typeof bodyRaw === 'string') {
            fixed.body = bodyRaw;
        } else if (Array.isArray(bodyRaw)) {
            // AI sometimes gives bullets as an array
            fixed.body = (bodyRaw as string[]).map(formatBullet).join('\n');
            warnings.push(`Slide ${i + 1}: converted bullets array to string`);
        }

        // Code: accept code, codeBlock, snippet
        fixed.code = s.code || s.codeBlock || s.snippet;

        // Code language: accept codeLang, language, lang
        fixed.codeLang = s.codeLang || s.language || s.lang;

        // Code text above/below: accept various names
        fixed.codeTextAbove = s.codeTextAbove || s.textAbove || s.heading_text || s.description;
        fixed.codeTextBelow = s.codeTextBelow || s.textBelow;

        // Caption
        fixed.codeCaption = s.codeCaption || s.caption;

        // Strip undefined values
        for (const key of Object.keys(fixed)) {
            if (fixed[key] === undefined) delete fixed[key];
        }

        return fixed as unknown as Slide;
    });

    // Ensure hook first and CTA last if not already
    if (fixedSlides[0].type !== 'hook' && fixedSlides.some(s => s.type === 'hook')) {
        const hookIdx = fixedSlides.findIndex(s => s.type === 'hook');
        const [hook] = fixedSlides.splice(hookIdx, 1);
        fixedSlides.unshift(hook);
        warnings.push('Moved hook slide to position 1');
    }
    // eslint-disable-next-line unicorn/prefer-at -- lib target lacks .at()
    const lastSlide = fixedSlides[fixedSlides.length - 1];
    if (lastSlide.type !== 'cta' && fixedSlides.some(s => s.type === 'cta')) {
        const ctaIdx = fixedSlides.findIndex(s => s.type === 'cta');
        const [cta] = fixedSlides.splice(ctaIdx, 1);
        fixedSlides.push(cta);
        warnings.push('Moved CTA slide to last position');
    }

    const importedConfig: CarouselConfig = data.config
        ? { ...DEFAULT_CONFIG, ...data.config }
        : { ...DEFAULT_CONFIG };

    return { config: importedConfig, slides: fixedSlides, warnings };
}

/**
 * Serialize a carousel (config + slides) to a pretty-printed JSON string.
 * Strips the runtime `id` field from each slide.
 */
export function serializeCarousel(config: CarouselConfig, slides: Slide[]): string {
    const payload = {
        $schema: 'carousel-magic-v2',
        config,
        slides: slides.map(({ id: _id, ...rest }) => rest),
    };
    return JSON.stringify(payload, null, 2);
}
