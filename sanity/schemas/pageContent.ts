import { defineField, defineType } from 'sanity'
export default defineType({ name:'pageContent', title:'Page Manager', type:'document', groups:[{ name:'content', title:'Content', default:true }, { name:'media', title:'Media' }, { name:'conversion', title:'Conversion' }], fields:[
  defineField({ name:'title', title:'Internal title', type:'string', validation:r=>r.required(), group:'content' }),
  defineField({ name:'slug', title:'Page slug', type:'slug', validation:r=>r.required(), group:'content' }),
  defineField({ name:'language', title:'Language', type:'string', options:{ list:[{ title:'Dutch', value:'nl' }, { title:'English', value:'en' }], layout:'radio' }, initialValue:'nl', group:'content' }),
  defineField({ name:'heroTitle', title:'Hero title', type:'string', group:'content' }),
  defineField({ name:'heroSubtitle', title:'Hero subtitle', type:'text', rows:3, group:'content' }),
  defineField({ name:'description', title:'Main page copy', type:'array', of:[{ type:'block' }], group:'content' }),
  defineField({ name:'heroImage', title:'Hero image', type:'reference', to:[{ type:'mediaAsset' }], group:'media' }),
  defineField({ name:'gallery', title:'Page gallery', type:'array', of:[{ type:'reference', to:[{ type:'mediaAsset' }] }], group:'media' }),
  defineField({ name:'price', title:'Workshop price', type:'string', group:'conversion' }),
  defineField({ name:'minimumGroupSize', title:'Minimum group size', type:'number', group:'conversion' }),
  defineField({ name:'capacity', title:'Event space capacity', type:'string', group:'conversion' }),
  defineField({ name:'ctaLabel', title:'CTA label', type:'string', group:'conversion' }),
  defineField({ name:'ctaEmail', title:'CTA email', type:'string', group:'conversion' }),
  defineField({ name:'facilities', title:'Facilities / included services', type:'array', of:[{ type:'string' }], group:'conversion' }),
  defineField({ name:'eventTypes', title:'Event types', type:'array', of:[{ type:'string' }], group:'conversion' }),
  defineField({ name:'faqs', title:'FAQs', type:'array', of:[{ type:'object', fields:[{ name:'question', type:'string' }, { name:'answer', type:'text' }] }], group:'conversion' }),
] })
