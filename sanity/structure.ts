import type { StructureResolver } from 'sanity/structure'

const pageItems = [
  ['Homepage', 'homepage'],
  ['Uitgaan', 'uitgaan'],
  ['Cocktail Workshop', 'cocktailWorkshop'],
  ['Ruimte Huren', 'eventSpace'],
  ['Contact', 'contact'],
  ['Vacatures', 'vacatures'],
  ['House Rules', 'houseRules'],
]

export const structure: StructureResolver = (S) => S.list()
  .title('CLINIQ CMS')
  .items([
    S.listItem().title('Website Pages').child(S.list().title('Website Pages').items(pageItems.map(([title, key]) => S.listItem().title(title).child(S.documentList().title(title).schemaType('page').filter('_type == "page" && pageKey == $key').params({ key }))))),
    S.divider(),
    S.listItem().title('Agenda').child(S.list().title('Agenda').items([
      S.listItem().title('Events').child(S.documentTypeList('event').title('Events')),
      S.listItem().title('DJs').child(S.documentTypeList('dj').title('DJs')),
    ])),
    S.listItem().title('Photos').child(S.list().title('Photos').items([
      S.listItem().title('Albums').child(S.documentTypeList('album').title('Albums')),
    ])),
    S.listItem().title('Content').child(S.list().title('Content').items([
      S.listItem().title('FAQs').child(S.documentTypeList('faq').title('FAQs')),
      S.listItem().title('Site Settings').child(S.documentTypeList('siteSettings').title('Site Settings')),
      S.listItem().title('SEO').child(S.documentList().title('Page SEO').schemaType('page').filter('_type == "page"')),
    ])),
    S.listItem().title('Inbox').child(S.list().title('Inbox').items([
      S.listItem().title('Leads / Form Submissions').child(S.documentTypeList('lead').title('Leads / Form Submissions')),
    ])),
  ])
