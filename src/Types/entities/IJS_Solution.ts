import { IJS_Challenge } from './IJS_Challenge';
import { IJS_Solution_Like } from './IJS_Solution_Like';
import { IUser } from './IUser';

export interface IJS_Solution {
  id?: string;
  solution_submitted?: string;
  user_id?: string;
  js_challenge_id?: string;
  User?: IUser;
  Likes?: IJS_Solution_Like[];
  JS_Challenge?: IJS_Challenge;
}
