import { defineField, defineType } from 'sanity'
export default defineType({ name:'analyticsEvent', title:'Analytics Dashboard', type:'document', fields:[
  defineField({ name:'eventName', title:'Event name', type:'string' }),
  defineField({ name:'path', title:'Page path', type:'string' }),
  defineField({ name:'label', title:'Clicked label', type:'string' }),
  defineField({ name:'createdAt', title:'Created at', type:'datetime' }),
] })
