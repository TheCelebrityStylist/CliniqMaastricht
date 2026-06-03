import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'agendaEvent',
  title: 'Agenda Event',
  type: 'document',
  fields: [
    defineField({ name: 'dj',          title: 'DJ / Artiest', type: 'string', validation: r => r.required() }),
    defineField({ name: 'date',        title: 'Datum (DD-MM-YYYY)', type: 'string', validation: r => r.required() }),
    defineField({ name: 'day',         title: 'Dag (bijv. VRIJDAG)', type: 'string' }),
    defineField({ name: 'time',        title: 'Tijden (bijv. 22:00 – 03:00)', type: 'string' }),
    defineField({ name: 'age',         title: 'Leeftijdsgrens (bijv. 21+)', type: 'string' }),
    defineField({ name: 'description', title: 'Beschrijving (optioneel)', type: 'text', rows: 2 }),
    defineField({ name: 'special',     title: 'Label (bijv. SOLD OUT, SPECIAL)', type: 'string' }),
    defineField({ name: 'is_visible',  title: 'Zichtbaar op website', type: 'boolean', initialValue: true }),
  ],
  preview: {
    select: { title: 'dj', subtitle: 'date' },
    prepare({ title, subtitle }) { return { title, subtitle } },
  },
  orderings: [{ title: 'Datum nieuwste', name: 'dateDesc', by: [{ field: 'date', direction: 'desc' }] }],
})
