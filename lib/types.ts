// Team model
export interface Team {
  id: number;
  city: string;
  mascot: string;
  primary_color: string;
  secondary_color?: string | null;
  logo_url?: string | null;
}
  
// Person model
export interface Person {
  id: number;
  name: string;
  favorite_team_id?: number | null;
  // Join fields
  city?: string;
  mascot?: string;
  primary_color?: string;
  secondary_color?: string;
}

export type DraftablePlayerType = "good"| "mid" |"bad";

export interface Beverage {
  name: string;
  quality: DraftablePlayerType;
}

// Draftable Player model
export interface DraftablePlayer {
  id: number;
  name: string;
  type: DraftablePlayerType;
  image_url?: string | null;
  draft_id?: number | null;
  // Join fields
  draft_name?: string;
}

// Draft model
export interface Draft {
  id: number;
  name: string;
  date: string;
}

// Draft Pick model
export interface DraftPick {
  id: number;
  draft_order: number;
  person_id: number;
  draft_id: number;
  drafted_player_id: number;
  // Join fields
  person_name?: string;
  player_name?: string;
  player_image?: string;
  player_type?: DraftablePlayerType;
  team_primary_color?: string;
  team_secondary_color?: string;
}