import { IHTML_Challenge } from './IHTML_Challenge';
import { IHTML_Solution_Like } from './IHTML_Solution_Like';
import { IUser } from './IUser';

export interface IHTML_Solution {
  id?: string;
  solution_submitted?: string;
  user_id?: string;
  html_challenge_id?: string;
  User?: IUser;
  Likes?: IHTML_Solution_Like[];
  HTML_Challenge?: IHTML_Challenge;
}
