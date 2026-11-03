import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router'
import { ArrowUpRight, ChevronDown, Clapperboard, Expand, HelpCircle, LockKeyhole, Maximize, MessageSquare, Minimize, Radio, Ticket, WifiOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ChatPreview } from '@/features/chat/components/chat-preview'
import { getMediaUrl } from '@/features/media/media-url'
import { cn } from '@/lib/utils'
import { previewStates, viewingQuestions, type PreviewState } from './preview-states'
import './livestream.css'

const stageImage = getMediaUrl('images/gallery/skal_skal_ikke/IMG_1056.webp')

export function LivestreamPage() {
  const [previewState, setPreviewState] = useState<PreviewState>('waiting')
  const [isTheater, setIsTheater] = useState(false)
  const [showChat, setShowChat] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [fullscreenError, setFullscreenError] = useState('')
  const playerRef = useRef<HTMLDivElement>(null)
  const theaterRef = useRef<HTMLDialogElement>(null)
  const theaterButtonRef = useRef<HTMLButtonElement>(null)
  const wasTheater = useRef(false)
  const state = previewStates[previewState]
  const StateIcon = previewState === 'purchase' ? LockKeyhole : previewState === 'error' ? WifiOff : previewState === 'replay' || previewState === 'ended' ? Clapperboard : Radio

  useEffect(() => {
    const onFullscreenChange = () => setIsFullscreen(document.fullscreenElement === playerRef.current)
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsTheater(false)
    }
    document.addEventListener('fullscreenchange', onFullscreenChange)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('fullscreenchange', onFullscreenChange)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [])

  useEffect(() => {
    if (!isTheater) {
      if (wasTheater.current) theaterButtonRef.current?.focus()
      wasTheater.current = false
      return
    }

    wasTheater.current = true
    const dialog = theaterRef.current
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    dialog?.showModal()
    return () => {
      dialog?.close()
      document.body.style.overflow = previousOverflow
    }
  }, [isTheater])

  async function toggleFullscreen() {
    setFullscreenError('')
    try {
      if (document.fullscreenElement === playerRef.current) {
        await document.exitFullscreen()
      } else if (playerRef.current?.requestFullscreen) {
        await playerRef.current.requestFullscreen()
      } else {
        setFullscreenError('Fullskjerm er ikke tilgjengelig i denne nettleseren. Prøv kinomodus i stedet.')
      }
    } catch {
      setFullscreenError('Kunne ikke åpne fullskjerm. Prøv kinomodus i stedet.')
    }
  }

  const page = (
    <div className="livestream-page w-full px-4 pb-12 pt-5 sm:px-6 lg:px-12">
      <p className="mb-4 text-xs text-muted-foreground">Forhåndsvisning. Ingen sending eller betaling er koblet til.</p>

      <div className={cn('livestream-viewer grid items-start gap-0 overflow-hidden rounded-xl border bg-card', showChat && 'livestream-with-chat lg:grid-cols-[minmax(0,1fr)_21rem]')}>
        <div className="livestream-video-column min-w-0">
          <div ref={playerRef} className="livestream-stage relative isolate flex w-full min-w-0 flex-col bg-[#0d0d0d] text-white" aria-label="Avspillingsområde">
            <img src={stageImage} alt="" className="absolute inset-0 -z-20 size-full object-cover opacity-35" />
            <div className="livestream-stage-shade absolute inset-0 -z-10" />
            <div className="flex items-center justify-between gap-4 p-4 sm:p-6">
              <span className="inline-flex items-center gap-2 rounded-sm bg-black/55 px-2.5 py-1.5 text-xs font-medium">
                <span className={cn('size-1.5 rounded-full', previewState === 'live' ? 'bg-red-400' : 'bg-white/60')} aria-hidden="true" />
                {state.status}
              </span>
              <span className="text-xs text-white/70">Abakusrevyen</span>
            </div>

            <div className="flex flex-1 flex-col items-center justify-center px-6 py-8 text-center sm:px-10" aria-live="polite" aria-atomic="true">
              <StateIcon className="mb-5 size-7 text-white/75" strokeWidth={1.5} aria-hidden="true" />
              <h2 className="max-w-xl text-balance font-heading text-3xl font-semibold tracking-tight sm:text-4xl lg:text-[clamp(1.8rem,3vw,3rem)]">{state.title}</h2>
              <p className="mt-4 max-w-md text-pretty text-sm leading-6 text-white/80 sm:text-base">{state.description}</p>
              {previewState === 'purchase' ? (
                <div className="mt-6">
                  <Button disabled size="lg"><Ticket aria-hidden="true" /> Kjøp tilgang</Button>
                  <p className="mt-2 text-xs text-white/70">Innlogging og kjøp er ikke tilgjengelig ennå.</p>
                </div>
              ) : null}
            </div>

            <div className="flex min-h-14 flex-wrap items-center justify-between gap-2 border-t border-white/10 bg-black/45 px-3 py-2 sm:px-5">
              <span className="inline-flex items-center gap-2 px-1 text-xs text-white/75"><LockKeyhole className="size-3.5" aria-hidden="true" /> Avspilling kommer</span>
              <div className="flex items-center gap-1">
                <button ref={theaterButtonRef} type="button" className="livestream-player-button livestream-theater-button" aria-label={isTheater ? 'Avslutt kinomodus' : 'Kinomodus'} aria-pressed={isTheater} title={isTheater ? 'Avslutt kinomodus (Esc)' : 'Kinomodus'} onClick={() => setIsTheater(!isTheater)}>
                  {isTheater ? <Minimize aria-hidden="true" /> : <Expand aria-hidden="true" />}
                </button>
                <button type="button" className="livestream-player-button" aria-label={showChat ? 'Skjul chat' : 'Vis chat'} aria-expanded={showChat} aria-controls="livestream-chat" title={showChat ? 'Skjul chat' : 'Vis chat'} onClick={() => setShowChat(!showChat)}><MessageSquare aria-hidden="true" /></button>
                <button type="button" className="livestream-player-button" aria-label={isFullscreen ? 'Avslutt fullskjerm' : 'Fullskjerm'} title={isFullscreen ? 'Avslutt fullskjerm' : 'Fullskjerm'} onClick={toggleFullscreen}><Maximize aria-hidden="true" /></button>
              </div>
            </div>
          </div>

          {fullscreenError ? <p role="status" className="border-b px-5 py-3 text-sm text-muted-foreground">{fullscreenError}</p> : null}

          <header className="flex items-start gap-4 px-5 py-5 sm:px-6">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-full border bg-background sm:size-14"><img src={getMediaUrl('images/revy-logo.webp')} alt="" className="size-8 sm:size-9" /></div>
            <div className="min-w-0 flex-1">
              <h1 className="font-heading text-xl font-semibold tracking-tight sm:text-2xl">Abakusrevyen livestream</h1>
              <p className="mt-3 inline-flex items-center gap-1.5 text-xs text-muted-foreground"><StateIcon className="size-3.5" aria-hidden="true" />{previewState === 'waiting' || previewState === 'purchase' ? 'Neste sendetid annonseres her' : state.status}</p>
            </div>
          </header>
        </div>

        <aside id="livestream-chat" aria-label="Chat til forestillingen" hidden={!showChat} className="livestream-chat-slot min-w-0 border-t bg-background p-3 lg:self-stretch lg:border-l lg:border-t-0">
          <ChatPreview />
          <p className="px-2 pb-1 pt-3 text-xs leading-5 text-muted-foreground">Chatten er en egen forhåndsvisning og er ikke koblet til sendingen.</p>
        </aside>
      </div>

      <div className={cn('mt-7 grid gap-8', showChat && 'lg:grid-cols-[minmax(0,1fr)_21rem]')}>
        <div className="min-w-0">
          <section aria-labelledby="broadcast-info-title" className="border-b pb-6">
            <h2 id="broadcast-info-title" className="text-base font-semibold">Om sendingen</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">Sendetid, pris og informasjon om opptak legges ut før neste forestilling.</p>
            <Link to="/revyer" className="mt-5 inline-block rounded-sm text-sm font-medium text-primary hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring">Se tidligere revyer</Link>
          </section>
          <section aria-labelledby="viewing-help-title" className="pt-5">
            <h2 id="viewing-help-title" className="mb-2 text-base font-semibold">Greit å vite</h2>
            {viewingQuestions.map(({ question, answer }) => (
              <details key={question} className="group border-b py-3">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-sm text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring">{question}<ChevronDown className="size-4 shrink-0 text-muted-foreground group-open:rotate-180" aria-hidden="true" /></summary>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">{answer}</p>
              </details>
            ))}
          </section>
        </div>

        <div className="text-sm">
          <div className="flex items-center gap-2 font-semibold"><HelpCircle className="size-4" aria-hidden="true" /> Trenger du hjelp?</div>
          <p className="mt-2 leading-6 text-muted-foreground">Ta kontakt hvis du lurer på billetter eller sendingen.</p>
          <Link to="/kontakt" className="mt-3 inline-flex items-center gap-1 rounded-sm font-medium text-primary hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring">Kontakt oss<ArrowUpRight className="size-4" aria-hidden="true" /></Link>
          <p className="mt-5 border-t pt-4 text-xs leading-5 text-muted-foreground">Scenebildet er fra «Skal, skal ikke» (2026).</p>
        </div>
      </div>

      {import.meta.env.DEV ? (
        <details className="mt-8 rounded-lg border border-dashed px-4 py-3 text-xs text-muted-foreground">
          <summary className="cursor-pointer font-medium">Utviklingsvisning: bytt tilstand i spilleren</summary>
          <p className="mb-3 mt-2">Eksempeltilstander for å vurdere grensesnittet. Dette gir ingen tilgang og starter ingen sending.</p>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(previewStates) as PreviewState[]).map((key) => <button key={key} type="button" aria-pressed={previewState === key} onClick={() => setPreviewState(key)} className={cn('rounded-md border px-3 py-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring', previewState === key ? 'border-foreground bg-foreground text-background' : 'hover:bg-muted')}>{previewStates[key].label}</button>)}
          </div>
        </details>
      ) : null}
    </div>
  )

  return isTheater ? createPortal(
    <dialog ref={theaterRef} className="livestream-theater" aria-label="Kinomodus" onCancel={(event) => { event.preventDefault(); setIsTheater(false) }}>
      {page}
    </dialog>,
    document.body,
  ) : page
}
