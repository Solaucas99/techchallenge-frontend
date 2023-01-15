import { IQuiz_Challenge } from './IQuiz_Challenge';

export interface IQuiz_Question {
  id?: string;
  question_text?: string;
  option_1?: string;
  option_2?: string;
  option_3?: string;
  option_4?: string;
  correct_answer?: number;
  question_score?: number;
  quiz_challenge_id?: string;
  Quiz_Challenge?: IQuiz_Challenge;
}
