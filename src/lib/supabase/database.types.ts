
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  
  "public": {
          Tables: {
            "chat_bans": {
                  Row: {
                    "banned_by": string | null,"created_at": string,"expires_at": string | null,"id": string,"reason": string | null,"stream_id": string | null,"user_id": string
                  }
                  ComputedFields: never
                  Insert: {
                    "banned_by"?: string | null,"created_at"?: string,"expires_at"?: string | null,"id"?: string,"reason"?: string | null,"stream_id"?: string | null,"user_id": string
                  }
                  Update: {
                    "banned_by"?: string | null,"created_at"?: string,"expires_at"?: string | null,"id"?: string,"reason"?: string | null,"stream_id"?: string | null,"user_id"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "chat_bans_banned_by_fkey"
      columns: ["banned_by"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "chat_bans_stream_id_fkey"
      columns: ["stream_id"]
isOneToOne: false
      referencedRelation: "streams"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "chat_bans_user_id_fkey"
      columns: ["user_id"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    }
                  ]
                },"chat_messages": {
                  Row: {
                    "body": string,"created_at": string,"deleted_at": string | null,"deleted_by": string | null,"display_name": string,"id": number,"stream_id": string,"user_id": string
                  }
                  ComputedFields: never
                  Insert: {
                    "body": string,"created_at"?: string,"deleted_at"?: string | null,"deleted_by"?: string | null,"display_name": string,"id"?: never,"stream_id": string,"user_id"?: string
                  }
                  Update: {
                    "body"?: string,"created_at"?: string,"deleted_at"?: string | null,"deleted_by"?: string | null,"display_name"?: string,"id"?: never,"stream_id"?: string,"user_id"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "chat_messages_deleted_by_fkey"
      columns: ["deleted_by"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "chat_messages_stream_id_fkey"
      columns: ["stream_id"]
isOneToOne: false
      referencedRelation: "streams"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "chat_messages_user_id_fkey"
      columns: ["user_id"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    }
                  ]
                },"gallery_albums": {
                  Row: {
                    "cover_photo_id": string | null,"created_at": string,"created_by": string | null,"description": string | null,"event_date": string | null,"id": string,"published_at": string | null,"revue_id": string | null,"slug": string,"sort_order": number,"title": string,"updated_at": string
                  }
                  ComputedFields: never
                  Insert: {
                    "cover_photo_id"?: string | null,"created_at"?: string,"created_by"?: string | null,"description"?: string | null,"event_date"?: string | null,"id"?: string,"published_at"?: string | null,"revue_id"?: string | null,"slug": string,"sort_order"?: number,"title": string,"updated_at"?: string
                  }
                  Update: {
                    "cover_photo_id"?: string | null,"created_at"?: string,"created_by"?: string | null,"description"?: string | null,"event_date"?: string | null,"id"?: string,"published_at"?: string | null,"revue_id"?: string | null,"slug"?: string,"sort_order"?: number,"title"?: string,"updated_at"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "gallery_albums_cover_photo_id_fkey"
      columns: ["cover_photo_id"]
isOneToOne: false
      referencedRelation: "gallery_photos"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "gallery_albums_created_by_fkey"
      columns: ["created_by"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "gallery_albums_revue_id_fkey"
      columns: ["revue_id"]
isOneToOne: false
      referencedRelation: "revues"
      referencedColumns: ["id"]
    }
                  ]
                },"gallery_photos": {
                  Row: {
                    "album_id": string,"alt_text": string | null,"caption": string | null,"created_at": string,"height": number | null,"id": string,"photographer": string | null,"sort_order": number,"storage_path": string,"taken_at": string | null,"width": number | null
                  }
                  ComputedFields: never
                  Insert: {
                    "album_id": string,"alt_text"?: string | null,"caption"?: string | null,"created_at"?: string,"height"?: number | null,"id"?: string,"photographer"?: string | null,"sort_order"?: number,"storage_path": string,"taken_at"?: string | null,"width"?: number | null
                  }
                  Update: {
                    "album_id"?: string,"alt_text"?: string | null,"caption"?: string | null,"created_at"?: string,"height"?: number | null,"id"?: string,"photographer"?: string | null,"sort_order"?: number,"storage_path"?: string,"taken_at"?: string | null,"width"?: number | null
                  }
                  Relationships: [
                    {
      foreignKeyName: "gallery_photos_album_id_fkey"
      columns: ["album_id"]
isOneToOne: false
      referencedRelation: "gallery_albums"
      referencedColumns: ["id"]
    }
                  ]
                },"orders": {
                  Row: {
                    "amount": number,"created_at": string,"currency": string,"id": string,"paid_at": string | null,"refunded_at": string | null,"status": Database["public"]['Enums']["order_status"],"stream_id": string,"stripe_checkout_session_id": string | null,"stripe_payment_intent_id": string | null,"updated_at": string,"user_id": string | null
                  }
                  ComputedFields: never
                  Insert: {
                    "amount": number,"created_at"?: string,"currency"?: string,"id"?: string,"paid_at"?: string | null,"refunded_at"?: string | null,"status"?: Database["public"]['Enums']["order_status"],"stream_id": string,"stripe_checkout_session_id"?: string | null,"stripe_payment_intent_id"?: string | null,"updated_at"?: string,"user_id"?: string | null
                  }
                  Update: {
                    "amount"?: number,"created_at"?: string,"currency"?: string,"id"?: string,"paid_at"?: string | null,"refunded_at"?: string | null,"status"?: Database["public"]['Enums']["order_status"],"stream_id"?: string,"stripe_checkout_session_id"?: string | null,"stripe_payment_intent_id"?: string | null,"updated_at"?: string,"user_id"?: string | null
                  }
                  Relationships: [
                    {
      foreignKeyName: "orders_stream_id_fkey"
      columns: ["stream_id"]
isOneToOne: false
      referencedRelation: "streams"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "orders_user_id_fkey"
      columns: ["user_id"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    }
                  ]
                },"posts": {
                  Row: {
                    "author_id": string | null,"author_name": string | null,"body": string,"cover_image_path": string | null,"created_at": string,"excerpt": string | null,"id": string,"published_at": string | null,"revue_id": string | null,"slug": string,"title": string,"updated_at": string
                  }
                  ComputedFields: never
                  Insert: {
                    "author_id"?: string | null,"author_name"?: string | null,"body"?: string,"cover_image_path"?: string | null,"created_at"?: string,"excerpt"?: string | null,"id"?: string,"published_at"?: string | null,"revue_id"?: string | null,"slug": string,"title": string,"updated_at"?: string
                  }
                  Update: {
                    "author_id"?: string | null,"author_name"?: string | null,"body"?: string,"cover_image_path"?: string | null,"created_at"?: string,"excerpt"?: string | null,"id"?: string,"published_at"?: string | null,"revue_id"?: string | null,"slug"?: string,"title"?: string,"updated_at"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "posts_author_id_fkey"
      columns: ["author_id"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "posts_revue_id_fkey"
      columns: ["revue_id"]
isOneToOne: false
      referencedRelation: "revues"
      referencedColumns: ["id"]
    }
                  ]
                },"profiles": {
                  Row: {
                    "avatar_url": string | null,"created_at": string,"display_name": string,"id": string,"role": Database["public"]['Enums']["app_role"],"updated_at": string,"user_type": Database["public"]['Enums']["user_type"]
                  }
                  ComputedFields: never
                  Insert: {
                    "avatar_url"?: string | null,"created_at"?: string,"display_name": string,"id": string,"role"?: Database["public"]['Enums']["app_role"],"updated_at"?: string,"user_type"?: Database["public"]['Enums']["user_type"]
                  }
                  Update: {
                    "avatar_url"?: string | null,"created_at"?: string,"display_name"?: string,"id"?: string,"role"?: Database["public"]['Enums']["app_role"],"updated_at"?: string,"user_type"?: Database["public"]['Enums']["user_type"]
                  }
                  Relationships: [
                    
                  ]
                },"revue_details": {
                  Row: {
                    "created_at": string,"description": string | null,"name": string,"poster_path": string | null,"revue_id": string,"tagline": string | null,"updated_at": string
                  }
                  ComputedFields: never
                  Insert: {
                    "created_at"?: string,"description"?: string | null,"name": string,"poster_path"?: string | null,"revue_id": string,"tagline"?: string | null,"updated_at"?: string
                  }
                  Update: {
                    "created_at"?: string,"description"?: string | null,"name"?: string,"poster_path"?: string | null,"revue_id"?: string,"tagline"?: string | null,"updated_at"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "revue_details_revue_id_fkey"
      columns: ["revue_id"]
isOneToOne: true
      referencedRelation: "revues"
      referencedColumns: ["id"]
    }
                  ]
                },"revues": {
                  Row: {
                    "created_at": string,"id": string,"is_current": boolean,"name_reveal_at": string | null,"slug": string,"teaser": string | null,"updated_at": string,"visible_from": string | null,"year": number
                  }
                  ComputedFields: never
                  Insert: {
                    "created_at"?: string,"id"?: string,"is_current"?: boolean,"name_reveal_at"?: string | null,"slug": string,"teaser"?: string | null,"updated_at"?: string,"visible_from"?: string | null,"year": number
                  }
                  Update: {
                    "created_at"?: string,"id"?: string,"is_current"?: boolean,"name_reveal_at"?: string | null,"slug"?: string,"teaser"?: string | null,"updated_at"?: string,"visible_from"?: string | null,"year"?: number
                  }
                  Relationships: [
                    
                  ]
                },"shows": {
                  Row: {
                    "created_at": string,"description": string | null,"doors_open_at": string | null,"ends_at": string | null,"id": string,"is_sold_out": boolean,"revue_id": string,"starts_at": string,"title": string,"updated_at": string,"venue_address": string | null,"venue_map_url": string | null,"venue_name": string | null,"visible_from": string | null
                  }
                  ComputedFields: never
                  Insert: {
                    "created_at"?: string,"description"?: string | null,"doors_open_at"?: string | null,"ends_at"?: string | null,"id"?: string,"is_sold_out"?: boolean,"revue_id": string,"starts_at": string,"title": string,"updated_at"?: string,"venue_address"?: string | null,"venue_map_url"?: string | null,"venue_name"?: string | null,"visible_from"?: string | null
                  }
                  Update: {
                    "created_at"?: string,"description"?: string | null,"doors_open_at"?: string | null,"ends_at"?: string | null,"id"?: string,"is_sold_out"?: boolean,"revue_id"?: string,"starts_at"?: string,"title"?: string,"updated_at"?: string,"venue_address"?: string | null,"venue_map_url"?: string | null,"venue_name"?: string | null,"visible_from"?: string | null
                  }
                  Relationships: [
                    {
      foreignKeyName: "shows_revue_id_fkey"
      columns: ["revue_id"]
isOneToOne: false
      referencedRelation: "revues"
      referencedColumns: ["id"]
    }
                  ]
                },"site_settings": {
                  Row: {
                    "created_at": string,"description": string | null,"is_public": boolean,"key": string,"updated_at": string,"value": NonNullable<Json>,"visible_from": string | null,"visible_until": string | null
                  }
                  ComputedFields: never
                  Insert: {
                    "created_at"?: string,"description"?: string | null,"is_public"?: boolean,"key": string,"updated_at"?: string,"value": NonNullable<Json>,"visible_from"?: string | null,"visible_until"?: string | null
                  }
                  Update: {
                    "created_at"?: string,"description"?: string | null,"is_public"?: boolean,"key"?: string,"updated_at"?: string,"value"?: NonNullable<Json>,"visible_from"?: string | null,"visible_until"?: string | null
                  }
                  Relationships: [
                    
                  ]
                },"stream_access": {
                  Row: {
                    "created_at": string,"expires_at": string | null,"granted_by": string | null,"id": string,"note": string | null,"order_id": string | null,"revoked_at": string | null,"source": Database["public"]['Enums']["access_source"],"stream_id": string,"user_id": string
                  }
                  ComputedFields: never
                  Insert: {
                    "created_at"?: string,"expires_at"?: string | null,"granted_by"?: string | null,"id"?: string,"note"?: string | null,"order_id"?: string | null,"revoked_at"?: string | null,"source": Database["public"]['Enums']["access_source"],"stream_id": string,"user_id": string
                  }
                  Update: {
                    "created_at"?: string,"expires_at"?: string | null,"granted_by"?: string | null,"id"?: string,"note"?: string | null,"order_id"?: string | null,"revoked_at"?: string | null,"source"?: Database["public"]['Enums']["access_source"],"stream_id"?: string,"user_id"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "stream_access_granted_by_fkey"
      columns: ["granted_by"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "stream_access_order_id_fkey"
      columns: ["order_id"]
isOneToOne: false
      referencedRelation: "orders"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "stream_access_stream_id_fkey"
      columns: ["stream_id"]
isOneToOne: false
      referencedRelation: "streams"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "stream_access_user_id_fkey"
      columns: ["user_id"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    }
                  ]
                },"stream_playback": {
                  Row: {
                    "cloudflare_live_input_id": string | null,"cloudflare_video_id": string | null,"created_at": string,"stream_id": string,"updated_at": string
                  }
                  ComputedFields: never
                  Insert: {
                    "cloudflare_live_input_id"?: string | null,"cloudflare_video_id"?: string | null,"created_at"?: string,"stream_id": string,"updated_at"?: string
                  }
                  Update: {
                    "cloudflare_live_input_id"?: string | null,"cloudflare_video_id"?: string | null,"created_at"?: string,"stream_id"?: string,"updated_at"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "stream_playback_stream_id_fkey"
      columns: ["stream_id"]
isOneToOne: true
      referencedRelation: "streams"
      referencedColumns: ["id"]
    }
                  ]
                },"stream_prices": {
                  Row: {
                    "amount": number,"created_at": string,"currency": string,"stream_id": string,"stripe_price_id": string | null,"updated_at": string,"user_type": Database["public"]['Enums']["user_type"]
                  }
                  ComputedFields: never
                  Insert: {
                    "amount": number,"created_at"?: string,"currency"?: string,"stream_id": string,"stripe_price_id"?: string | null,"updated_at"?: string,"user_type": Database["public"]['Enums']["user_type"]
                  }
                  Update: {
                    "amount"?: number,"created_at"?: string,"currency"?: string,"stream_id"?: string,"stripe_price_id"?: string | null,"updated_at"?: string,"user_type"?: Database["public"]['Enums']["user_type"]
                  }
                  Relationships: [
                    {
      foreignKeyName: "stream_prices_stream_id_fkey"
      columns: ["stream_id"]
isOneToOne: false
      referencedRelation: "streams"
      referencedColumns: ["id"]
    }
                  ]
                },"streams": {
                  Row: {
                    "chat_enabled": boolean,"created_at": string,"description": string | null,"ends_at": string | null,"id": string,"replay_available_until": string | null,"revue_id": string,"sales_close_at": string | null,"sales_open_at": string | null,"show_id": string | null,"slug": string,"starts_at": string,"status": Database["public"]['Enums']["stream_status"],"thumbnail_path": string | null,"title": string,"updated_at": string,"visible_from": string | null,"visible_until": string | null
                  }
                  ComputedFields: never
                  Insert: {
                    "chat_enabled"?: boolean,"created_at"?: string,"description"?: string | null,"ends_at"?: string | null,"id"?: string,"replay_available_until"?: string | null,"revue_id": string,"sales_close_at"?: string | null,"sales_open_at"?: string | null,"show_id"?: string | null,"slug": string,"starts_at": string,"status"?: Database["public"]['Enums']["stream_status"],"thumbnail_path"?: string | null,"title": string,"updated_at"?: string,"visible_from"?: string | null,"visible_until"?: string | null
                  }
                  Update: {
                    "chat_enabled"?: boolean,"created_at"?: string,"description"?: string | null,"ends_at"?: string | null,"id"?: string,"replay_available_until"?: string | null,"revue_id"?: string,"sales_close_at"?: string | null,"sales_open_at"?: string | null,"show_id"?: string | null,"slug"?: string,"starts_at"?: string,"status"?: Database["public"]['Enums']["stream_status"],"thumbnail_path"?: string | null,"title"?: string,"updated_at"?: string,"visible_from"?: string | null,"visible_until"?: string | null
                  }
                  Relationships: [
                    {
      foreignKeyName: "streams_revue_id_fkey"
      columns: ["revue_id"]
isOneToOne: false
      referencedRelation: "revues"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "streams_show_id_fkey"
      columns: ["show_id","revue_id"]
isOneToOne: false
      referencedRelation: "shows"
      referencedColumns: ["id","revue_id"]
    }
                  ]
                },"stripe_events": {
                  Row: {
                    "error": string | null,"id": string,"payload": NonNullable<Json>,"processed_at": string | null,"received_at": string,"type": string
                  }
                  ComputedFields: never
                  Insert: {
                    "error"?: string | null,"id": string,"payload": NonNullable<Json>,"processed_at"?: string | null,"received_at"?: string,"type": string
                  }
                  Update: {
                    "error"?: string | null,"id"?: string,"payload"?: NonNullable<Json>,"processed_at"?: string | null,"received_at"?: string,"type"?: string
                  }
                  Relationships: [
                    
                  ]
                },"ticket_links": {
                  Row: {
                    "created_at": string,"description": string | null,"id": string,"label": string,"revue_id": string,"show_id": string | null,"sort_order": number,"updated_at": string,"url": string,"visible_from": string | null,"visible_until": string | null
                  }
                  ComputedFields: never
                  Insert: {
                    "created_at"?: string,"description"?: string | null,"id"?: string,"label": string,"revue_id": string,"show_id"?: string | null,"sort_order"?: number,"updated_at"?: string,"url": string,"visible_from"?: string | null,"visible_until"?: string | null
                  }
                  Update: {
                    "created_at"?: string,"description"?: string | null,"id"?: string,"label"?: string,"revue_id"?: string,"show_id"?: string | null,"sort_order"?: number,"updated_at"?: string,"url"?: string,"visible_from"?: string | null,"visible_until"?: string | null
                  }
                  Relationships: [
                    {
      foreignKeyName: "ticket_links_revue_id_fkey"
      columns: ["revue_id"]
isOneToOne: false
      referencedRelation: "revues"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "ticket_links_show_id_fkey"
      columns: ["show_id","revue_id"]
isOneToOne: false
      referencedRelation: "shows"
      referencedColumns: ["id","revue_id"]
    }
                  ]
                }
          }
          Views: {
            [_ in never]: never
          }
          Functions: {
            [_ in never]: never
          }
          Enums: {
            "access_source": "purchase"|"granted","app_role": "user"|"moderator"|"editor"|"admin","order_status": "pending"|"paid"|"failed"|"expired"|"refunded","stream_status": "scheduled"|"live"|"ended"|"cancelled","user_type": "student"|"external"
          }
          CompositeTypes: {
            [_ in never]: never
          }
        }
}

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
  ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
      Row: infer R
    }
    ? R
    : never
  : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
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
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
  ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
  : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never
> = PublicCompositeTypeNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
  ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
  : never

export const Constants = {
  "public": {
          Enums: {
            "access_source": ["purchase", "granted"],"app_role": ["user", "moderator", "editor", "admin"],"order_status": ["pending", "paid", "failed", "expired", "refunded"],"stream_status": ["scheduled", "live", "ended", "cancelled"],"user_type": ["student", "external"]
          }
        }
} as const
