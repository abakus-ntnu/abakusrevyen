import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/lib/database.types'

let client: SupabaseClient<Database> | null = null

// Lazy initialization lets the app shell run without a configured backend.
export function getSupabaseClient(): SupabaseClient<Database> | null {
  const url = import.meta.env.VITE_SUPABASE_URL?.trim()
  const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY?.trim()

  if (!url || !key || url === 'https://your-project.supabase.co' || key === 'sb_publishable_replace_me') {
    return null
  }

  if (!key.startsWith('sb_publishable_')) {
    throw new Error('Use a Supabase publishable key in the frontend.')
  }

  client ??= createClient<Database>(url, key)
  return client
}
