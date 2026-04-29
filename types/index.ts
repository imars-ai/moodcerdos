export type MoodType = 'incredible' | 'very-good' | 'good' | 'normal' | 'bad' | 'horrible';
export type EnergyLevel = 'low' | 'medium' | 'high';

export interface MoodEntry {
  id: string;
  date: string; // YYYY-MM-DD format
  mood: MoodType;
  score: number; // 1-10
  energy: EnergyLevel;
  word: string;
  note: string;
  aiInsight?: string;
  createdAt: number;
  updatedAt: number;
}

export const MOOD_COLORS: Record<MoodType, string> = {
  'incredible': 'bg-mood-incredible text-background',
  'very-good': 'bg-mood-very-good text-background',
  'good': 'bg-mood-good text-background',
  'normal': 'bg-mood-normal text-white',
  'bad': 'bg-mood-bad text-white',
  'horrible': 'bg-mood-horrible text-white',
};

export const MOOD_LABELS: Record<MoodType, string> = {
  'incredible': 'Increíble',
  'very-good': 'Muy Bien',
  'good': 'Bien',
  'normal': 'Normal',
  'bad': 'Mal',
  'horrible': 'Horrible',
};
