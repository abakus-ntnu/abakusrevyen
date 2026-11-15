import { useEffect, useRef, useState, type FormEvent } from 'react'
import { MessageCircle, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { exampleMessages } from '@/features/chat/data/example-messages'
import { formatMessageTime } from '@/features/chat/format-message-time'
import type { ChatMessage } from '@/features/chat/types'

// Same as the database. TODO: Update this if it changes there
const maxMessageLength = 500

export function ChatPreview() {
  const [messages, setMessages] = useState<ChatMessage[]>(exampleMessages)
  const [draft, setDraft] = useState('')
  const listRef = useRef<HTMLOListElement>(null)

  useEffect(() => {
    const list = listRef.current
    if (list) list.scrollTop = list.scrollHeight
  }, [messages])

  // TODO: Currently only stores it to messages, its not saved to anyone else, if you reset its gone
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const body = draft.trim()
    if (!body) return
    
    // TODO: Replace with the message the database returns once chat is connected; it sets display_name from the profile.
    setMessages([...messages, { id: Date.now(), display_name: 'Deg', body, created_at: new Date().toISOString() }])
    setDraft('')
  } 
  return (
    <section className="flex max-h-128 lg:max-h-none min-h-96 flex-col overflow-hidden rounded-lg border bg-card shadow-sm" aria-labelledby="chat-title">
      <div className="flex items-center gap-3 border-b p-4">
        <MessageCircle className="size-5 text-primary" aria-hidden="true" />
        <div>
          <h2 id="chat-title" className="font-semibold">Chat</h2>
        </div>
      </div>
      <ol ref={listRef} className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto p-4" aria-live="polite">
        {messages.map((message) => (
          <li key={message.id} className="rounded-xl bg-muted p-3 text-sm">
            <p className="flex items-baseline justify-between gap-2">
              <span className="font-medium">{message.display_name}</span>
              <time dateTime={message.created_at} className="text-xs text-muted-foreground">
                {formatMessageTime(message.created_at)}
              </time>
            </p>
            <p className="mt-1 wrap-break-word text-muted-foreground">{message.body}</p>
          </li>
        ))}
      </ol>
      <form className="flex gap-2 border-t p-4" onSubmit={handleSubmit}>
        <label htmlFor="chat-message" className="sr-only">Skriv en melding</label>
        <input
          id="chat-message"
          type="text"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          maxLength={maxMessageLength}
          autoComplete="off"
          placeholder="Skriv en melding"
          className="min-w-0 flex-1 rounded-lg border bg-background px-3 text-sm"
        />
        <Button type="submit" size="icon" disabled={!draft.trim()} aria-label="Send melding">
          <Send aria-hidden="true" />
        </Button>
      </form>
    </section>
  )
}


