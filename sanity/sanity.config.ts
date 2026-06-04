import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './schemas'

export default defineConfig({
  name: 'cliniq-maastricht',
  title: 'Cliniq Maastricht Operating System',
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'placeholder',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  basePath: '/studio',
  plugins: [structureTool({ structure: (S) => S.list().title('Cliniq OS').items([
    S.documentTypeListItem('agendaEvent').title('Events Manager'),
    S.documentTypeListItem('mediaAsset').title('Media Library'),
    S.documentTypeListItem('formSubmission').title('Lead Dashboard'),
    S.documentTypeListItem('analyticsEvent').title('Analytics Dashboard'),
    S.documentTypeListItem('pageContent').title('Page Manager'),
    S.documentTypeListItem('seoSettings').title('SEO Manager'),
    S.documentTypeListItem('siteSettings').title('Site Settings'),
    S.documentTypeListItem('job').title('Jobs'),
    S.documentTypeListItem('galleryImage').title('Legacy Gallery'),
  ]) }), visionTool()],
  schema: { types: schemaTypes },
})
