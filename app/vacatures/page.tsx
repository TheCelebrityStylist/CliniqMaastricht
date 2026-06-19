import type { Metadata } from 'next'
import InquiryForm from '@/components/forms/InquiryForm'
import SafeImage from '@/components/ui/SafeImage'
import { getJobs } from '@/lib/admin/public'
import { images } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Vacatures Maastricht Horeca & Nachtclub | Werken bij CLINIQ',
  description:
    'Werken bij CLINIQ Maastricht? Bekijk horeca vacatures voor bartender, runner, host, event medewerker en open sollicitaties in het centrum van Maastricht.',
  alternates: {
    canonical: 'https://www.cliniqmaastricht.nl/vacatures',
  },
}

const roleCards = [
  {
    title: 'Bartender',
    text: 'Drankjes maken, gasten helpen en tempo houden achter de bar.',
    tags: ['Avondwerk', 'Team', 'Tempo'],
  },
  {
    title: 'Runner',
    text: 'Ondersteunen achter de schermen, aanvullen, opruimen en zorgen dat alles blijft lopen.',
    tags: ['Praktisch', 'Snel', 'Team'],
  },
  {
    title: 'Host / Entree',
    text: 'Gasten ontvangen, sfeer aanvoelen en bijdragen aan een veilige binnenkomst.',
    tags: ['Sociaal', 'Gastvrij', 'Verantwoordelijk'],
  },
  {
    title: 'Event medewerker',
    text: 'Meehelpen bij borrels, private events, bedrijfsfeesten en speciale avonden.',
    tags: ['Events', 'Service', 'Afwisselend'],
  },
  {
    title: 'Cocktail workshop host',
    text: 'Groepen begeleiden tijdens workshops en zorgen voor een ontspannen ervaring.',
    tags: ['Cocktails', 'Groepen', 'Presenteren'],
  },
  {
    title: 'Open sollicitatie',
    text: 'Weet je nog niet precies welke rol past? Laat je gegevens achter.',
    tags: ['Flexibel', 'Kennismaken', 'CLINIQ'],
  },
]

const benefits = [
  ['Flexibele uren', 'Ideaal naast studie, werk of andere plannen.'],
  ['Gezellig team', 'Werk met mensen die houden van tempo, muziek en gasten.'],
  ['Midden in de stad', 'Platielstraat 9A, centraal in Maastricht.'],
  ['Geen saaie werkplek', 'Je werkt tijdens avonden die mensen bewust plannen.'],
  ['Leren in de praktijk', 'Ervaring is handig, maar motivatie telt net zo hard.'],
  ['Afwisseling', 'Clubnachten, events, workshops en groepsaanvragen.'],
]

const process = [
  ['Laat je gegevens achter', 'Vertel kort wie je bent en welke rol je aanspreekt.'],
  ['We nemen contact op', 'Als er een match is, plannen we een korte kennismaking.'],
  ['Korte kennismaking', 'We bespreken beschikbaarheid, ervaring en verwachtingen.'],
  ['Meelopen of starten', 'Daarna kijken we hoe je het beste kunt instromen.'],
]

const gallery = [images.bar, images.crowd, images.redCrowd, images.club, images.party, images.workshopBar]

