export interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  is_verified: boolean;
  verification_token?: string | null;
} 