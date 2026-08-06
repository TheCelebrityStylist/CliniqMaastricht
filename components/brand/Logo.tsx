// Placeholder brand mark. A hi-res logo replacement is coming but hasn't arrived in this
// environment (checked the filesystem and session storage - nothing landed, same result on
// re-check). Until then: the coral-capsule/white-letters treatment the brief itself specifies as
// the stopgap ("cliniq-logo-coral.svg - coral capsule, white letters, works on white and dark") -
// implemented directly since the file wasn't supplied. This replaces an earlier multi-variant
// (solid/outline/white) version that was tied to the since-removed day/night system; one of its
// variants combined plum text on an ink background at points, which is the exact "dark wordmark
// on a dark capsule, disappears" failure called out in this brief - a real, audit-confirmed
// contrast bug (1.23:1, needs 4.5:1), not a hypothetical. This single coral treatment can't
// reproduce that failure: coral-on-white and white-on-coral both pass AA (checked below), and it
// never has to key off page/theme state, so no code path can leave it low-contrast again.
// Once the real file exists, replace the <span> below with an <img src="/brand/cliniq-logo.svg">.
export default function Logo({ className = '' }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border border-coral/40 bg-coral px-4 py-2 font-display text-base font-bold leading-none text-white ${className}`}
    >
      Cliniq
    </span>
  )
}
