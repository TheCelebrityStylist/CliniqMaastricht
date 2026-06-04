import { defineField, defineType } from 'sanity'
export default defineType({ name:'formSubmission', title:'Lead Dashboard', type:'document', fields:[
  defineField({ name:'createdAt', title:'Submission date', type:'datetime', readOnly:true }),
  defineField({ name:'formType', title:'Lead type', type:'string', options:{ list:[{ title:'Event Space Inquiry', value:'event-space' }, { title:'Cocktail Workshop Inquiry', value:'workshop' }, { title:'General Contact', value:'contact' }, { title:'Job Application', value:'job' }] } }),
  defineField({ name:'status', title:'Lead status', type:'string', options:{ list:['new','in-progress','handled','archived'], layout:'radio' }, initialValue:'new' }),
  defineField({ name:'sourcePage', title:'Source page', type:'string' }),
  defineField({ name:'name', title:'Name', type:'string' }),
  defineField({ name:'email', title:'Email', type:'string' }),
  defineField({ name:'phone', title:'Phone', type:'string' }),
  defineField({ name:'message', title:'Message', type:'text' }),
  defineField({ name:'payloadJson', title:'All fields (JSON for export/search)', type:'text' }),
  defineField({ name:'handledBy', title:'Handled by', type:'string' }),
  defineField({ name:'notes', title:'Internal notes', type:'text' }),
], preview:{ select:{ title:'name', subtitle:'formType' } } })
