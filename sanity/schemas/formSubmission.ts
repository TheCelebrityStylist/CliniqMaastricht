import { defineField, defineType } from 'sanity'
export default defineType({ name:'formSubmission', title:'Form submissions', type:'document', readOnly:true, fields:[
  defineField({ name:'formType', title:'Form type', type:'string' }),
  defineField({ name:'name', title:'Name', type:'string' }),
  defineField({ name:'email', title:'Email', type:'string' }),
  defineField({ name:'phone', title:'Phone', type:'string' }),
  defineField({ name:'message', title:'Message', type:'text' }),
  defineField({ name:'payloadJson', title:'All fields (JSON)', type:'text' }),
  defineField({ name:'createdAt', title:'Created at', type:'datetime' }),
] })
