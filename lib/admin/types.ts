export type Lang = 'nl' | 'en'

export type MediaAsset = {
  id: string
  url: string
  pathname?: string
  title: string
  altNl?: string
  altEn?: string
  tags?: string[]
  usage?: string[]
  focalPoint?: string
  contentType?: string
  size?: number
  createdAt: string
  updatedAt?: string
  recommendedPageUsage?: string[]
  fallbackPriority?: number
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
  fullDescriptionNl?: string
  fullDescriptionEn?: string
  ticketUrl?: string
  featured?: boolean
  eventType?: 'regular' | 'featured' | 'special' | 'private'
  showDetailCTA?: boolean
  published?: boolean
  imageId?: string
  imageUrl?: string
  imageAlt?: string
  imagePosition?: string
  galleryImageIds?: string[]
  relatedAlbumId?: string
}

export type Faq = { id: string; pageKey: string; language: Lang; question: string; answer: string; published: boolean; order: number }
export type PageContent = { slug: string; heroTitle?: string; heroSubtitle?: string; price?: string; minimumGroupSize?: number; capacity?: string; ctaLabel?: string; secondaryCtaLabel?: string; body?: string; faqs?: { question: string; answer: string }[]; images?: { url: string; alt?: string; focalPoint?: string }[] }
export type PageGalleryImage = { imageId: string; imageUrl: string; altNl?: string; altEn?: string; order: number }
export type EditablePage = { key: string; titleNl: string; titleEn: string; heroTitleNl?: string; heroTitleEn?: string; heroSubtitleNl?: string; heroSubtitleEn?: string; bodyNl?: string; bodyEn?: string; primaryCtaNl?: string; primaryCtaEn?: string; secondaryCtaNl?: string; secondaryCtaEn?: string; heroImageId?: string; heroImageUrl?: string; galleryImageIds?: string[]; galleryImages?: PageGalleryImage[]; price?: string; minimumGroupSize?: number; capacity?: string }
export type AlbumPhoto = { imageId: string; imageUrl: string; altNl?: string; altEn?: string; order: number }
export type PhotoAlbum = { id: string; slug: string; titleNl: string; titleEn?: string; descriptionNl?: string; descriptionEn?: string; date: string; relatedEventId?: string; coverImageId?: string; coverImageUrl?: string; imageIds: string[]; photos?: AlbumPhoto[]; published: boolean; createdAt: string; updatedAt?: string }
export type DjImage = { id: string; name: string; slug: string; aliases: string[]; imageId?: string; imageUrl: string | null; imageAltNl: string; imageAltEn: string; active: boolean; updatedAt: string }
export type SeoSettings = { pageKey: string; language: Lang; seoTitle?: string; metaDescription?: string; ogTitle?: string; ogDescription?: string; socialImageId?: string; canonicalUrl?: string }
export type LeadType = 'contact' | 'workshop' | 'event_space' | 'job'
export type LeadStatus = 'new' | 'contacted' | 'handled'
export type Lead = { id: string; type: LeadType; createdAt: string; submittedAt: string; formType?: LeadType | 'event-space'; status: LeadStatus; sourcePage: string; name: string; email: string; phone?: string; message?: string; payload: Record<string, unknown>; notes?: string }
export type Job = { _id: string; title: string; type?: string; description?: string; requirements?: string[]; published?: boolean }
export type SiteSettings = { phone: string; email: string; whatsapp: string; address: string; openingHours: string[]; instagram: string; tiktok: string }
export type AnalyticsEvent = { id: string; type: string; path?: string; label?: string; createdAt: string }

export type AdminStore = {
  media: MediaAsset[]
  events: AgendaEvent[]
  pages: EditablePage[]
  faqs: Faq[]
  albums: PhotoAlbum[]
  seo: SeoSettings[]
  djImages: DjImage[]
  leads: Lead[]
  jobs: Job[]
  settings: SiteSettings
  analytics: AnalyticsEvent[]
}
