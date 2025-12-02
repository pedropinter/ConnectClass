export type DifficultyType = 'other' | 'basic' | 'relative' | 'important';
export type LocationType = "001" | "002" | "101" | "102" | "103" | "104";

export interface SchoolEvent {
  id: number | null;     
  title: string;
  location: LocationType;
  description: string;
  start: string;
  end: string;
  difficulty: DifficultyType;
}
