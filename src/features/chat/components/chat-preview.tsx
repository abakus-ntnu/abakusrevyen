import { MessageCircle, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'

const exampleMessages = [
  { id: 1, name: 'Revyfan', message: 'Gleder meg til sending!' },
  { id: 2, name: 'Moderator', message: 'Velkommen! Chatten åpner før forestillingen.' },
]

export function ChatPreview() {
  return (
    <section className="flex min-h-96 flex-col overflow-hidden rounded-lg border bg-card shadow-sm" aria-labelledby="chat-title">
      <div className="flex items-center gap-3 border-b p-4">
        <MessageCircle className="size-5 text-primary" aria-hidden="true" />
        <div>
          <h2 id="chat-title" className="font-semibold">Chat</h2>
          <p className="text-xs text-muted-foreground">Forhåndsvisning med eksempelmeldinger</p>
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-4" aria-live="polite">
        {exampleMessages.map((item) => (
          <div key={item.id} className="rounded-xl bg-muted p-3 text-sm">
            <p className="font-medium">{item.name}</p>
            <p className="mt-1 text-muted-foreground">{item.message}</p>
          </div>
        ))}
      </div>
      <form className="flex gap-2 border-t p-4" onSubmit={(event) => event.preventDefault()}>
        <label htmlFor="chat-message" className="sr-only">Skriv en melding</label>
        <input
          id="chat-message"
          type="text"
          disabled
          placeholder="Chatten er ikke koblet til ennå"
          className="min-w-0 flex-1 rounded-lg border bg-muted px-3 text-sm disabled:cursor-not-allowed"
        />
        <Button type="submit" size="icon" disabled aria-label="Send melding">
          <Send aria-hidden="true" />
        </Button>
      </form>
    </section>
  )
}
