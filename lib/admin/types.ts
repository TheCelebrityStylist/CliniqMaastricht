export type Lang = 'nl' | 'en'

export type MediaAsset = {
  id: string
  url: string
  title: string
  altNl?: string
  altEn?: string
  usage?: string[]
  createdAt: string
}

export type AgendaEvent = {
  _id: string
  title: string
  titleNl?: string
  titleEn?: string
  subtitle?: string
  subtitleNl?: string
  subtitleEn?: string
  slug?: { current: string }
  date: string
  startTime?: string
  endTime?: string
  ageLimit?: string
  shortDescription?: string
  shortDescriptionNl?: string
  shortDescriptionEn?: string
  fullDescription?: string
  ticketUrl?: string
  featured?: boolean
  published?: boolean
  imageUrl?: string
  imageAlt?: string
  galleryImageIds?: string[]
}

export type Faq = { id: string; pageKey: string; language: Lang; question: string; answer: string; published: boolean; order: number }
export type PageContent = { slug: string; heroTitle?: string; heroSubtitle?: string; price?: string; minimumGroupSize?: number; capacity?: string; ctaLabel?: string; faqs?: { question: string; answer: string }[]; images?: { url: string; alt?: string }[] }
export type EditablePage = { key: string; titleNl: string; titleEn: string; heroTitleNl?: string; heroTitleEn?: string; heroSubtitleNl?: string; heroSubtitleEn?: string; bodyNl?: string; bodyEn?: string; primaryCtaNl?: string; primaryCtaEn?: string; secondaryCtaNl?: string; secondaryCtaEn?: string; heroImageId?: string; galleryImageIds?: string[]; price?: string; minimumGroupSize?: number; capacity?: string }
export type SeoSettings = { pageKey: string; language: Lang; seoTitle?: string; metaDescription?: string; ogTitle?: string; ogDescription?: string; socialImageId?: string; canonicalUrl?: string }
export type Lead = { id: string; createdAt: string; formType: 'contact' | 'workshop' | 'event-space' | 'job'; status: 'new' | 'in-progress' | 'handled' | 'archived'; sourcePage?: string; name: string; email: string; phone?: string; message: string; payload?: Record<string, unknown>; notes?: string }
export type Job = { _id: string; title: string; type?: string; description?: string; requirements?: string[]; published?: boolean }
export type SiteSettings = { phone: string; email: string; whatsapp: string; address: string; openingHours: string[]; instagram: string; tiktok: string }
export type AnalyticsEvent = { id: string; type: string; path?: string; label?: string; createdAt: string }

export type AdminStore = {
  media: MediaAsset[]
  events: AgendaEvent[]
  pages: EditablePage[]
  faqs: Faq[]
  seo: SeoSettings[]
  leads: Lead[]
  jobs: Job[]
  settings: SiteSettings
  analytics: AnalyticsEvent[]
}
