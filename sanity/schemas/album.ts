import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'album',
  title: 'Photo Album',
  type: 'document',
  fields: [
    defineField({ name: 'titleNl', title: 'Title NL', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({ name: 'titleEn', title: 'Title EN', type: 'string' }),
    defineField({ name: 'slug', title: 'Slug', type: 'slug', options: { source: 'titleNl' }, validation: (Rule) => Rule.required() }),
    defineField({ name: 'date', title: 'Date', type: 'date', validation: (Rule) => Rule.required() }),
    defineField({ name: 'coverImage', title: 'Cover image', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'photos', title: 'Photos', type: 'array', of: [{ type: 'object', fields: [
      defineField({ name: 'image', title: 'Image', type: 'image', options: { hotspot: true }, validation: (Rule) => Rule.required() }),
      defineField({ name: 'altNl', title: 'Alt text NL', type: 'string' }),
      defineField({ name: 'altEn', title: 'Alt text EN', type: 'string' }),
    ], preview: { select: { title: 'altNl', media: 'image' }, prepare: ({ title, media }) => ({ title: title || 'Album photo', media }) } }] }),
    defineField({ name: 'relatedEvent', title: 'Related event', type: 'reference', to: [{ type: 'event' }] }),
    defineField({ name: 'published', title: 'Published', type: 'boolean', initialValue: true }),
    defineField({ name: 'seoTitleNl', title: 'SEO title NL', type: 'string' }),
    defineField({ name: 'seoTitleEn', title: 'SEO title EN', type: 'string' }),
    defineField({ name: 'seoDescriptionNl', title: 'SEO description NL', type: 'text', rows: 3 }),
    defineField({ name: 'seoDescriptionEn', title: 'SEO description EN', type: 'text', rows: 3 }),
  ],
  preview: { select: { title: 'titleNl', subtitle: 'date', media: 'coverImage' } },
})
