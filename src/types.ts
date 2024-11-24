export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
}

export interface QuizSet {
  id: string;
  topic: string;
  questions: Question[];
  createdAt: Date;
}