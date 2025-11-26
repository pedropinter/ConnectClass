export type DifficultyType = 'other' | 'basic' | 'relative' | 'important';

export interface SchoolEvent {
  id: number | null;      // ← corrigido aqui
  title: string;
  description: string;
  start: string;
  end: string;
  difficulty: DifficultyType;
}
