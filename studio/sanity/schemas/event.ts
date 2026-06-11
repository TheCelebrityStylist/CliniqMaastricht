import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'event',
  title: 'Event',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Event/DJ name', type: 'string', validation: (Rule: any) => Rule.required() }),
    defineField({ name: 'slug', title: 'Slug', type: 'slug', options: { source: (doc: any) => `${doc.date || ''}-${doc.title || ''}` }, validation: (Rule: any) => Rule.required() }),
    defineField({ name: 'date', title: 'Date', type: 'date', validation: (Rule: any) => Rule.required() }),
    defineField({ name: 'dj', title: 'DJ', type: 'reference', to: [{ type: 'dj' }] }),
    defineField({ name: 'customTitleNl', title: 'Custom title NL', type: 'string' }),
    defineField({ name: 'customTitleEn', title: 'Custom title EN', type: 'string' }),
    defineField({ name: 'eventType', title: 'Event type', type: 'string', initialValue: 'regular', options: { list: [
      { title: 'Regular', value: 'regular' },
      { title: 'Featured', value: 'featured' },
      { title: 'Special', value: 'special' },
      { title: 'Private', value: 'private' },
    ] } }),
    defineField({ name: 'openingTime', title: 'Opening time', type: 'string', initialValue: '22:00' }),
    defineField({ name: 'closingTime', title: 'Closing time', type: 'string', initialValue: '03:00' }),
    defineField({ name: 'minimumAge', title: 'Minimum age', type: 'string', initialValue: '21+' }),
    defineField({ name: 'published', title: 'Published', type: 'boolean', initialValue: true }),
    defineField({ name: 'featured', title: 'Featured', type: 'boolean', initialValue: false }),
    defineField({ name: 'showDetailPage', title: 'Show detail page', type: 'boolean', initialValue: false }),
    defineField({ name: 'eventImage', title: 'Custom event image', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'descriptionNl', title: 'Description NL', type: 'text', rows: 4 }),
    defineField({ name: 'descriptionEn', title: 'Description EN', type: 'text', rows: 4 }),
    defineField({ name: 'ticketUrl', title: 'Ticket/detail URL', type: 'url' }),
    defineField({ name: 'album', title: 'Related album', type: 'reference', to: [{ type: 'album' }] }),
  ],
  preview: { select: { title: 'title', subtitle: 'date', media: 'eventImage' } },
})
