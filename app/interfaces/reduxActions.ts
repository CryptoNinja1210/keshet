import { User } from "./User";

export interface LoginAction {
    type: 'LOGIN';
    payload: User;
  }
  
export interface LogoutAction {
    type: 'LOGOUT';
  }

  interface LoginRequestAction {
    type: 'LOGIN_REQUEST';
  }
  
  interface LoginSuccessAction {
    type: 'LOGIN_SUCCESS';
    payload: User;
  }
  
  interface LoginFailureAction {
    type: 'LOGIN_FAILURE';
    payload: string;
  }
  
 export type AuthAction = 
    | LoginRequestAction 
    | LoginSuccessAction 
    | LoginFailureAction 
    | LogoutAction;
  