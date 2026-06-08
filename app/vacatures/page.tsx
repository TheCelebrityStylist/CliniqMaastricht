import type { Metadata } from 'next'
import InquiryForm from '@/components/forms/InquiryForm'
import { getJobs } from '@/lib/admin/public'
import { COPY } from '@/lib/content'
export const metadata: Metadata = {
  title: 'Vacatures Cliniq Maastricht — Werken in de horeca',
  description: 'Werken bij Cliniq Maastricht? Bekijk onze openstaande vacatures voor barmedewerkers en hospitality personeel. Platielstraat 9A, Maastricht.',
  alternates: {
    canonical: 'https://www.cliniqmaastricht.nl/vacatures',
  },
}

export default async function VacaturesPage(){const jobs=await getJobs();return <section className="container-premium pt-36 pb-24"><p className="eyebrow">Werken bij Cliniq</p><h1 className="h1 mt-5">Vacatures.</h1><p className="prose-premium mt-7 max-w-3xl">{COPY.nl.vacatures.introBody}</p><div className="mt-12 grid gap-6 md:grid-cols-2">{jobs.map(job=><article key={job._id} className="card rounded-[2rem] p-8"><p className="eyebrow">{job.type || 'Team'}</p><h2 className="h3 mt-3">{job.title}</h2><p className="mt-4 text-white/70">{job.description}</p><ul className="mt-5 list-disc pl-5 text-white/70">{job.requirements?.map(r=><li key={r}>{r}</li>)}</ul></article>)}</div><div className="mt-14 grid gap-8 lg:grid-cols-2"><div><h2 className="h2">Solliciteren?</h2><p className="prose-premium mt-5">Laat je gegevens achter en vertel waarom je bij Cliniq past.</p></div><InquiryForm type="job" fields={[{name:'name',label:'Naam',required:true},{name:'email',label:'E-mail',type:'email',required:true},{name:'phone',label:'Telefoon'},{name:'role',label:'Gewenste rol'},{name:'message',label:'Motivatie',required:true}]} /></div></section>}
