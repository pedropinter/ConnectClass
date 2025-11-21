export type DifficultyType = 'other' | 'basic' | 'relative' | 'important';

export interface SchoolEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  difficulty: DifficultyType;
}
