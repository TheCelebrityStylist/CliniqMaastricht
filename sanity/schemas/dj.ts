import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'dj',
  title: 'DJ',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'DJ name', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({ name: 'slug', title: 'Slug', type: 'slug', options: { source: 'name' }, validation: (Rule) => Rule.required() }),
    defineField({ name: 'aliases', title: 'Aliases', type: 'array', of: [{ type: 'string' }] }),
    defineField({ name: 'image', title: 'DJ image', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'active', title: 'Active', type: 'boolean', initialValue: true }),
  ],
  preview: { select: { title: 'name', media: 'image' } },
})
