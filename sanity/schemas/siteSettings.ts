import { defineField, defineType } from 'sanity'
export default defineType({ name:'siteSettings', title:'Site settings', type:'document', fields:[
  defineField({ name:'openingHours', title:'Opening hours', type:'array', of:[{ type:'string' }] }),
  defineField({ name:'phone', title:'Phone number', type:'string' }),
  defineField({ name:'email', title:'Email address', type:'string' }),
  defineField({ name:'address', title:'Address', type:'string' }),
  defineField({ name:'whatsapp', title:'WhatsApp URL', type:'url' }),
  defineField({ name:'instagram', title:'Instagram URL', type:'url' }),
  defineField({ name:'tiktok', title:'TikTok URL', type:'url' }),
  defineField({ name:'homepageHighlights', title:'Homepage highlights', type:'array', of:[{ type:'string' }] }),
] })
