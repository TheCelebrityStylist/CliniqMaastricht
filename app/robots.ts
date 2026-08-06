import type { MetadataRoute } from 'next'

// GEO (generative-engine optimisation): explicitly allow the crawlers AI answer engines use to
// retrieve and cite pages, in addition to the classic search crawlers. All body copy, events and
// schema are server-rendered (see hard constraint 4 / scripts/constraint-check), so there's
// nothing to hide from any of them — the win is just making sure none are blocked by default.
const AI_CRAWLERS = [
  'GPTBot', // OpenAI — ChatGPT training/crawling
  'OAI-SearchBot', // OpenAI — ChatGPT search
  'ChatGPT-User', // OpenAI — user-triggered browsing in ChatGPT
  'ClaudeBot', // Anthropic — Claude crawling
  'Claude-SearchBot', // Anthropic — Claude search
  'anthropic-ai', // Anthropic — legacy UA
  'PerplexityBot', // Perplexity
  'Perplexity-User', // Perplexity — user-triggered browsing
  'Google-Extended', // Google — Gemini / AI Overviews training & grounding
  'Applebot-Extended', // Apple Intelligence
  'CCBot', // Common Crawl (feeds many LLM training sets)
  'Bingbot', // Microsoft Bing / Copilot
]

const DISALLOW = ['/api/', '/studio/', '/admin/']

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: [...DISALLOW, '/_next/'] },
      { userAgent: 'Googlebot', allow: '/', disallow: DISALLOW },
      ...AI_CRAWLERS.map((userAgent) => ({ userAgent, allow: '/', disallow: DISALLOW })),
    ],
    sitemap: 'https://www.cliniqmaastricht.nl/sitemap.xml',
    host: 'https://www.cliniqmaastricht.nl',
  }
}
