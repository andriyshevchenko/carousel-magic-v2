import type { CarouselTemplate, CarouselConfig, Slide } from '../types';

const STORAGE_KEY = 'carousel-magic-templates';

export function loadTemplates(): CarouselTemplate[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveTemplate(name: string, config: CarouselConfig, slides: Slide[]): CarouselTemplate {
  const templates = loadTemplates();
  const tmpl: CarouselTemplate = {
    id: Math.random().toString(36).slice(2, 10),
    name,
    createdAt: Date.now(),
    config,
    slides,
  };
  templates.unshift(tmpl);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(templates));
  return tmpl;
}

export function deleteTemplate(id: string): void {
  const templates = loadTemplates().filter(t => t.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(templates));
}
