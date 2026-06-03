import { defineField, defineType } from 'sanity'
export default defineType({ name:'artist', title:'Artists / DJs', type:'document', fields:[
  defineField({ name:'name', title:'Name', type:'string', validation:r=>r.required() }),
  defineField({ name:'role', title:'Role', type:'string' }),
  defineField({ name:'photo', title:'Photo', type:'image', options:{ hotspot:true } }),
  defineField({ name:'bio', title:'Short bio', type:'text', rows:4 }),
  defineField({ name:'instagram', title:'Instagram', type:'url' }),
  defineField({ name:'soundcloud', title:'Music / SoundCloud', type:'url' }),
  defineField({ name:'published', title:'Published', type:'boolean', initialValue:true }),
] })
