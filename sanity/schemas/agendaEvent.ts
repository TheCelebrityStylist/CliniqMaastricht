import { defineField, defineType } from 'sanity'
export default defineType({ name:'agendaEvent', title:'Agenda / Events', type:'document', fields:[
  defineField({ name:'title', title:'Event title', type:'string', validation:r=>r.required() }),
  defineField({ name:'slug', title:'Slug', type:'slug', options:{ source:'title' } }),
  defineField({ name:'date', title:'Event date', type:'date', validation:r=>r.required() }),
  defineField({ name:'startTime', title:'Start time', type:'string', initialValue:'22:00' }),
  defineField({ name:'endTime', title:'End time', type:'string', initialValue:'03:00' }),
  defineField({ name:'ageLimit', title:'Age limit', type:'string', initialValue:'21+' }),
  defineField({ name:'poster', title:'Event poster / image', type:'image', options:{ hotspot:true }, fields:[{ name:'alt', title:'Alt text', type:'string' }] }),
  defineField({ name:'shortDescription', title:'Short description', type:'text', rows:2 }),
  defineField({ name:'fullDescription', title:'Full description', type:'array', of:[{ type:'block' }] }),
  defineField({ name:'ticketUrl', title:'Ticket / RSVP link', type:'url' }),
  defineField({ name:'featured', title:'Featured event', type:'boolean', initialValue:false }),
  defineField({ name:'status', title:'Visibility status', type:'string', options:{ list:['draft','published'], layout:'radio' }, initialValue:'published' }),
  defineField({ name:'recurring', title:'Recurring event note', type:'string', description:'Optional note, e.g. Every Friday. Duplicate event for each occurrence for best SEO.' }),
], preview:{ select:{ title:'title', subtitle:'date', media:'poster' } } })