export default async function VacaturesPage() {
  const jobs = await getJobs()

  return (
    <>
      <section className="hero-section relative min-h-[82vh] overflow-hidden pt-36">
        <SafeImage
          src={images.redCrowd}
          fallbackSrc={images.fallbackHero}
          alt="Werken bij CLINIQ Maastricht"
          fill
          priority
          sizes="100vw"
          className="hero-media -z-10 object-cover brightness-[1.08]"
        />

        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black via-black/70 to-black/20" />

        <div className="container-premium py-24">
          <p className="eyebrow mb-4">Werken bij CLINIQ</p>
          <h1 className="h1 max-w-5xl">Werk waar Maastricht uitgaat.</h1>
          <p className="mt-7 max-w-3xl text-xl leading-8 text-white/78">
            Bij CLINIQ werk je niet zomaar een dienst. Je werkt midden in de energie van Maastricht:
            muziek, mensen, events en avonden die blijven hangen.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <a href="#solliciteren" className="btn-primary">
              Solliciteer direct
            </a>
            <a href="#rollen" className="btn-secondary">
              Bekijk rollen
            </a>
          </div>
        </div>
      </section>

      <section className="container-premium grid gap-8 py-24 lg:grid-cols-[.9fr_1.1fr]">
        <div>
          <p className="eyebrow">Niet van negen tot vijf</p>
          <h2 className="h2 mt-4">Een baan met energie.</h2>
          <p className="mt-6 text-lg leading-[1.65] text-white/72 md:text-xl">
            Van drukke clubnachten tot cocktail workshops en private events: geen avond is hetzelfde.
            Je werkt in een team dat gewend is aan tempo, gasten en sfeer.
          </p>
        </div>

        <div className="image-frame min-h-[420px] rounded-[2rem]">
          <SafeImage
            src={images.bar}
            fallbackSrc={images.fallbackWide}
            alt="Team en bar bij CLINIQ Maastricht"
            fill
            sizes="(min-width:1024px) 50vw, 100vw"
            className="object-cover brightness-[1.08]"
          />
        </div>
      </section>

      <section className="container-premium pb-24">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {['Midden in Maastricht', 'Donderdag t/m zaterdag', 'Clubnachten & events', 'Flexibele diensten'].map(
            (item) => (
              <div key={item} className="rounded-3xl border border-white/10 bg-white/[0.045] p-6">
                <p className="eyebrow">CLINIQ</p>
                <h3 className="mt-3 text-2xl font-black tracking-[-0.035em]">{item}</h3>
              </div>
            ),
          )}
        </div>
      </section>

      <section id="rollen" className="container-premium pb-24">
        <p className="eyebrow">Rollen</p>
        <h2 className="h2 mt-4">Waar kun je bij helpen?</h2>
        <p className="mt-6 max-w-3xl text-lg leading-[1.65] text-white/72 md:text-xl">
          Ervaring is mooi meegenomen, maar energie, betrouwbaarheid en gastvrijheid zijn belangrijker.
        </p>

        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {(jobs.length ? jobs : roleCards).map((item: any, index) => {
            const title = item.title
            const text = item.description || item.text
            const tags = item.tags || item.requirements?.slice(0, 3) || roleCards[index]?.tags || ['CLINIQ']

            return (
              <article
                key={`${title}-${index}`}
                className="group rounded-[2rem] border border-white/10 bg-white/[0.045] p-6 transition duration-300 hover:-translate-y-1 hover:bg-white/[0.075]"
              >
                <p className="eyebrow">{item.type || 'Team'}</p>
                <h3 className="mt-4 text-3xl font-black tracking-[-0.04em]">{title}</h3>
                <p className="mt-4 text-white/70">{text}</p>

                <div className="mt-6 flex flex-wrap gap-2">
                  {tags.map((tag: string) => (
                    <span key={tag} className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/60">
                      {tag}
                    </span>
                  ))}
                </div>

                <a href="#solliciteren" className="btn-secondary mt-6">
                  Solliciteer
                </a>
              </article>
            )
          })}
        </div>
      </section>

      <section className="container-premium pb-24">
        <p className="eyebrow">Waarom CLINIQ?</p>
        <h2 className="h2 mt-4">Waarom werken bij CLINIQ?</h2>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map(([title, text]) => (
            <article key={title} className="rounded-3xl border border-white/10 bg-white/[0.045] p-6">
              <h3 className="text-2xl font-black tracking-[-0.035em]">{title}</h3>
              <p className="mt-3 text-white/66">{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="overflow-hidden pb-24">
        <div className="container-premium">
          <p className="eyebrow">Sfeer</p>
          <h2 className="h2 mt-4">Zo voelt werken bij CLINIQ</h2>
          <p className="mt-6 max-w-3xl text-lg leading-[1.65] text-white/72 md:text-xl">
            Een team, een club, veel verschillende avonden.
          </p>
        </div>

        <div className="relative mt-10 overflow-hidden">
          <div className="flex w-max animate-[vacatureMarquee_42s_linear_infinite] gap-5 px-6 hover:[animation-play-state:paused]">
            {[...gallery, ...gallery].map((src, index) => (
              <div
                key={`${src}-${index}`}
                className="image-frame relative h-[420px] w-[320px] shrink-0 overflow-hidden rounded-[2rem] border border-white/10 sm:w-[420px] lg:w-[500px]"
              >
                <SafeImage
                  src={src}
                  fallbackSrc={images.fallbackWide}
                  alt={`Werken bij CLINIQ sfeerbeeld ${index + 1}`}
                  fill
                  sizes="(min-width:1024px) 500px, 80vw"
                  className="object-cover brightness-[1.08] transition duration-700 hover:scale-105"
                />
              </div>
            ))}
          </div>

          <div className="pointer-events-none absolute inset-y-0 left-0 w-28 bg-gradient-to-r from-[#080607] to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-28 bg-gradient-to-l from-[#080607] to-transparent" />
        </div>

        <style>{`
          @keyframes vacatureMarquee {
            from { transform: translateX(0); }
            to { transform: translateX(-50%); }
          }
        `}</style>
      </section>

      <section className="container-premium pb-24">
        <p className="eyebrow">Proces</p>
        <h2 className="h2 mt-4">Zo werkt solliciteren</h2>

        <div className="mt-10 grid gap-4 md:grid-cols-4">
          {process.map(([title, text], index) => (
            <article key={title} className="rounded-3xl border border-white/10 bg-white/[0.045] p-6">
              <p className="text-4xl font-black text-gold">{index + 1}</p>
              <h3 className="mt-4 text-xl font-black tracking-[-0.03em]">{title}</h3>
              <p className="mt-3 text-white/66">{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="solliciteren" className="container-premium grid gap-8 pb-24 lg:grid-cols-[.8fr_1.2fr]">
        <div>
          <p className="eyebrow">Solliciteren</p>
          <h2 className="h2 mt-4">Laat van je horen.</h2>
          <p className="mt-6 text-lg leading-[1.65] text-white/72">
            Vertel kort wie je bent, waar je naar zoekt en wanneer je beschikbaar bent. We nemen contact
            met je op als er een passende plek is.
          </p>

          <ul className="mt-8 space-y-3 text-white/72">
            {['Flexibele diensten', 'Avond- en weekendwerk', 'Centrum Maastricht', 'Ervaring niet altijd nodig'].map(
              (item) => (
                <li key={item}>✓ {item}</li>
              ),
            )}
          </ul>
        </div>

        <InquiryForm
          type="job"
          fields={[
            { name: 'name', label: 'Naam', required: true },
            { name: 'email', label: 'E-mail', type: 'email', required: true },
            { name: 'phone', label: 'Telefoon' },
            { name: 'role', label: 'Gewenste rol' },
            { name: 'message', label: 'Motivatie', required: true },
          ]}
        />
      </section>
    </>
  )
}
