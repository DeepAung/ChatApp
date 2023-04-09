import { Token } from "./Token";
import { User } from "./User";

export type AuthContextType = {
  user: User | undefined;
  token: Token | undefined;
  login: (inputData: object) => void;
  logout: () => void;
  register: (inputData: object) => void;
};
