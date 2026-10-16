import { LockKeyhole, Radio } from 'lucide-react'
import { PageContainer } from '@/components/layout/page-container'
import { ChatPreview } from '@/features/chat/components/chat-preview'

export function LivestreamPage() {
  return (
    <PageContainer title="Livestream" eyebrow="Forestillingen hjemmefra" intro="Her skal betalende seere kunne se forestillingen og delta i chatten.">
      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,2fr)_minmax(20rem,1fr)]">
        <div className="space-y-5">
          <section className="flex aspect-video flex-col items-center justify-center rounded-lg bg-neutral-950 p-8 text-center text-white shadow-sm">
            <Radio className="size-10 text-primary" aria-hidden="true" />
            <h2 className="mt-5 text-xl font-semibold">Sendingen er ikke i gang</h2>
            <p className="mt-2 max-w-md text-sm text-white/65">Cloudflare Stream kobles til når tilgangs- og betalingsflyten er avklart.</p>
          </section>
          <section className="flex gap-4 rounded-lg border bg-card p-5 shadow-sm">
            <LockKeyhole className="mt-0.5 size-6 shrink-0 text-primary" aria-hidden="true" />
            <div><h2 className="font-semibold">Tilgang er ikke koblet til ennå</h2><p className="mt-1 text-sm leading-6 text-muted-foreground">Dette er en trygg plassholder. Siden gir ikke tilgang til en ekte sending og ber ikke om betaling.</p></div>
          </section>
        </div>
        <ChatPreview />
      </div>
    </PageContainer>
  )
}
