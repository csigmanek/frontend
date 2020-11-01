export interface Ask {
  direction: number[];
  questionBefore: string;
  questionAfter: string;
}
export interface Quiz {
  ask: Ask[];
  answers: string[][];
  category: string;
  description: string;
  pAnswers: (undefined | string[])[];
}
