export interface Auth {
  timestamp: string;
  code: string;
  message: string;
  id_user: number;
  uri: string;
  token: string;
}
