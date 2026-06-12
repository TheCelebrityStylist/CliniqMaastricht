import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'faq',
  title: 'FAQ',
  type: 'document',
  fields: [
    defineField({ name: 'pageKey', title: 'Page', type: 'string', options: { list: ['homepage', 'uitgaan', 'cocktailWorkshop', 'eventSpace', 'contact', 'vacatures', 'houseRules', 'fotos'] } }),
    defineField({ name: 'questionNl', title: 'Question NL', type: 'string' }),
    defineField({ name: 'questionEn', title: 'Question EN', type: 'string' }),
    defineField({ name: 'answerNl', title: 'Answer NL', type: 'text', rows: 4 }),
    defineField({ name: 'answerEn', title: 'Answer EN', type: 'text', rows: 4 }),
    defineField({ name: 'order', title: 'Order', type: 'number', initialValue: 0 }),
    defineField({ name: 'published', title: 'Published', type: 'boolean', initialValue: true }),
  ],
})
