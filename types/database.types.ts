export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      campaign: {
        Row: {
          AudienceType: string | null;
          Budget: number | null;
          CampaignID: number;
          Clicks: number | null;
          ContentID: number | null;
          ContentType: string | null;
          EndDate: string | null;
          Impressions: number | null;
          NewSubscriptions: number | null;
          Platform: string | null;
          Revenue: number | null;
          StartDate: string | null;
          "Subscription Cost": number | null;
        };
        Insert: {
          AudienceType?: string | null;
          Budget?: number | null;
          CampaignID: number;
          Clicks?: number | null;
          ContentID?: number | null;
          ContentType?: string | null;
          EndDate?: string | null;
          Impressions?: number | null;
          NewSubscriptions?: number | null;
          Platform?: string | null;
          Revenue?: number | null;
          StartDate?: string | null;
          "Subscription Cost"?: number | null;
        };
        Update: {
          AudienceType?: string | null;
          Budget?: number | null;
          CampaignID?: number;
          Clicks?: number | null;
          ContentID?: number | null;
          ContentType?: string | null;
          EndDate?: string | null;
          Impressions?: number | null;
          NewSubscriptions?: number | null;
          Platform?: string | null;
          Revenue?: number | null;
          StartDate?: string | null;
          "Subscription Cost"?: number | null;
        };
        Relationships: [];
      };
      chats: {
        Row: {
          id: string;
          payload: Json | null;
          user_id: string;
        };
        Insert: {
          id: string;
          payload?: Json | null;
          user_id?: string;
        };
        Update: {
          id?: string;
          payload?: Json | null;
          user_id?: string;
        };
        Relationships: [];
      };
      documents: {
        Row: {
          content: string | null;
          embedding: string | null;
          id: string;
          metadata: Json | null;
        };
        Insert: {
          content?: string | null;
          embedding?: string | null;
          id: string;
          metadata?: Json | null;
        };
        Update: {
          content?: string | null;
          embedding?: string | null;
          id?: string;
          metadata?: Json | null;
        };
        Relationships: [];
      };
      ex_documents: {
        Row: {
          content: string | null;
          embedding: string | null;
          id: string;
          metadata: Json | null;
        };
        Insert: {
          content?: string | null;
          embedding?: string | null;
          id: string;
          metadata?: Json | null;
        };
        Update: {
          content?: string | null;
          embedding?: string | null;
          id?: string;
          metadata?: Json | null;
        };
        Relationships: [];
      };
      k1_documents: {
        Row: {
          content: string | null;
          embedding: string | null;
          id: string;
          metadata: Json | null;
        };
        Insert: {
          content?: string | null;
          embedding?: string | null;
          id?: string;
          metadata?: Json | null;
        };
        Update: {
          content?: string | null;
          embedding?: string | null;
          id?: string;
          metadata?: Json | null;
        };
        Relationships: [];
      };
      pdf_documents: {
        Row: {
          content: string | null;
          created_at: string;
          embedding: string | null;
          id: string;
          metadata: Json | null;
        };
        Insert: {
          content?: string | null;
          created_at?: string;
          embedding?: string | null;
          id: string;
          metadata?: Json | null;
        };
        Update: {
          content?: string | null;
          created_at?: string;
          embedding?: string | null;
          id?: string;
          metadata?: Json | null;
        };
        Relationships: [];
      };
      search_documents: {
        Row: {
          content: string | null;
          embedding: string | null;
          id: number;
          metadata: Json | null;
        };
        Insert: {
          content?: string | null;
          embedding?: string | null;
          id?: number;
          metadata?: Json | null;
        };
        Update: {
          content?: string | null;
          embedding?: string | null;
          id?: number;
          metadata?: Json | null;
        };
        Relationships: [];
      };
      subscriber: {
        Row: {
          Age: number | null;
          AudienceType: string | null;
          CampaignID: number | null;
          EngagementRate: number | null;
          Gender: string | null;
          Location: string | null;
          Satisfaction: string | null;
          SubscriberID: string;
          SubscriptionDate: string | null;
          SubscriptionDays: number | null;
          ViewingTime: number | null;
        };
        Insert: {
          Age?: number | null;
          AudienceType?: string | null;
          CampaignID?: number | null;
          EngagementRate?: number | null;
          Gender?: string | null;
          Location?: string | null;
          Satisfaction?: string | null;
          SubscriberID: string;
          SubscriptionDate?: string | null;
          SubscriptionDays?: number | null;
          ViewingTime?: number | null;
        };
        Update: {
          Age?: number | null;
          AudienceType?: string | null;
          CampaignID?: number | null;
          EngagementRate?: number | null;
          Gender?: string | null;
          Location?: string | null;
          Satisfaction?: string | null;
          SubscriberID?: string;
          SubscriptionDate?: string | null;
          SubscriptionDays?: number | null;
          ViewingTime?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "public_subscriber_CampaignID_fkey";
            columns: ["CampaignID"];
            isOneToOne: false;
            referencedRelation: "campaign";
            referencedColumns: ["CampaignID"];
          }
        ];
      };
    };
    Views: {
      subscriber_aggregated_data: {
        Row: {
          Age: number | null;
          AudienceType: string | null;
          CampaignID: number | null;
          Clicks: number | null;
          ContentType: string | null;
          EngagementRate: number | null;
          Impressions: number | null;
          Location: string | null;
          NewSubscriptions: number | null;
          Platform: string | null;
          Revenue: number | null;
          Satisfaction: string | null;
          SubscriptionDate: string | null;
          ViewingTime: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "public_subscriber_CampaignID_fkey";
            columns: ["CampaignID"];
            isOneToOne: false;
            referencedRelation: "campaign";
            referencedColumns: ["CampaignID"];
          }
        ];
      };
    };
    Functions: {
      f_search_documents: {
        Args: {
          query_embedding: string;
          match_count?: number;
          filter?: Json;
        };
        Returns: {
          id: number;
          content: string;
          metadata: Json;
          embedding: Json;
          similarity: number;
        }[];
      };
      hnswhandler: {
        Args: {
          "": unknown;
        };
        Returns: unknown;
      };
      ivfflathandler: {
        Args: {
          "": unknown;
        };
        Returns: unknown;
      };
      k1_match_documents: {
        Args: {
          query_embedding: string;
          filter?: Json;
        };
        Returns: {
          id: string;
          content: string;
          metadata: Json;
          similarity: number;
        }[];
      };
      match_documents: {
        Args: {
          query_embedding: string;
          match_count: number;
        };
        Returns: {
          id: string;
          content: string;
          metadata: Json;
          embedding: string;
          similarity: number;
        }[];
      };
      match_ex_documents: {
        Args: {
          query_embedding: string;
          match_count: number;
        };
        Returns: {
          id: string;
          content: string;
          metadata: Json;
          embedding: string;
          similarity: number;
        }[];
      };
      pdf_match_documents: {
        Args: {
          query_embedding: string;
          filter?: Json;
        };
        Returns: {
          id: string;
          content: string;
          metadata: Json;
          similarity: number;
        }[];
      };
      requesting_user_id: {
        Args: Record<PropertyKey, never>;
        Returns: string;
      };
      v_match_documents: {
        Args: {
          query_embedding: string;
          filter?: Json;
        };
        Returns: {
          id: string;
          content: string;
          metadata: Json;
          similarity: number;
        }[];
      };
      vector_avg: {
        Args: {
          "": number[];
        };
        Returns: string;
      };
      vector_dims: {
        Args: {
          "": string;
        };
        Returns: number;
      };
      vector_norm: {
        Args: {
          "": string;
        };
        Returns: number;
      };
      vector_out: {
        Args: {
          "": string;
        };
        Returns: unknown;
      };
      vector_send: {
        Args: {
          "": string;
        };
        Returns: string;
      };
      vector_typmod_in: {
        Args: {
          "": unknown[];
        };
        Returns: number;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type PublicSchema = Database[Extract<keyof Database, "public">];

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
      PublicSchema["Views"])
  ? (PublicSchema["Tables"] &
      PublicSchema["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R;
    }
    ? R
    : never
  : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
  ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I;
    }
    ? I
    : never
  : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
  ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U;
    }
    ? U
    : never
  : never;

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
  ? PublicSchema["Enums"][PublicEnumNameOrOptions]
  : never;
