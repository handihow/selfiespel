import { AuthMethod } from './auth-method.model';

export interface User {
  uid?: string;
  email?: string;
  photoURL?: string;
  displayName?: string;
  authMethod?: AuthMethod;
  providerId?: string;
  participating?: string[];
  playing?: string[];
  judging?: string[];

}
