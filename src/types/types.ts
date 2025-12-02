export interface Summaries {
  short: string;
  medium: string;
  long: string;
}

export interface Flashcard {
  front: string;
  back: string;
}

export interface MCQ {
  question: string;
  options: string[];
  answer: string;
}

export interface Quiz {
  mcqs: MCQ[];
  short_questions: string[];
}

export interface GeneratedContent {
  summaries: Summaries | null;
  flashcards: Flashcard[] | null;
  quiz: Quiz | null;
  timestamp?: Date; // Add optional timestamp
}

export interface MasteryProgress {
  score: number;
  attempts: number;
  timestamp: Date;
  documentNames: string[];
}

export interface UploadedFile {
  name: string;
  text: string;
}

export interface HistoryItem {
  id: string;
  name: string;
  content: GeneratedContent;
  timestamp: Date;
}
