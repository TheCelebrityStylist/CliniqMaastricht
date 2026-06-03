import { defineField, defineType } from 'sanity'
export default defineType({ name:'galleryImage', title:'Gallery images', type:'document', fields:[
  defineField({ name:'title', title:'Title', type:'string' }),
  defineField({ name:'image', title:'Image', type:'image', options:{ hotspot:true }, fields:[{ name:'alt', title:'Alt text', type:'string' }] }),
  defineField({ name:'category', title:'Category', type:'string', options:{ list:['nightlife','cocktail-workshop','event-space','artists'] } }),
  defineField({ name:'published', title:'Published', type:'boolean', initialValue:true }),
] })
