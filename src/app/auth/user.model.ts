export interface User {
  uid?: string;
  email?: string;
  photoURL?: string;
  displayName?: string;
  
  participating?: string[];
  playing?: string[];
  judging?: string[];

}
