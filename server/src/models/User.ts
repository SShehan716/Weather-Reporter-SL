export interface User {
  id: number;
  email: string;
  password: string;
  is_verified: boolean;
  verification_token?: string | null;
} 