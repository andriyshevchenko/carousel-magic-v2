import { useCallback, useState } from 'react';
import { FONT_SETS } from '../data/fonts';
import type { CarouselConfig, CarouselState, Slide, SlideType } from '../types';

const uid = () => Math.random().toString(36).slice(2, 10);

const DEFAULT_CONFIG: CarouselConfig = {
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

function defaultSlides(): Slide[] {
    return [
        {
            id: uid(),
            type: 'hook',
            title: 'How I Built a Multi-Agent App\nwith Semantic Kernel',
            subtitle: 'A step-by-step walkthrough',
        },
        {
            id: uid(),
            type: 'code',
            code: `// Create the kernel\nvar kernel = Kernel.CreateBuilder()\n    .AddAzureOpenAIChatCompletion(\n        "gpt-4o",\n        endpoint,\n        apiKey\n    )\n    .Build();\n\n// Add plugins\nkernel.Plugins.AddFromType<TimePlugin>();\nkernel.Plugins.AddFromType<WeatherPlugin>();`,
            codeLang: 'csharp',
            codeTextAbove: '# Setting up the Semantic Kernel\n- Install the `Microsoft.SemanticKernel` NuGet package\n- Register your **Azure OpenAI** credentials\n- Configure plugins for your use case',
        },
        {
            id: uid(),
            type: 'content',
            title: 'Why Multi-Agent?',
            body: '• Each agent has a **focused responsibility**\n• Agents collaborate through `shared context`\n• Easier to **test** and **maintain**\n• Scale individual capabilities independently',
        },
        {
            id: uid(),
            type: 'code',
            code: `// Define the agent\nvar agent = new ChatCompletionAgent()\n{\n    Name = "CodeReviewer",\n    Instructions = """\n        You are a senior code reviewer.\n        Focus on: performance, security,\n        and clean code principles.\n        """,\n    Kernel = kernel\n};`,
            codeLang: 'csharp',
            codeTextAbove: '# Defining an Agent\n- Each agent gets a **Name** and **Instructions**\n- The `Kernel` provides LLM + plugin access',
        },
        {
            id: uid(),
            type: 'cta',
            title: 'Follow for more\nAI & .NET content',
            body: 'Like this? Save it for later ↗',
        },
    ];
}

export function useCarousel() {
    const [state, setState] = useState<CarouselState>({
        config: DEFAULT_CONFIG,
        slides: defaultSlides(),
        activeSlideIndex: 0,
    });

    const setConfig = useCallback((partial: Partial<CarouselConfig>) => {
        setState((s: CarouselState) => ({ ...s, config: { ...s.config, ...partial } }));
    }, []);

    const setActiveSlide = useCallback((idx: number) => {
        setState((s: CarouselState) => ({ ...s, activeSlideIndex: Math.max(0, Math.min(idx, s.slides.length - 1)) }));
    }, []);

    const updateSlide = useCallback((id: string, partial: Partial<Slide>) => {
        setState((s: CarouselState) => ({
            ...s,
            slides: s.slides.map((sl: Slide) => sl.id === id ? { ...sl, ...partial } : sl),
        }));
    }, []);

    const addSlide = useCallback((type: SlideType, afterIndex?: number) => {
        const titleMap: Record<SlideType, string | undefined> = {
            hook: 'Your Hook Title',
            cta: 'Follow for more!',
            content: 'Slide Title',
            code: undefined,
        };
        const newSlide: Slide = {
            id: uid(),
            type,
            title: titleMap[type],
            code: type === 'code' ? '// Your code here\nconsole.log("Hello!");' : undefined,
            codeLang: type === 'code' ? 'javascript' : undefined,
            body: type === 'content' ? '• Point one\n• Point two\n• Point three' : undefined,
        };
        setState((s: CarouselState) => {
            const idx = afterIndex === undefined ? s.slides.length : afterIndex + 1;
            const slides = [...s.slides];
            slides.splice(idx, 0, newSlide);
            return { ...s, slides, activeSlideIndex: idx };
        });
    }, []);

    const removeSlide = useCallback((id: string) => {
        setState((s: CarouselState) => {
            const slides = s.slides.filter((sl: Slide) => sl.id !== id);
            if (slides.length === 0) return s;
            const activeSlideIndex = Math.min(s.activeSlideIndex, slides.length - 1);
            return { ...s, slides, activeSlideIndex };
        });
    }, []);

    const moveSlide = useCallback((fromIdx: number, toIdx: number) => {
        setState((s: CarouselState) => {
            const slides = [...s.slides];
            const [moved] = slides.splice(fromIdx, 1);
            slides.splice(toIdx, 0, moved);
            return { ...s, slides, activeSlideIndex: toIdx };
        });
    }, []);

    const loadFromTemplate = useCallback((config: CarouselConfig, slides: Slide[]) => {
        setState({ config, slides, activeSlideIndex: 0 });
    }, []);

    /* ── JSON import / export ── */
    const exportJson = useCallback(() => {
        const payload = {
            $schema: 'carousel-magic-v2',
            config: state.config,
            slides: state.slides.map(({ id: _id, ...rest }: Slide) => rest),
        };
        const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'carousel.json';
        a.click();
        URL.revokeObjectURL(url);
    }, [state.config, state.slides]);

    const importJson = useCallback((file: File) => {
        file.text().then((text) => {
            try {
                const data = JSON.parse(text);
                if (!data.config || !Array.isArray(data.slides)) {
                    alert('Invalid carousel JSON: missing config or slides');
                    return;
                }
                const slides: Slide[] = data.slides.map((s: Omit<Slide, 'id'>) => ({
                    id: uid(),
                    ...s,
                }));
                setState({
                    config: { ...DEFAULT_CONFIG, ...data.config },
                    slides,
                    activeSlideIndex: 0,
                });
            } catch {
                alert('Failed to parse JSON file');
            }
        });
    }, []);

    const currentFont = FONT_SETS.find(f => f.id === state.config.fontSetId) ?? FONT_SETS[0];

    return {
        state,
        config: state.config,
        slides: state.slides,
        activeSlide: state.slides[state.activeSlideIndex],
        activeSlideIndex: state.activeSlideIndex,
        currentFont,
        setConfig,
        setActiveSlide,
        updateSlide,
        addSlide,
        removeSlide,
        moveSlide,
        loadFromTemplate,
        exportJson,
        importJson,
    };
}
