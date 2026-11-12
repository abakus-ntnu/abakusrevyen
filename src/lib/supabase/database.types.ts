export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      chat_bans: {
        Row: {
          banned_by: string | null
          created_at: string
          expires_at: string | null
          id: string
          reason: string | null
          stream_id: string | null
          user_id: string
        }
        Insert: {
          banned_by?: string | null
          created_at?: string
          expires_at?: string | null
          id?: string
          reason?: string | null
          stream_id?: string | null
          user_id: string
        }
        Update: {
          banned_by?: string | null
          created_at?: string
          expires_at?: string | null
          id?: string
          reason?: string | null
          stream_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_bans_banned_by_fkey"
            columns: ["banned_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_bans_stream_id_fkey"
            columns: ["stream_id"]
            isOneToOne: false
            referencedRelation: "streams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_bans_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_messages: {
        Row: {
          body: string
          created_at: string
          deleted_at: string | null
          deleted_by: string | null
          display_name: string
          id: number
          stream_id: string
          user_id: string
        }
        Insert: {
          body: string
          created_at?: string
          deleted_at?: string | null
          deleted_by?: string | null
          display_name: string
          id?: never
          stream_id: string
          user_id?: string
        }
        Update: {
          body?: string
          created_at?: string
          deleted_at?: string | null
          deleted_by?: string | null
          display_name?: string
          id?: never
          stream_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_deleted_by_fkey"
            columns: ["deleted_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_messages_stream_id_fkey"
            columns: ["stream_id"]
            isOneToOne: false
            referencedRelation: "streams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_messages_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      cloudflare_video_sources: {
        Row: {
          cloudflare_video_id: string
          deleted_at: string | null
          provider: string
          scheduled_deletion_at: string | null
          signed_urls_verified_at: string | null
          source_id: string
        }
        Insert: {
          cloudflare_video_id: string
          deleted_at?: string | null
          provider?: string
          scheduled_deletion_at?: string | null
          signed_urls_verified_at?: string | null
          source_id: string
        }
        Update: {
          cloudflare_video_id?: string
          deleted_at?: string | null
          provider?: string
          scheduled_deletion_at?: string | null
          signed_urls_verified_at?: string | null
          source_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cloudflare_video_sources_source_id_provider_fkey"
            columns: ["source_id", "provider"]
            isOneToOne: false
            referencedRelation: "video_sources"
            referencedColumns: ["id", "provider"]
          },
        ]
      }
      gallery_albums: {
        Row: {
          cover_photo_id: string | null
          created_at: string
          created_by: string | null
          description: string | null
          event_date: string | null
          id: string
          published_at: string | null
          revue_id: string | null
          slug: string
          sort_order: number
          title: string
          updated_at: string
        }
        Insert: {
          cover_photo_id?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          event_date?: string | null
          id?: string
          published_at?: string | null
          revue_id?: string | null
          slug: string
          sort_order?: number
          title: string
          updated_at?: string
        }
        Update: {
          cover_photo_id?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          event_date?: string | null
          id?: string
          published_at?: string | null
          revue_id?: string | null
          slug?: string
          sort_order?: number
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "gallery_albums_cover_photo_id_fkey"
            columns: ["cover_photo_id"]
            isOneToOne: false
            referencedRelation: "gallery_photos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gallery_albums_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gallery_albums_revue_id_fkey"
            columns: ["revue_id"]
            isOneToOne: false
            referencedRelation: "revues"
            referencedColumns: ["id"]
          },
        ]
      }
      gallery_photos: {
        Row: {
          album_id: string
          alt_text: string | null
          caption: string | null
          created_at: string
          height: number | null
          id: string
          photographer: string | null
          sort_order: number
          storage_path: string
          taken_at: string | null
          width: number | null
        }
        Insert: {
          album_id: string
          alt_text?: string | null
          caption?: string | null
          created_at?: string
          height?: number | null
          id?: string
          photographer?: string | null
          sort_order?: number
          storage_path: string
          taken_at?: string | null
          width?: number | null
        }
        Update: {
          album_id?: string
          alt_text?: string | null
          caption?: string | null
          created_at?: string
          height?: number | null
          id?: string
          photographer?: string | null
          sort_order?: number
          storage_path?: string
          taken_at?: string | null
          width?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "gallery_photos_album_id_fkey"
            columns: ["album_id"]
            isOneToOne: false
            referencedRelation: "gallery_albums"
            referencedColumns: ["id"]
          },
        ]
      }
      order_refunds: {
        Row: {
          amount: number
          completed_at: string | null
          id: string
          order_id: string
          provider_refund_id: string
          reason: string
          requested_at: string
          status: string
        }
        Insert: {
          amount: number
          completed_at?: string | null
          id?: string
          order_id: string
          provider_refund_id: string
          reason: string
          requested_at?: string
          status: string
        }
        Update: {
          amount?: number
          completed_at?: string | null
          id?: string
          order_id?: string
          provider_refund_id?: string
          reason?: string
          requested_at?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_refunds_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          amount: number
          cancellation_deadline_at: string | null
          created_at: string
          currency: string
          eligibility_checked_at: string | null
          first_show_at: string | null
          id: string
          paid_at: string | null
          price_type: Database["public"]["Enums"]["user_type"] | null
          refund_requested_at: string | null
          refunded_at: string | null
          revue_id: string
          status: Database["public"]["Enums"]["order_status"]
          stripe_checkout_session_id: string | null
          stripe_payment_intent_id: string | null
          terms_accepted_at: string | null
          terms_version: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          amount: number
          cancellation_deadline_at?: string | null
          created_at?: string
          currency?: string
          eligibility_checked_at?: string | null
          first_show_at?: string | null
          id?: string
          paid_at?: string | null
          price_type?: Database["public"]["Enums"]["user_type"] | null
          refund_requested_at?: string | null
          refunded_at?: string | null
          revue_id: string
          status?: Database["public"]["Enums"]["order_status"]
          stripe_checkout_session_id?: string | null
          stripe_payment_intent_id?: string | null
          terms_accepted_at?: string | null
          terms_version?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          amount?: number
          cancellation_deadline_at?: string | null
          created_at?: string
          currency?: string
          eligibility_checked_at?: string | null
          first_show_at?: string | null
          id?: string
          paid_at?: string | null
          price_type?: Database["public"]["Enums"]["user_type"] | null
          refund_requested_at?: string | null
          refunded_at?: string | null
          revue_id?: string
          status?: Database["public"]["Enums"]["order_status"]
          stripe_checkout_session_id?: string | null
          stripe_payment_intent_id?: string | null
          terms_accepted_at?: string | null
          terms_version?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_revue_id_fkey"
            columns: ["revue_id"]
            isOneToOne: false
            referencedRelation: "revues"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      posts: {
        Row: {
          author_id: string | null
          author_name: string | null
          body: string
          cover_image_path: string | null
          created_at: string
          excerpt: string | null
          id: string
          published_at: string | null
          revue_id: string | null
          slug: string
          title: string
          updated_at: string
        }
        Insert: {
          author_id?: string | null
          author_name?: string | null
          body?: string
          cover_image_path?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          published_at?: string | null
          revue_id?: string | null
          slug: string
          title: string
          updated_at?: string
        }
        Update: {
          author_id?: string | null
          author_name?: string | null
          body?: string
          cover_image_path?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          published_at?: string | null
          revue_id?: string | null
          slug?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "posts_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "posts_revue_id_fkey"
            columns: ["revue_id"]
            isOneToOne: false
            referencedRelation: "revues"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          display_name: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          display_name: string
          id: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
        }
        Relationships: []
      }
      revue_access: {
        Row: {
          granted_at: string
          id: string
          lego_group_id: string | null
          lego_subject: string | null
          order_id: string | null
          revocation_reason: string | null
          revoked_at: string | null
          revue_id: string
          source: string
          user_id: string
          verification_identity_id: string | null
          verified_at: string | null
        }
        Insert: {
          granted_at?: string
          id?: string
          lego_group_id?: string | null
          lego_subject?: string | null
          order_id?: string | null
          revocation_reason?: string | null
          revoked_at?: string | null
          revue_id: string
          source: string
          user_id: string
          verification_identity_id?: string | null
          verified_at?: string | null
        }
        Update: {
          granted_at?: string
          id?: string
          lego_group_id?: string | null
          lego_subject?: string | null
          order_id?: string | null
          revocation_reason?: string | null
          revoked_at?: string | null
          revue_id?: string
          source?: string
          user_id?: string
          verification_identity_id?: string | null
          verified_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "revue_access_order_id_revue_id_fkey"
            columns: ["order_id", "revue_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id", "revue_id"]
          },
          {
            foreignKeyName: "revue_access_revue_id_fkey"
            columns: ["revue_id"]
            isOneToOne: false
            referencedRelation: "revues"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "revue_access_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      revue_details: {
        Row: {
          act_one_video_id: string | null
          act_two_video_id: string | null
          created_at: string
          description: string | null
          featured_video_id: string | null
          full_video_id: string | null
          name: string
          poster_path: string | null
          revue_id: string
          tagline: string | null
          updated_at: string
        }
        Insert: {
          act_one_video_id?: string | null
          act_two_video_id?: string | null
          created_at?: string
          description?: string | null
          featured_video_id?: string | null
          full_video_id?: string | null
          name: string
          poster_path?: string | null
          revue_id: string
          tagline?: string | null
          updated_at?: string
        }
        Update: {
          act_one_video_id?: string | null
          act_two_video_id?: string | null
          created_at?: string
          description?: string | null
          featured_video_id?: string | null
          full_video_id?: string | null
          name?: string
          poster_path?: string | null
          revue_id?: string
          tagline?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "revue_details_act_one_fkey"
            columns: ["act_one_video_id", "revue_id"]
            isOneToOne: false
            referencedRelation: "revue_videos"
            referencedColumns: ["id", "revue_id"]
          },
          {
            foreignKeyName: "revue_details_act_two_fkey"
            columns: ["act_two_video_id", "revue_id"]
            isOneToOne: false
            referencedRelation: "revue_videos"
            referencedColumns: ["id", "revue_id"]
          },
          {
            foreignKeyName: "revue_details_featured_video_fkey"
            columns: ["featured_video_id", "revue_id"]
            isOneToOne: false
            referencedRelation: "revue_videos"
            referencedColumns: ["id", "revue_id"]
          },
          {
            foreignKeyName: "revue_details_full_video_fkey"
            columns: ["full_video_id", "revue_id"]
            isOneToOne: false
            referencedRelation: "revue_videos"
            referencedColumns: ["id", "revue_id"]
          },
          {
            foreignKeyName: "revue_details_revue_id_fkey"
            columns: ["revue_id"]
            isOneToOne: true
            referencedRelation: "revues"
            referencedColumns: ["id"]
          },
        ]
      }
      revue_member_groups: {
        Row: {
          lego_group_id: string
          revue_id: string
        }
        Insert: {
          lego_group_id: string
          revue_id: string
        }
        Update: {
          lego_group_id?: string
          revue_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "revue_member_groups_revue_id_fkey"
            columns: ["revue_id"]
            isOneToOne: false
            referencedRelation: "revues"
            referencedColumns: ["id"]
          },
        ]
      }
      revue_playlists: {
        Row: {
          published_at: string | null
          revue_id: string
          youtube_playlist_id: string
        }
        Insert: {
          published_at?: string | null
          revue_id: string
          youtube_playlist_id: string
        }
        Update: {
          published_at?: string | null
          revue_id?: string
          youtube_playlist_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "revue_playlists_revue_id_fkey"
            columns: ["revue_id"]
            isOneToOne: true
            referencedRelation: "revues"
            referencedColumns: ["id"]
          },
        ]
      }
      revue_prices: {
        Row: {
          amount: number
          currency: string
          revue_id: string
          user_type: Database["public"]["Enums"]["user_type"]
        }
        Insert: {
          amount: number
          currency?: string
          revue_id: string
          user_type: Database["public"]["Enums"]["user_type"]
        }
        Update: {
          amount?: number
          currency?: string
          revue_id?: string
          user_type?: Database["public"]["Enums"]["user_type"]
        }
        Relationships: [
          {
            foreignKeyName: "revue_prices_revue_id_fkey"
            columns: ["revue_id"]
            isOneToOne: false
            referencedRelation: "revues"
            referencedColumns: ["id"]
          },
        ]
      }
      revue_sales: {
        Row: {
          first_show_at: string
          first_show_started_at: string | null
          revue_id: string
          sales_close_at: string | null
          sales_open_at: string | null
          stream_delete_at: string
          stream_retire_at: string
          terms_version: string
        }
        Insert: {
          first_show_at: string
          first_show_started_at?: string | null
          revue_id: string
          sales_close_at?: string | null
          sales_open_at?: string | null
          stream_delete_at: string
          stream_retire_at: string
          terms_version: string
        }
        Update: {
          first_show_at?: string
          first_show_started_at?: string | null
          revue_id?: string
          sales_close_at?: string | null
          sales_open_at?: string | null
          stream_delete_at?: string
          stream_retire_at?: string
          terms_version?: string
        }
        Relationships: [
          {
            foreignKeyName: "revue_sales_revue_id_fkey"
            columns: ["revue_id"]
            isOneToOne: true
            referencedRelation: "revues"
            referencedColumns: ["id"]
          },
        ]
      }
      revue_videos: {
        Row: {
          created_at: string
          description: string | null
          id: string
          kind: string
          poster_path: string | null
          published_at: string | null
          revue_id: string
          show_id: string | null
          sort_order: number
          stream_id: string | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          kind: string
          poster_path?: string | null
          published_at?: string | null
          revue_id: string
          show_id?: string | null
          sort_order?: number
          stream_id?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          kind?: string
          poster_path?: string | null
          published_at?: string | null
          revue_id?: string
          show_id?: string | null
          sort_order?: number
          stream_id?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "revue_videos_revue_id_fkey"
            columns: ["revue_id"]
            isOneToOne: false
            referencedRelation: "revues"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "revue_videos_show_id_revue_id_fkey"
            columns: ["show_id", "revue_id"]
            isOneToOne: false
            referencedRelation: "shows"
            referencedColumns: ["id", "revue_id"]
          },
          {
            foreignKeyName: "revue_videos_stream_id_revue_id_fkey"
            columns: ["stream_id", "revue_id"]
            isOneToOne: false
            referencedRelation: "streams"
            referencedColumns: ["id", "revue_id"]
          },
          {
            foreignKeyName: "revue_videos_stream_show_fkey"
            columns: ["stream_id", "show_id", "revue_id"]
            isOneToOne: false
            referencedRelation: "streams"
            referencedColumns: ["id", "show_id", "revue_id"]
          },
        ]
      }
      revues: {
        Row: {
          created_at: string
          id: string
          is_current: boolean
          name_reveal_at: string | null
          slug: string
          teaser: string | null
          updated_at: string
          visible_from: string | null
          year: number
        }
        Insert: {
          created_at?: string
          id?: string
          is_current?: boolean
          name_reveal_at?: string | null
          slug: string
          teaser?: string | null
          updated_at?: string
          visible_from?: string | null
          year: number
        }
        Update: {
          created_at?: string
          id?: string
          is_current?: boolean
          name_reveal_at?: string | null
          slug?: string
          teaser?: string | null
          updated_at?: string
          visible_from?: string | null
          year?: number
        }
        Relationships: []
      }
      shows: {
        Row: {
          created_at: string
          description: string | null
          doors_open_at: string | null
          ends_at: string | null
          id: string
          is_sold_out: boolean
          revue_id: string
          starts_at: string
          title: string
          updated_at: string
          venue_address: string | null
          venue_map_url: string | null
          venue_name: string | null
          visible_from: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          doors_open_at?: string | null
          ends_at?: string | null
          id?: string
          is_sold_out?: boolean
          revue_id: string
          starts_at: string
          title: string
          updated_at?: string
          venue_address?: string | null
          venue_map_url?: string | null
          venue_name?: string | null
          visible_from?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          doors_open_at?: string | null
          ends_at?: string | null
          id?: string
          is_sold_out?: boolean
          revue_id?: string
          starts_at?: string
          title?: string
          updated_at?: string
          venue_address?: string | null
          venue_map_url?: string | null
          venue_name?: string | null
          visible_from?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "shows_revue_id_fkey"
            columns: ["revue_id"]
            isOneToOne: false
            referencedRelation: "revues"
            referencedColumns: ["id"]
          },
        ]
      }
      site_settings: {
        Row: {
          created_at: string
          description: string | null
          is_public: boolean
          key: string
          updated_at: string
          value: Json
          visible_from: string | null
          visible_until: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          is_public?: boolean
          key: string
          updated_at?: string
          value: Json
          visible_from?: string | null
          visible_until?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          is_public?: boolean
          key?: string
          updated_at?: string
          value?: Json
          visible_from?: string | null
          visible_until?: string | null
        }
        Relationships: []
      }
      stream_playback: {
        Row: {
          cloudflare_live_input_id: string | null
          created_at: string
          signed_urls_verified_at: string | null
          stream_id: string
          updated_at: string
        }
        Insert: {
          cloudflare_live_input_id?: string | null
          created_at?: string
          signed_urls_verified_at?: string | null
          stream_id: string
          updated_at?: string
        }
        Update: {
          cloudflare_live_input_id?: string | null
          created_at?: string
          signed_urls_verified_at?: string | null
          stream_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "stream_playback_stream_id_fkey"
            columns: ["stream_id"]
            isOneToOne: true
            referencedRelation: "streams"
            referencedColumns: ["id"]
          },
        ]
      }
      streams: {
        Row: {
          chat_enabled: boolean
          created_at: string
          description: string | null
          ends_at: string | null
          id: string
          revue_id: string
          show_id: string | null
          slug: string
          starts_at: string
          status: Database["public"]["Enums"]["stream_status"]
          thumbnail_path: string | null
          title: string
          updated_at: string
          visible_from: string | null
          visible_until: string | null
        }
        Insert: {
          chat_enabled?: boolean
          created_at?: string
          description?: string | null
          ends_at?: string | null
          id?: string
          revue_id: string
          show_id?: string | null
          slug: string
          starts_at: string
          status?: Database["public"]["Enums"]["stream_status"]
          thumbnail_path?: string | null
          title: string
          updated_at?: string
          visible_from?: string | null
          visible_until?: string | null
        }
        Update: {
          chat_enabled?: boolean
          created_at?: string
          description?: string | null
          ends_at?: string | null
          id?: string
          revue_id?: string
          show_id?: string | null
          slug?: string
          starts_at?: string
          status?: Database["public"]["Enums"]["stream_status"]
          thumbnail_path?: string | null
          title?: string
          updated_at?: string
          visible_from?: string | null
          visible_until?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "streams_revue_id_fkey"
            columns: ["revue_id"]
            isOneToOne: false
            referencedRelation: "revues"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "streams_show_id_fkey"
            columns: ["show_id", "revue_id"]
            isOneToOne: false
            referencedRelation: "shows"
            referencedColumns: ["id", "revue_id"]
          },
        ]
      }
      stripe_events: {
        Row: {
          error: string | null
          id: string
          payload: Json
          processed_at: string | null
          received_at: string
          type: string
        }
        Insert: {
          error?: string | null
          id: string
          payload: Json
          processed_at?: string | null
          received_at?: string
          type: string
        }
        Update: {
          error?: string | null
          id?: string
          payload?: Json
          processed_at?: string | null
          received_at?: string
          type?: string
        }
        Relationships: []
      }
      student_verifications: {
        Row: {
          checked_at: string
          criteria_version: string
          eligible: boolean
          expires_at: string
          identity_id: string
          lego_subject: string
          reason: string
          user_id: string
        }
        Insert: {
          checked_at: string
          criteria_version: string
          eligible: boolean
          expires_at: string
          identity_id: string
          lego_subject: string
          reason: string
          user_id: string
        }
        Update: {
          checked_at?: string
          criteria_version?: string
          eligible?: boolean
          expires_at?: string
          identity_id?: string
          lego_subject?: string
          reason?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_verifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      ticket_links: {
        Row: {
          created_at: string
          description: string | null
          id: string
          label: string
          revue_id: string
          show_id: string | null
          sort_order: number
          updated_at: string
          url: string
          visible_from: string | null
          visible_until: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          label: string
          revue_id: string
          show_id?: string | null
          sort_order?: number
          updated_at?: string
          url: string
          visible_from?: string | null
          visible_until?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          label?: string
          revue_id?: string
          show_id?: string | null
          sort_order?: number
          updated_at?: string
          url?: string
          visible_from?: string | null
          visible_until?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ticket_links_revue_id_fkey"
            columns: ["revue_id"]
            isOneToOne: false
            referencedRelation: "revues"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ticket_links_show_id_fkey"
            columns: ["show_id", "revue_id"]
            isOneToOne: false
            referencedRelation: "shows"
            referencedColumns: ["id", "revue_id"]
          },
        ]
      }
      video_sources: {
        Row: {
          created_at: string
          id: string
          provider: string
          published_at: string | null
          removed_at: string | null
          revue_id: string
          state: string
          updated_at: string
          video_id: string
          youtube_video_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          provider: string
          published_at?: string | null
          removed_at?: string | null
          revue_id: string
          state?: string
          updated_at?: string
          video_id: string
          youtube_video_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          provider?: string
          published_at?: string | null
          removed_at?: string | null
          revue_id?: string
          state?: string
          updated_at?: string
          video_id?: string
          youtube_video_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "video_sources_video_id_revue_id_fkey"
            columns: ["video_id", "revue_id"]
            isOneToOne: false
            referencedRelation: "revue_videos"
            referencedColumns: ["id", "revue_id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_play_source: {
        Args: { _source_id: string; _user_id: string }
        Returns: boolean
      }
      can_play_stream: {
        Args: { _stream_id: string; _user_id: string }
        Returns: boolean
      }
      current_price_type: {
        Args: never
        Returns: Database["public"]["Enums"]["user_type"]
      }
      order_cancellation_allowed: {
        Args: { _order_id: string }
        Returns: boolean
      }
      prepare_revue_checkout: {
        Args: {
          _accept_terms: boolean
          _revue_id: string
          _terms_version: string
          _user_id: string
        }
        Returns: {
          amount: number
          cancellation_deadline_at: string | null
          created_at: string
          currency: string
          eligibility_checked_at: string | null
          first_show_at: string | null
          id: string
          paid_at: string | null
          price_type: Database["public"]["Enums"]["user_type"] | null
          refund_requested_at: string | null
          refunded_at: string | null
          revue_id: string
          status: Database["public"]["Enums"]["order_status"]
          stripe_checkout_session_id: string | null
          stripe_payment_intent_id: string | null
          terms_accepted_at: string | null
          terms_version: string | null
          updated_at: string
          user_id: string | null
        }
        SetofOptions: {
          from: "*"
          to: "orders"
          isOneToOne: true
          isSetofReturn: false
        }
      }
    }
    Enums: {
      app_role: "user" | "moderator" | "editor" | "admin"
      order_status: "pending" | "paid" | "failed" | "expired" | "refunded"
      stream_status: "scheduled" | "live" | "ended" | "cancelled"
      user_type: "student" | "external"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["user", "moderator", "editor", "admin"],
      order_status: ["pending", "paid", "failed", "expired", "refunded"],
      stream_status: ["scheduled", "live", "ended", "cancelled"],
      user_type: ["student", "external"],
    },
  },
} as const
