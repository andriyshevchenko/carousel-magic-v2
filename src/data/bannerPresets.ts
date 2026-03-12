import type { BannerConfig } from '../types/banner';

/** Pre-built banner configurations for quick starts */
export interface BannerPreset {
    id: string;
    name: string;
    description: string;
    config: Partial<BannerConfig>;
}

export const BANNER_PRESETS: BannerPreset[] = [
    // ── Influencer / Newsletter presets (from reference banners) ──
    {
        id: 'newsletter-cta',
        name: '.NET Newsletter',
        description: 'Newsletter promo with social proof & CTA (like Milan Jovanovic)',
        config: {
            headline: 'Reach the Top 1% of .NET Developers',
            tagline: 'receiving weekly real-world .NET and architecture examples you can apply immediately',
            tags: ['.NET', 'Software architecture', 'Clean Code'],
            layoutId: 'newsletter',
            accentEmoji: '',
            highlightWord: '.NET',
            authorName: 'Your Name',
            authorWebsite: 'yoursite.com',
            socialProof: 'Join 23,000+',
            ctaButtonText: 'Subscribe in my featured section',
            showDecoration: false,
            themeId: 'github-light',
            fontSetId: 'inter-jetbrains',
        },
    },
    {
        id: 'brand-bold',
        name: 'Bold Brand',
        description: 'Bold uppercase brand banner with CTA (like .NET Weekly)',
        config: {
            headline: 'Building Better .NET Applications',
            tagline: 'One Weekly Tip at a Time',
            tags: ['AI', 'Architecture', 'Systems Design', 'Clean Code', 'Developer Growth'],
            layoutId: 'brand-promo',
            accentEmoji: '',
            highlightWord: '.NET',
            authorName: '',
            authorWebsite: '',
            socialProof: '',
            ctaButtonText: "Let's Build Better Software Together",
            showDecoration: true,
            themeId: 'cobalt2',
            fontSetId: 'anton-roboto-fira',
        },
    },
    {
        id: 'minimal-newsletter',
        name: 'Minimal Influencer',
        description: 'Clean minimal with CTA (like pavle.codes)',
        config: {
            headline: 'Commit to improving your engineering skills by 1% each day',
            tagline: '',
            tags: ['.NET', 'Software architecture', 'Database'],
            layoutId: 'newsletter',
            accentEmoji: '',
            highlightWord: '1%',
            authorName: 'yourname',
            authorWebsite: '',
            socialProof: '',
            ctaButtonText: 'Subscribe to my newsletter in feature section',
            showDecoration: false,
            themeId: 'flexoki-light',
            fontSetId: 'dm-sans-ibm-plex',
        },
    },
    // ── Original presets ──
    {
        id: 'tech-blogger',
        name: 'Tech Blogger',
        description: 'Perfect for tech content creators',
        config: {
            headline: 'Software Engineer & Tech Blogger',
            tagline: 'Sharing knowledge about modern web development',
            tags: ['TypeScript', 'React', 'Node.js', 'Cloud', 'AI'],
            layoutId: 'centered',
            accentEmoji: '💻',
            showDecoration: true,
        },
    },
    {
        id: 'cloud-architect',
        name: 'Cloud Architect',
        description: 'For cloud & infrastructure professionals',
        config: {
            headline: 'Cloud Solutions Architect',
            tagline: 'Designing scalable systems on Azure & AWS',
            tags: ['Azure', 'AWS', 'Kubernetes', 'Terraform', 'DevOps'],
            layoutId: 'split',
            accentEmoji: '☁️',
            showDecoration: true,
        },
    },
    {
        id: 'ai-engineer',
        name: 'AI/ML Engineer',
        description: 'For AI and machine learning professionals',
        config: {
            headline: 'AI/ML Engineer',
            tagline: 'Building intelligent systems with LLMs & neural networks',
            tags: ['Python', 'PyTorch', 'LLMs', 'RAG', 'Agents'],
            layoutId: 'gradient-wave',
            accentEmoji: '🧠',
            showDecoration: true,
        },
    },
    {
        id: 'fullstack-dev',
        name: 'Full-Stack Developer',
        description: 'For versatile full-stack developers',
        config: {
            headline: 'Full-Stack Developer',
            tagline: 'From database to deployment — I build it all',
            tags: ['.NET', 'React', 'PostgreSQL', 'Docker', 'CI/CD'],
            layoutId: 'left-aligned',
            accentEmoji: '⚡',
            showDecoration: true,
        },
    },
    {
        id: 'tech-lead',
        name: 'Tech Lead',
        description: 'For engineering leaders',
        config: {
            headline: 'Engineering Lead',
            tagline: 'Leading teams to build great software',
            tags: ['Architecture', 'Mentoring', 'Agile', 'System Design'],
            layoutId: 'minimal',
            accentEmoji: '🎯',
            showDecoration: false,
        },
    },
    {
        id: 'open-source',
        name: 'Open Source Contributor',
        description: 'For open source enthusiasts',
        config: {
            headline: 'Open Source Contributor',
            tagline: 'Building tools the community loves',
            tags: ['GitHub', 'OSS', 'TypeScript', 'Rust', 'Community'],
            layoutId: 'tech-grid',
            accentEmoji: '🌟',
            showDecoration: true,
        },
    },
];
