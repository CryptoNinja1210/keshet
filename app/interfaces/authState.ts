import { User } from "./User";
export interface AuthState {
    isLoggingIn: boolean;
    isLoggedIn: boolean;
    user: User | null; 
    error: string | null;
  }
  
  