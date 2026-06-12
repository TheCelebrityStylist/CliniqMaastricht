import type { Metadata } from 'next'
import { COPY } from '@/lib/content'

export const metadata: Metadata = {
  title: 'Huisregels | CLINIQ Maastricht',
  description: 'De huisregels van Cliniq Maastricht. Minimumleeftijd, dresscode, rookbeleid en meer. Lees voor je komst wat er van je wordt verwacht.',
  alternates: {
    canonical: 'https://www.cliniqmaastricht.nl/house-rules',
  },
}

const rules = COPY.nl.houseRules.rules
export default function HouseRulesPage(){return <section className="container-premium py-28"><p className="eyebrow">Huisregels</p><h1 className="h1 mt-4">House rules</h1><div className="mt-10 grid gap-4">{rules.map((rule,i)=><article key={rule} className="luxury-panel rounded-3xl p-6"><h2 className="text-xl font-black">{String(i+1).padStart(2,'0')}</h2><p className="mt-3 text-lg leading-8 text-white/72">{rule}</p></article>)}</div></section>}
