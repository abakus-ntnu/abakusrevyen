import { PageContainer } from '@/components/layout/page-container'
import { gallerySections } from '@/features/gallery/data/gallery'
import { getMediaUrl } from '@/features/media/media-url'

const photos = [
  { src: getMediaUrl('images/gruppebilder/skal_skal_ikke.webp'), alt: 'Gruppebilde fra Skal, skal ikke', label: 'Skal, skal ikke · 2026' },
  { src: getMediaUrl('images/gruppebilder/objektivt_sett.webp'), alt: 'Gruppebilde fra Objektivt sett', label: 'Objektivt sett · 2025' },
  { src: getMediaUrl('images/gruppebilder/best_foer.webp'), alt: 'Gruppebilde fra Best før', label: 'Best før · 2024' },
  { src: getMediaUrl('images/gruppebilder/grevens_tid.webp'), alt: 'Gruppebilde fra Grevens tid', label: 'Grevens tid · 2023' },
  { src: getMediaUrl('images/gruppebilder/kult.webp'), alt: 'Gruppebilde fra Kult', label: 'Kult · 2019' },
  { src: getMediaUrl('images/gruppebilder/solidarisk.webp'), alt: 'Gruppebilde fra Solidarisk', label: 'Solidarisk · 2018' },
]

export function GalleryPage() {
  return (
    <PageContainer title="Galleri" eyebrow="Gjennom årene" intro="Allerede publiserte bilder fra tidligere Abakusrevyer.">
      <div className="grid gap-5 md:grid-cols-2">
        {photos.map((photo) => (
          <figure key={photo.src} className="group overflow-hidden rounded-lg border bg-card shadow-sm">
            <img src={photo.src} alt={photo.alt} className="aspect-[16/10] w-full object-cover transition duration-500 group-hover:scale-[1.02]" />
            <figcaption className="px-5 py-4 text-sm font-medium">{photo.label}</figcaption>
          </figure>
        ))}
      </div>
      {gallerySections.map((section) => (
        <section key={section.name} className="mt-16">
          <div className="mb-7 flex items-center gap-5">
            <div className="h-px flex-1 bg-border" />
            <h2 className="font-heading text-2xl font-semibold">{section.name}</h2>
            <div className="h-px flex-1 bg-border" />
          </div>
          <div className="columns-2 gap-3 sm:columns-3 lg:columns-4">
            {section.images.map((src) => (
              <a key={src} href={src} target="_blank" rel="noreferrer" className="group mb-3 block break-inside-avoid overflow-hidden rounded-xl bg-muted">
                <img src={src} alt={`Bilde fra ${section.name}`} loading="lazy" className="w-full transition duration-300 group-hover:scale-[1.03]" />
              </a>
            ))}
          </div>
        </section>
      ))}
    </PageContainer>
  )
}
