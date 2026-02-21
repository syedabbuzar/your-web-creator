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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      event_images: {
        Row: {
          created_at: string
          event_id: string
          id: string
          image_url: string
          sort_order: number
        }
        Insert: {
          created_at?: string
          event_id: string
          id?: string
          image_url: string
          sort_order?: number
        }
        Update: {
          created_at?: string
          event_id?: string
          id?: string
          image_url?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "event_images_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          category: string
          created_at: string
          date: string
          description: string
          full_description: string | null
          id: string
          image: string
          sort_order: number
          title: string
        }
        Insert: {
          category?: string
          created_at?: string
          date: string
          description: string
          full_description?: string | null
          id?: string
          image: string
          sort_order?: number
          title: string
        }
        Update: {
          category?: string
          created_at?: string
          date?: string
          description?: string
          full_description?: string | null
          id?: string
          image?: string
          sort_order?: number
          title?: string
        }
        Relationships: []
      }
      exam_resources: {
        Row: {
          created_at: string
          file_size: string
          file_type: string
          file_url: string
          id: string
          sort_order: number
          title: string
        }
        Insert: {
          created_at?: string
          file_size?: string
          file_type?: string
          file_url?: string
          id?: string
          sort_order?: number
          title: string
        }
        Update: {
          created_at?: string
          file_size?: string
          file_type?: string
          file_url?: string
          id?: string
          sort_order?: number
          title?: string
        }
        Relationships: []
      }
      exam_result_attachments: {
        Row: {
          created_at: string
          file_name: string
          file_size: string
          file_url: string
          id: string
          result_id: string
        }
        Insert: {
          created_at?: string
          file_name: string
          file_size?: string
          file_url: string
          id?: string
          result_id: string
        }
        Update: {
          created_at?: string
          file_name?: string
          file_size?: string
          file_url?: string
          id?: string
          result_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "exam_result_attachments_result_id_fkey"
            columns: ["result_id"]
            isOneToOne: false
            referencedRelation: "exam_results"
            referencedColumns: ["id"]
          },
        ]
      }
      exam_results: {
        Row: {
          created_at: string
          description: string
          id: string
          result_date: string | null
          sort_order: number
          status: string
          title: string
        }
        Insert: {
          created_at?: string
          description?: string
          id?: string
          result_date?: string | null
          sort_order?: number
          status?: string
          title: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          result_date?: string | null
          sort_order?: number
          status?: string
          title?: string
        }
        Relationships: []
      }
      exam_schedules: {
        Row: {
          classes: string
          created_at: string
          end_date: string
          exam: string
          id: string
          sort_order: number
          start_date: string
        }
        Insert: {
          classes: string
          created_at?: string
          end_date: string
          exam: string
          id?: string
          sort_order?: number
          start_date: string
        }
        Update: {
          classes?: string
          created_at?: string
          end_date?: string
          exam?: string
          id?: string
          sort_order?: number
          start_date?: string
        }
        Relationships: []
      }
      facilities: {
        Row: {
          created_at: string
          description: string
          icon: string
          id: string
          sort_order: number
          title: string
        }
        Insert: {
          created_at?: string
          description: string
          icon?: string
          id?: string
          sort_order?: number
          title: string
        }
        Update: {
          created_at?: string
          description?: string
          icon?: string
          id?: string
          sort_order?: number
          title?: string
        }
        Relationships: []
      }
      gallery: {
        Row: {
          alt: string
          created_at: string
          id: string
          sort_order: number
          src: string
        }
        Insert: {
          alt: string
          created_at?: string
          id?: string
          sort_order?: number
          src: string
        }
        Update: {
          alt?: string
          created_at?: string
          id?: string
          sort_order?: number
          src?: string
        }
        Relationships: []
      }
      leaders: {
        Row: {
          created_at: string
          id: string
          image: string
          name: string
          role: string
          sort_order: number
        }
        Insert: {
          created_at?: string
          id?: string
          image?: string
          name: string
          role: string
          sort_order?: number
        }
        Update: {
          created_at?: string
          id?: string
          image?: string
          name?: string
          role?: string
          sort_order?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
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
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
