import { UserI } from '../user/user.interface';

export interface UserTokenI {
  _id: string;
  name: string;
  email: string;
  role: string;
}

export interface UserWithTokenI {
  user: UserI;
  token?: string;
  new?: boolean;
}

export interface GoogleUserI {
  id: string;
  email: string;
  name: string;
  familyName: string;
  givenName: string;
  imageUrl: string;
  serverAuthCode: string;
  authentication: GoogleAuthenticationI;
}
export interface GoogleAuthenticationI {
  accessToken: string;
  idToken: string;
  refreshToken?: string;
}
