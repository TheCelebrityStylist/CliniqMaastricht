import { defineField, defineType } from 'sanity'
export default defineType({ name:'pageContent', title:'Editable page content', type:'document', fields:[
  defineField({ name:'title', title:'Internal title', type:'string', validation:r=>r.required() }),
  defineField({ name:'slug', title:'Page slug', type:'slug', validation:r=>r.required() }),
  defineField({ name:'seoTitle', title:'SEO title', type:'string' }),
  defineField({ name:'seoDescription', title:'SEO description', type:'text', rows:2 }),
  defineField({ name:'price', title:'Workshop price', type:'string' }),
  defineField({ name:'minimumGroupSize', title:'Minimum group size', type:'number' }),
  defineField({ name:'capacity', title:'Event space capacity', type:'string' }),
  defineField({ name:'description', title:'Description', type:'array', of:[{ type:'block' }] }),
  defineField({ name:'facilities', title:'Facilities / included services', type:'array', of:[{ type:'string' }] }),
  defineField({ name:'eventTypes', title:'Event types', type:'array', of:[{ type:'string' }] }),
  defineField({ name:'faqs', title:'FAQs', type:'array', of:[{ type:'object', fields:[{ name:'question', type:'string' }, { name:'answer', type:'text' }] }] }),
  defineField({ name:'images', title:'Images', type:'array', of:[{ type:'image', options:{ hotspot:true }, fields:[{ name:'alt', type:'string', title:'Alt text' }] }] }),
] })
