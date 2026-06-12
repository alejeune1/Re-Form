export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          display_name: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string | null;
        };
        Insert: {
          id: string;
          display_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string | null;
        };
        Update: {
          display_name?: string | null;
          avatar_url?: string | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      tutorials: {
        Row: {
          id: string;
          title: string;
          material: string;
          difficulty: Database['public']['Enums']['tutorial_difficulty'];
          duration: string;
          category: string;
          image: string;
          description: string;
          is_published: boolean;
          created_at: string;
        };
        Insert: {
          id: string;
          title: string;
          material: string;
          difficulty: Database['public']['Enums']['tutorial_difficulty'];
          duration: string;
          category: string;
          image: string;
          description: string;
          is_published?: boolean;
          created_at?: string;
        };
        Update: {
          title?: string;
          material?: string;
          difficulty?: Database['public']['Enums']['tutorial_difficulty'];
          duration?: string;
          category?: string;
          image?: string;
          description?: string;
          is_published?: boolean;
        };
        Relationships: [];
      };
      challenges: {
        Row: {
          id: string;
          title: string;
          theme: string;
          status: Database['public']['Enums']['challenge_status'];
          participants: number;
          description: string;
          is_published: boolean;
          starts_at: string | null;
          ends_at: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          title: string;
          theme: string;
          status: Database['public']['Enums']['challenge_status'];
          participants?: number;
          description: string;
          is_published?: boolean;
          starts_at?: string | null;
          ends_at?: string | null;
          created_at?: string;
        };
        Update: {
          title?: string;
          theme?: string;
          status?: Database['public']['Enums']['challenge_status'];
          participants?: number;
          description?: string;
          is_published?: boolean;
          starts_at?: string | null;
          ends_at?: string | null;
        };
        Relationships: [];
      };
      creations: {
        Row: {
          id: string;
          owner_id: string;
          title: string;
          piece_type: string;
          condition: string;
          goal: string;
          material: string;
          notes: string;
          image_name: string;
          image_path: string;
          visibility: Database['public']['Enums']['creation_visibility'];
          created_at: string;
        };
        Insert: {
          id?: string;
          owner_id: string;
          title: string;
          piece_type: string;
          condition: string;
          goal: string;
          material: string;
          notes?: string;
          image_name: string;
          image_path: string;
          visibility?: Database['public']['Enums']['creation_visibility'];
          created_at?: string;
        };
        Update: {
          title?: string;
          piece_type?: string;
          condition?: string;
          goal?: string;
          material?: string;
          notes?: string;
          image_name?: string;
          image_path?: string;
          visibility?: Database['public']['Enums']['creation_visibility'];
        };
        Relationships: [
          {
            foreignKeyName: 'creations_owner_id_fkey';
            columns: ['owner_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      votes: {
        Row: {
          id: string;
          challenge_id: string;
          creation_id: string;
          voter_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          challenge_id: string;
          creation_id: string;
          voter_id: string;
          created_at?: string;
        };
        Update: never;
        Relationships: [
          {
            foreignKeyName: 'votes_challenge_id_fkey';
            columns: ['challenge_id'];
            isOneToOne: false;
            referencedRelation: 'challenges';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'votes_creation_id_fkey';
            columns: ['creation_id'];
            isOneToOne: false;
            referencedRelation: 'creations';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'votes_voter_id_fkey';
            columns: ['voter_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      creation_likes: {
        Row: {
          id: string;
          creation_id: string;
          user_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          creation_id: string;
          user_id: string;
          created_at?: string;
        };
        Update: never;
        Relationships: [
          {
            foreignKeyName: 'creation_likes_creation_id_fkey';
            columns: ['creation_id'];
            isOneToOne: false;
            referencedRelation: 'creations';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'creation_likes_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      creation_comments: {
        Row: {
          id: string;
          creation_id: string;
          user_id: string;
          body: string;
          created_at: string;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          creation_id: string;
          user_id: string;
          body: string;
          created_at?: string;
          updated_at?: string | null;
        };
        Update: {
          body?: string;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'creation_comments_creation_id_fkey';
            columns: ['creation_id'];
            isOneToOne: false;
            referencedRelation: 'creations';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'creation_comments_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      challenge_registrations: {
        Row: {
          id: string;
          challenge_id: string;
          user_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          challenge_id: string;
          user_id: string;
          created_at?: string;
        };
        Update: never;
        Relationships: [
          {
            foreignKeyName: 'challenge_registrations_challenge_id_fkey';
            columns: ['challenge_id'];
            isOneToOne: false;
            referencedRelation: 'challenges';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'challenge_registrations_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      challenge_submissions: {
        Row: {
          id: string;
          challenge_id: string;
          creation_id: string;
          user_id: string;
          statement: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          challenge_id: string;
          creation_id: string;
          user_id: string;
          statement?: string;
          created_at?: string;
        };
        Update: never;
        Relationships: [
          {
            foreignKeyName: 'challenge_submissions_challenge_id_fkey';
            columns: ['challenge_id'];
            isOneToOne: false;
            referencedRelation: 'challenges';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'challenge_submissions_creation_id_fkey';
            columns: ['creation_id'];
            isOneToOne: false;
            referencedRelation: 'creations';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'challenge_submissions_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      tutorial_difficulty: 'Facile' | 'Intermédiaire' | 'Avancé';
      challenge_status: 'Bientôt' | 'En cours' | 'Terminé';
      creation_visibility: 'private' | 'public';
    };
    CompositeTypes: Record<string, never>;
  };
};
