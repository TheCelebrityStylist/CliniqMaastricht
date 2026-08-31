import GalleryLightbox, { LightboxImageButton } from '@/components/interactive/GalleryLightbox'
import SafeImage from '@/components/ui/SafeImage'
import { images } from '@/lib/site'
import type { PilePhoto } from '@/components/experience/PhotoPile'

// Compact tap-to-lightbox strip for the social/ad landing pages - a single row (3-5 photos), not
// the drag-and-throw PhotoPile toy used elsewhere. Sourced from the real duotone-grading pipeline
// (public/photos/nights/ -> scripts/media.mjs -> lib/photoPile.ts), so it's on-brand automatically
// once real photos land there, with no page code to touch. Renders nothing when the pipeline has
// no output yet (this environment has none committed) rather than fabricating placeholder photos.
export default function PhotoStrip({ photos }: { photos: PilePhoto[] }) {
  if (!photos.length) return null
  const strip = photos.slice(0, 5)

  return (
    <section className="container-premium py-10">
      <GalleryLightbox images={strip.map((photo) => ({ src: photo.src800, alt: photo.alt }))}>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
          {strip.map((photo, index) => (
            <LightboxImageButton key={photo.id} index={index} label={photo.alt} className="focus-ring image-frame relative aspect-square block w-full overflow-hidden rounded-2xl">
              <SafeImage src={photo.src400} fallbackSrc={images.fallbackWide} alt={photo.alt} fill sizes="(min-width:640px) 20vw, 33vw" className="object-cover" />
            </LightboxImageButton>
          ))}
        </div>
      </GalleryLightbox>
    </section>
  )
}
