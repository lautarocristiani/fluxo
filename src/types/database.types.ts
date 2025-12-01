export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
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
          created_at: string
        }
        Insert: {
          id: string
          email: string
          first_name?: string | null
          last_name?: string | null
          role?: 'dispatcher' | 'technician'
          avatar_url?: string | null
        }
        Update: {
          first_name?: string | null
          last_name?: string | null
          role?: 'dispatcher' | 'technician'
          avatar_url?: string | null
        }
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
          status?: 'pending' | 'in_progress' | 'completed'
          template_id: string
          assignee_id?: string | null
          customer_name: string
          customer_address: string
          form_data?: Json
        }
        Update: {
          status?: 'pending' | 'in_progress' | 'completed'
          form_data?: Json
          completed_at?: string | null
        }
      }
    }
  }
}