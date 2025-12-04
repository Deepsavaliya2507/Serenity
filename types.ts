export interface MoodEntry {
  id: string;
  timestamp: number;
  score: number; // 1-5
  note?: string;
  tags: string[];
}

export interface JournalEntry {
  id: string;
  timestamp: number;
  content: string;
  sentiment?: 'positive' | 'neutral' | 'negative';
  aiReflection?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  isStreaming?: boolean;
}

export enum View {
  HOME = 'HOME',
  CHAT = 'CHAT',
  MOOD = 'MOOD',
  JOURNAL = 'JOURNAL',
  BREATHE = 'BREATHE'
}

export interface UserPreferences {
  name: string;
  theme: 'light' | 'dark';
}
