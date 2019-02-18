export interface Message {
  
  content: string;
  style:  string;
  dismissed: boolean;
  gameId: string;
  id?: string;
  timestamp?: string;

}