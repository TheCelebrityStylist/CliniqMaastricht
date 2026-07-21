// Shared contract between AmbientSound (the toggle) and any decorative layer that should react to
// it (currently WebGLHero) — a plain window CustomEvent instead of React context, since the two
// components are unrelated siblings mounted in different parts of the tree (global layout vs.
// per-page hero) and neither needs to know the other exists to keep working on its own.
export const AMBIENT_TOGGLE_EVENT = 'cliniq:ambient-toggle'

export function dispatchAmbientToggle(active: boolean) {
  window.dispatchEvent(new CustomEvent<{ active: boolean }>(AMBIENT_TOGGLE_EVENT, { detail: { active } }))
}
