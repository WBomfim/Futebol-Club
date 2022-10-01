import Login from './Login';

export default interface User extends Login {
  id: number;
  username: string;
  role: string;
}
