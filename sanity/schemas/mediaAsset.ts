import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'mediaAsset',
  title: 'Media Library',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Image title', type: 'string', validation: r => r.required() }),
    defineField({ name: 'image', title: 'Image', type: 'image', options: { hotspot: true }, validation: r => r.required(), fields: [
      { name: 'alt', title: 'Alt text', type: 'string' },
      { name: 'brightness', title: 'Brightness control', type: 'number', initialValue: 1, description: 'Frontend hint: 1 is normal, 1.1–1.25 brightens dark nightlife images.' },
    ] }),
    defineField({ name: 'usage', title: 'Usage', type: 'array', of: [{ type: 'string' }], options: { list: ['homepage hero', 'nightlife', 'event poster', 'workshop', 'venue hire', 'social image', 'gallery'] } }),
    defineField({ name: 'assignedPages', title: 'Assigned pages', type: 'array', of: [{ type: 'reference', to: [{ type: 'pageContent' }] }] }),
    defineField({ name: 'published', title: 'Available for website', type: 'boolean', initialValue: true }),
  ],
  preview: { select: { title: 'title', media: 'image' } },
})
