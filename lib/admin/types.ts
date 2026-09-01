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
  // DJ/act performing, distinct from the event's own name (e.g. event "Amphitryon Inkom Party",
  // djName "Stennis"). Cards and detail-page heroes lead with the event name and show this as a
  // secondary "met {djName}" line. Left unset when the act isn't confirmed - never fabricated.
  djName?: string
  // Per-event overrides for the 5 featured detail pages - each night gets its own eyebrow tag
  // (e.g. "INKOM", "INTERNATIONAL"), title/meta copy, and body already carries the unique angle
  // via fullDescriptionNl/En above. These are optional: non-featured events never set them.
  categoryTagNl?: string
  categoryTagEn?: string
  metaTitleNl?: string
  metaTitleEn?: string
  metaDescriptionNl?: string
  metaDescriptionEn?: string
  showDetailCTA?: boolean
  published?: boolean
  imageId?: string
  imageUrl?: string
  imageAlt?: string
  imagePosition?: string
  // Portrait promo-flyer artwork (title/lineup/deal already baked into the design), used only by
  // the featured-events section - kept distinct from imageUrl (the landscape agenda photo) so the
  // two never get conflated into one grid. Unset when the event has no flyer of its own.
  flyerImageUrl?: string
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
