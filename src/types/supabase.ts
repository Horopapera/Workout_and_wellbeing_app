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
      users: {
        Row: {
          id: string
          email: string
          name: string
          avatar?: string
          goal: 'lose' | 'gain' | 'maintain'
          target_weight?: number
          current_weight: number
          height: number
          age: number
          gender: 'male' | 'female' | 'other'
          activity_level: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active'
          dietary_preferences: string[]
          workout_style: string[]
          daily_calories: number
          macro_targets: Json
          custom_macro_goals?: Json
          preferences: Json
          onboarding_completed: boolean
          created_at: string
          updated_at: string
          last_login_at?: string
        }
        Insert: {
          id?: string
          email: string
          name: string
          avatar?: string
          goal: 'lose' | 'gain' | 'maintain'
          target_weight?: number
          current_weight: number
          height: number
          age: number
          gender: 'male' | 'female' | 'other'
          activity_level: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active'
          dietary_preferences?: string[]
          workout_style?: string[]
          daily_calories: number
          macro_targets: Json
          custom_macro_goals?: Json
          preferences?: Json
          onboarding_completed?: boolean
          created_at?: string
          updated_at?: string
          last_login_at?: string
        }
        Update: {
          email?: string
          name?: string
          avatar?: string
          goal?: 'lose' | 'gain' | 'maintain'
          target_weight?: number | null
          current_weight?: number
          height?: number
          age?: number
          gender?: 'male' | 'female' | 'other'
          activity_level?: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active'
          dietary_preferences?: string[]
          workout_style?: string[]
          daily_calories?: number
          macro_targets?: Json
          custom_macro_goals?: Json | null
          preferences?: Json
          onboarding_completed?: boolean
          updated_at?: string
          last_login_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "users_id_fkey"
            columns: ["id"]
            referencedRelation: "auth.users"
            referencedColumns: ["id"]
          }
        ]
      }
      foods: {
        Row: {
          id: string
          name: string
          brand?: string
          barcode?: string
          calories_per_100g: number
          protein_per_100g: number
          carbs_per_100g: number
          fat_per_100g: number
          category: string
          is_custom: boolean
          created_by?: string
          usage_count: number
          last_used?: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          brand?: string
          barcode?: string
          calories_per_100g: number
          protein_per_100g: number
          carbs_per_100g: number
          fat_per_100g: number
          category: string
          is_custom?: boolean
          created_by?: string
          usage_count?: number
          last_used?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          name?: string
          brand?: string | null
          barcode?: string | null
          calories_per_100g?: number
          protein_per_100g?: number
          carbs_per_100g?: number
          fat_per_100g?: number
          category?: string
          is_custom?: boolean
          usage_count?: number
          last_used?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "foods_created_by_fkey"
            columns: ["created_by"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      food_entries: {
        Row: {
          id: string
          user_id: string
          food_id: string
          amount: number
          calories: number
          protein: number
          carbs: number
          fat: number
          meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack'
          date: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          food_id: string
          amount: number
          calories: number
          protein: number
          carbs: number
          fat: number
          meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack'
          date: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          amount?: number
          calories?: number
          protein?: number
          carbs?: number
          fat?: number
          meal_type?: 'breakfast' | 'lunch' | 'dinner' | 'snack'
          date?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "food_entries_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "food_entries_food_id_fkey"
            columns: ["food_id"]
            referencedRelation: "foods"
            referencedColumns: ["id"]
          }
        ]
      }
      planned_food_entries: {
        Row: {
          id: string
          user_id: string
          food_id: string
          amount: number
          calories: number
          protein: number
          carbs: number
          fat: number
          meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack'
          date: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          food_id: string
          amount: number
          calories: number
          protein: number
          carbs: number
          fat: number
          meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack'
          date: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          amount?: number
          calories?: number
          protein?: number
          carbs?: number
          fat?: number
          meal_type?: 'breakfast' | 'lunch' | 'dinner' | 'snack'
          date?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "planned_food_entries_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "planned_food_entries_food_id_fkey"
            columns: ["food_id"]
            referencedRelation: "foods"
            referencedColumns: ["id"]
          }
        ]
      }
      meal_templates: {
        Row: {
          id: string
          user_id: string
          name: string
          description?: string
          total_calories: number
          total_protein: number
          total_carbs: number
          total_fat: number
          created_at: string
          updated_at: string
          last_used?: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          description?: string
          total_calories: number
          total_protein: number
          total_carbs: number
          total_fat: number
          created_at?: string
          updated_at?: string
          last_used?: string
        }
        Update: {
          name?: string
          description?: string | null
          total_calories?: number
          total_protein?: number
          total_carbs?: number
          total_fat?: number
          updated_at?: string
          last_used?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "meal_templates_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      meal_template_items: {
        Row: {
          id: string
          template_id: string
          food_id: string
          amount: number
          calories: number
          protein: number
          carbs: number
          fat: number
          meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack'
          created_at: string
        }
        Insert: {
          id?: string
          template_id: string
          food_id: string
          amount: number
          calories: number
          protein: number
          carbs: number
          fat: number
          meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack'
          created_at?: string
        }
        Update: {
          amount?: number
          calories?: number
          protein?: number
          carbs?: number
          fat?: number
          meal_type?: 'breakfast' | 'lunch' | 'dinner' | 'snack'
        }
        Relationships: [
          {
            foreignKeyName: "meal_template_items_template_id_fkey"
            columns: ["template_id"]
            referencedRelation: "meal_templates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "meal_template_items_food_id_fkey"
            columns: ["food_id"]
            referencedRelation: "foods"
            referencedColumns: ["id"]
          }
        ]
      }
      workouts: {
        Row: {
          id: string
          user_id: string
          name: string
          date?: string
          duration?: number
          start_time?: string
          end_time?: string
          calories_burned?: number
          completed: boolean
          notes?: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          date?: string
          duration?: number
          start_time?: string
          end_time?: string
          calories_burned?: number
          completed: boolean
          notes?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          name?: string
          date?: string | null
          duration?: number | null
          start_time?: string | null
          end_time?: string | null
          calories_burned?: number | null
          completed?: boolean
          notes?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "workouts_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      workout_exercises: {
        Row: {
          id: string
          workout_id: string
          exercise_id: string
          order_index: number
          notes?: string
          created_at: string
        }
        Insert: {
          id?: string
          workout_id: string
          exercise_id: string
          order_index: number
          notes?: string
          created_at?: string
        }
        Update: {
          order_index?: number
          notes?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "workout_exercises_workout_id_fkey"
            columns: ["workout_id"]
            referencedRelation: "workouts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workout_exercises_exercise_id_fkey"
            columns: ["exercise_id"]
            referencedRelation: "exercises"
            referencedColumns: ["id"]
          }
        ]
      }
      workout_sets: {
        Row: {
          id: string
          workout_exercise_id: string
          set_number: number
          reps: number
          weight?: number
          duration?: number
          rest_time?: number
          completed: boolean
          created_at: string
        }
        Insert: {
          id?: string
          workout_exercise_id: string
          set_number: number
          reps: number
          weight?: number
          duration?: number
          rest_time?: number
          completed: boolean
          created_at?: string
        }
        Update: {
          reps?: number
          weight?: number | null
          duration?: number | null
          rest_time?: number | null
          completed?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "workout_sets_workout_exercise_id_fkey"
            columns: ["workout_exercise_id"]
            referencedRelation: "workout_exercises"
            referencedColumns: ["id"]
          }
        ]
      }
      exercises: {
        Row: {
          id: string
          name: string
          category: string
          muscle_groups: string[]
          equipment?: string
          instructions?: string
          is_custom: boolean
          created_by?: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          category: string
          muscle_groups: string[]
          equipment?: string
          instructions?: string
          is_custom?: boolean
          created_by?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          name?: string
          category?: string
          muscle_groups?: string[]
          equipment?: string | null
          instructions?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "exercises_created_by_fkey"
            columns: ["created_by"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      recipes: {
        Row: {
          id: string
          user_id: string
          name: string
          description?: string
          servings: number
          instructions?: string
          total_calories: number
          total_protein: number
          total_carbs: number
          total_fat: number
          calories_per_serving: number
          protein_per_serving: number
          carbs_per_serving: number
          fat_per_serving: number
          is_custom: boolean
          created_by: string
          created_at: string
          updated_at: string
          last_used?: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          description?: string
          servings: number
          instructions?: string
          total_calories: number
          total_protein: number
          total_carbs: number
          total_fat: number
          calories_per_serving: number
          protein_per_serving: number
          carbs_per_serving: number
          fat_per_serving: number
          is_custom?: boolean
          created_by: string
          created_at?: string
          updated_at?: string
          last_used?: string
        }
        Update: {
          name?: string
          description?: string | null
          servings?: number
          instructions?: string | null
          total_calories?: number
          total_protein?: number
          total_carbs?: number
          total_fat?: number
          calories_per_serving?: number
          protein_per_serving?: number
          carbs_per_serving?: number
          fat_per_serving?: number
          updated_at?: string
          last_used?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "recipes_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recipes_created_by_fkey"
            columns: ["created_by"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      recipe_ingredients: {
        Row: {
          id: string
          recipe_id: string
          food_id: string
          amount: number
          order_index: number
          created_at: string
        }
        Insert: {
          id?: string
          recipe_id: string
          food_id: string
          amount: number
          order_index: number
          created_at?: string
        }
        Update: {
          amount?: number
          order_index?: number
        }
        Relationships: [
          {
            foreignKeyName: "recipe_ingredients_recipe_id_fkey"
            columns: ["recipe_id"]
            referencedRelation: "recipes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recipe_ingredients_food_id_fkey"
            columns: ["food_id"]
            referencedRelation: "foods"
            referencedColumns: ["id"]
          }
        ]
      }
      wellness_entries: {
        Row: {
          id: string
          user_id: string
          date: string
          water_intake: number
          sleep_hours?: number
          bedtime?: string
          wake_time?: string
          sleep_quality?: number
          notes?: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          date: string
          water_intake: number
          sleep_hours?: number
          bedtime?: string
          wake_time?: string
          sleep_quality?: number
          notes?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          water_intake?: number
          sleep_hours?: number | null
          bedtime?: string | null
          wake_time?: string | null
          sleep_quality?: number | null
          notes?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "wellness_entries_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          type: 'workout' | 'meal' | 'water' | 'reminder' | 'achievement'
          title: string
          message: string
          read: boolean
          action_url?: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: 'workout' | 'meal' | 'water' | 'reminder' | 'achievement'
          title: string
          message: string
          read?: boolean
          action_url?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          read?: boolean
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      quick_add_entries: {
        Row: {
          id: string
          user_id: string
          name: string
          calories: number
          protein: number
          carbs: number
          fat: number
          meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack'
          date: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          calories: number
          protein: number
          carbs: number
          fat: number
          meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack'
          date: string
          created_at?: string
        }
        Update: {
          name?: string
          calories?: number
          protein?: number
          carbs?: number
          fat?: number
          meal_type?: 'breakfast' | 'lunch' | 'dinner' | 'snack'
          date?: string
        }
        Relationships: [
          {
            foreignKeyName: "quick_add_entries_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
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
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}