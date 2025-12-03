export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          first_name: string | null
          last_name: string | null
          role: 'dispatcher' | 'technician'
          avatar_url: string | null
          theme_preference: 'light' | 'dark' | 'system'
          created_at: string
        }
        Insert: {
          id: string
          email: string
          first_name?: string | null
          last_name?: string | null
          role?: 'dispatcher' | 'technician'
          avatar_url?: string | null
          theme_preference?: 'light' | 'dark' | 'system'
        }
        Update: {
          first_name?: string | null
          last_name?: string | null
          role?: 'dispatcher' | 'technician'
          avatar_url?: string | null
          theme_preference?: 'light' | 'dark' | 'system'
        }
        Relationships: []
      }
      service_templates: {
        Row: {
          id: string
          name: string
          description: string | null
          schema_definition: Json
          ui_schema_definition: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          schema_definition: Json
          ui_schema_definition?: Json | null
        }
        Update: {
          name?: string
          description?: string | null
          schema_definition?: Json
        }
        Relationships: []
      }
      work_orders: {
        Row: {
          id: string
          status: 'pending' | 'in_progress' | 'completed'
          template_id: string
          assignee_id: string | null
          customer_name: string
          customer_address: string
          form_data: Json
          created_at: string
          completed_at: string | null
        }
        Insert: {
          id?: string
          status?: 'pending' | 'in_progress' | 'completed'
          template_id: string
          assignee_id?: string | null
          customer_name: string
          customer_address: string
          form_data?: Json
          completed_at?: string | null
        }
        Update: {
          status?: 'pending' | 'in_progress' | 'completed'
          assignee_id?: string | null
          form_data?: Json
          completed_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "work_orders_assignee_id_fkey"
            columns: ["assignee_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "work_orders_template_id_fkey"
            columns: ["template_id"]
            referencedRelation: "service_templates"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}