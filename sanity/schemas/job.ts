import { defineField, defineType } from 'sanity'
export default defineType({ name:'job', title:'Vacatures / Jobs', type:'document', fields:[
  defineField({ name:'title', title:'Role title', type:'string', validation:r=>r.required() }),
  defineField({ name:'type', title:'Type', type:'string' }),
  defineField({ name:'description', title:'Description', type:'text', rows:4 }),
  defineField({ name:'requirements', title:'Requirements', type:'array', of:[{ type:'string' }] }),
  defineField({ name:'published', title:'Published', type:'boolean', initialValue:true }),
] })
