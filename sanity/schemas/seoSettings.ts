import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'seoSettings',
  title: 'SEO Manager',
  type: 'document',
  fields: [
    defineField({ name: 'pageKey', title: 'Page', type: 'string', options: { list: ['home', 'nightlife', 'cocktail-workshop', 'event-space', 'contact', 'jobs', 'house-rules'] }, validation: r => r.required() }),
    defineField({ name: 'language', title: 'Language', type: 'string', options: { list: [{ title: 'Dutch', value: 'nl' }, { title: 'English', value: 'en' }], layout: 'radio' }, validation: r => r.required() }),
    defineField({ name: 'seoTitle', title: 'SEO title', type: 'string', validation: r => r.max(70) }),
    defineField({ name: 'metaDescription', title: 'Meta description', type: 'text', rows: 3, validation: r => r.max(170) }),
    defineField({ name: 'ogTitle', title: 'Open Graph title', type: 'string' }),
    defineField({ name: 'ogDescription', title: 'Open Graph description', type: 'text', rows: 3 }),
    defineField({ name: 'socialImage', title: 'Social image', type: 'reference', to: [{ type: 'mediaAsset' }] }),
    defineField({ name: 'canonicalUrl', title: 'Canonical URL override', type: 'url' }),
    defineField({ name: 'focusKeywords', title: 'Focus keywords', type: 'array', of: [{ type: 'string' }] }),
  ],
  preview: { select: { title: 'pageKey', subtitle: 'language' } },
})
