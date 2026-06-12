import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Website title', type: 'string' }),
    defineField({ name: 'address', title: 'Address', type: 'string' }),
    defineField({ name: 'phone', title: 'Phone', type: 'string' }),
    defineField({ name: 'email', title: 'Email', type: 'string' }),
    defineField({ name: 'instagramUrl', title: 'Instagram URL', type: 'url' }),
    defineField({ name: 'tiktokUrl', title: 'TikTok URL', type: 'url' }),
    defineField({ name: 'lockerUrl', title: 'Locker URL', type: 'url' }),
    defineField({ name: 'defaultSeoTitleNl', title: 'Default SEO title NL', type: 'string' }),
    defineField({ name: 'defaultSeoTitleEn', title: 'Default SEO title EN', type: 'string' }),
    defineField({ name: 'defaultSeoDescriptionNl', title: 'Default SEO description NL', type: 'text', rows: 3 }),
    defineField({ name: 'defaultSeoDescriptionEn', title: 'Default SEO description EN', type: 'text', rows: 3 }),
    defineField({ name: 'defaultOgImage', title: 'Default social image', type: 'image', options: { hotspot: true } }),
  ],
})
