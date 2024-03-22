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
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
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
