import type { Metadata } from 'next'
import Logo from '@/components/brand/Logo'

export const metadata: Metadata = { robots: { index: false, follow: false } }

const SWATCHES = [
  { name: 'ink', hex: '#12030A', cls: 'bg-ink', on: 'text-white' },
  { name: 'plum', hex: '#31071B', cls: 'bg-plum', on: 'text-white' },
  { name: 'plum2', hex: '#440A28', cls: 'bg-plum2', on: 'text-white' },
  { name: 'coral', hex: '#DB334C', cls: 'bg-coral', on: 'text-white' },
  { name: 'coral-text', hex: '#E05267', cls: 'bg-coral-text', on: 'text-ink' },
  { name: 'magenta', hex: '#DC48FE', cls: 'bg-magenta', on: 'text-ink' },
  { name: 'white', hex: '#FFFFFF', cls: 'bg-white', on: 'text-ink' },
]

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-white/10 py-14 first:border-t-0 first:pt-0">
      <p className="eyebrow mb-6">{title}</p>
      {children}
    </section>
  )
}

export default function StyleguidePage() {
  return (
    <div className="min-h-screen bg-ink px-6 py-16 text-white md:px-16">
      <div className="mx-auto max-w-5xl">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-white/40">Internal - noindex</p>
        <h1 className="h1 mt-3">Styleguide</h1>
        <p className="mt-4 max-w-xl text-white/60">One-glance review of every token, type size, and component state. Not part of the public site.</p>

        <Section title="Colour tokens">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6">
            {SWATCHES.map((s) => (
              <div key={s.name} className="overflow-hidden rounded-[1.5rem] border border-white/10">
                <div className={`flex h-24 items-end p-3 ${s.cls} ${s.on}`}>
                  <span className="text-xs font-black uppercase tracking-wide">{s.name}</span>
                </div>
                <div className="bg-white/5 p-3 text-xs text-white/50">{s.hex}</div>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Typography">
          <div className="space-y-6">
            <div>
              <h1 className="h1">Uitgaan in Maastricht</h1>
              <p className="mt-1 text-xs text-white/40">.h1 — MuseoModerno</p>
            </div>
            <div>
              <h2 className="h2">Cocktail workshops</h2>
              <p className="mt-1 text-xs text-white/40">.h2 — MuseoModerno</p>
            </div>
            <div>
              <h3 className="h3">Ruimte huren</h3>
              <p className="mt-1 text-xs text-white/40">.h3 — MuseoModerno</p>
            </div>
            <div>
              <p className="font-serif text-3xl italic">Feel it.</p>
              <p className="mt-1 text-xs text-white/40">font-serif italic (Bodoni Moda) — accent words only, never body copy</p>
            </div>
            <div>
              <p className="prose-premium max-w-xl">Body copy sits at 18-20px, 1.65 line-height, white/70 — never grey-on-black mush.</p>
              <p className="mt-1 text-xs text-white/40">.prose-premium — Inter Tight</p>
            </div>
            <div>
              <p className="eyebrow">Eyebrow label</p>
              <p className="mt-1 text-xs text-white/40">.eyebrow — text-coral-text (contrast-safe tint of brand coral, not the raw fill colour)</p>
            </div>
          </div>
        </Section>

        <Section title="Shape language">
          <div className="flex flex-wrap items-center gap-4">
            <Logo />
            <span className="rounded-full border border-white/15 bg-white/5 px-5 py-2 text-xs font-bold uppercase tracking-wide">Pill badge</span>
            <span className="rounded-full border border-coral/40 bg-coral/10 px-5 py-2 text-xs font-bold uppercase tracking-wide text-coral-text">Tag pill</span>
          </div>
        </Section>

        <Section title="Buttons">
          <div className="flex flex-wrap gap-4">
            <button className="btn-primary">Primary</button>
            <button className="btn-secondary">Secondary</button>
            <button className="btn-primary" disabled style={{ opacity: 0.4 }}>Disabled</button>
          </div>
        </Section>

        <Section title="Card">
          <div className="max-w-sm">
            <div className="card rounded-[2rem] p-6">
              <p className="eyebrow">Card eyebrow</p>
              <h3 className="h3 mt-3">Card title</h3>
              <p className="prose-premium mt-3">Card body text at a comfortable size and contrast.</p>
            </div>
          </div>
        </Section>
      </div>
    </div>
  )
}
