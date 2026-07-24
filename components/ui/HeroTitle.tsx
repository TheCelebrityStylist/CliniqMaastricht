// Video-in-headline (component-kit #hero) as a plain server component: the real title's first
// word is photo-filled (background-clip:text over the real hero photo), the rest is outline-only.
// No client JS, no text change - same words, split into two <span>s for the effect.
export default function HeroTitle({ title, fillImage }: { title: string; fillImage: string }) {
  const words = title.trim().split(/\s+/)
  const [first, ...rest] = words

  return (
    <h1 className="hero-clean-title">
      <span className="hero-fill" style={{ '--hero-fill-image': `url(${fillImage})` } as React.CSSProperties}>
        {first}
      </span>
      {rest.length ? (
        <>
          <br />
          <span className="hero-out">{rest.join(' ')}</span>
        </>
      ) : null}
    </h1>
  )
}
