export const siteSettingsQuery = `*[_type == "siteSettings"][0]`

export const pageByKeyQuery = `*[_type == "page" && pageKey == $pageKey][0]`

export const publishedEventsQuery = `*[_type == "event" && published != false && date >= $today] | order(date asc, openingTime asc)`

export const publishedAlbumsQuery = `*[_type == "album" && published == true] | order(date desc)`

export const faqsByPageQuery = `*[_type == "faq" && pageKey == $pageKey && published != false] | order(order asc)`
