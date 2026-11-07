import type { Tables } from '@/lib/supabase/database.types'

// Only the fields the chat UI shows; the broadcast "message" event carries the same names.
export type ChatMessage = Pick<Tables<'chat_messages'>, 'id' | 'display_name' | 'body' | 'created_at'>
