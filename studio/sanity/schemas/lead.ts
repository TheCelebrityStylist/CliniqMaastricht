import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'lead',
  title: 'Lead / Form Submission',
  type: 'document',
  fields: [
    defineField({ name: 'type', title: 'Type', type: 'string', options: { list: [
      { title: 'Contact', value: 'contact' },
      { title: 'Workshop', value: 'workshop' },
      { title: 'Event Space', value: 'eventSpace' },
      { title: 'Job', value: 'job' },
    ] } }),
    defineField({ name: 'status', title: 'Status', type: 'string', initialValue: 'new', options: { list: [
      { title: 'New', value: 'new' },
      { title: 'Contacted', value: 'contacted' },
      { title: 'Handled', value: 'handled' },
    ] } }),
    defineField({ name: 'name', title: 'Name', type: 'string' }),
    defineField({ name: 'email', title: 'Email', type: 'string' }),
    defineField({ name: 'phone', title: 'Phone', type: 'string' }),
    defineField({ name: 'message', title: 'Message', type: 'text', rows: 5 }),
    defineField({ name: 'sourcePage', title: 'Source page', type: 'string' }),
    defineField({ name: 'submittedAt', title: 'Submitted at', type: 'datetime' }),
    defineField({ name: 'payload', title: 'Payload JSON', type: 'text', rows: 6 }),
    defineField({ name: 'internalNotes', title: 'Internal notes', type: 'text', rows: 4 }),
  ],
  preview: { select: { title: 'name', subtitle: 'email' } },
})
