import { getMediaUrl } from '@/features/media/media-url'
import { getSupabaseClient } from '@/lib/supabase/client'

export type Revue = {
  year: number
  title: string
  logo: string | null
  videos: Array<{ label: string; url: string }>
}

const videoLabels: Record<string, string> = { full: 'Se forestillingen', act_1: 'Se akt 1', act_2: 'Se akt 2' }

// Revues the visitor may see; RLS hides unrevealed names and unpublished videos.
export async function listRevues(): Promise<Revue[]> {
  const supabase = getSupabaseClient()
  if (!supabase) return []

  const { data, error } = await supabase
    .from('revues')
    .select('year, revue_details(name, poster_path), revue_videos(title, kind, sort_order, video_sources(youtube_video_id))')
    .order('year', { ascending: false })
  if (error) throw error

  return data.flatMap(({ year, revue_details: details, revue_videos: videos }) => details ? [{
    year,
    title: details.name,
    logo: details.poster_path ? getMediaUrl(details.poster_path) : null,
    videos: videos
      .toSorted((a, b) => a.sort_order - b.sort_order)
      .flatMap((video) => video.video_sources.flatMap(({ youtube_video_id: id }) => id
        ? [{ label: videoLabels[video.kind] ?? video.title, url: `https://www.youtube.com/watch?v=${id}` }]
        : [])),
  }] : [])
}
