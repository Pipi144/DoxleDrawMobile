export interface User {
  userId?: string;
  userName?: string;
  email?: string;
  phone?: string;
  firstName: string;
  lastName: string;
  lastLogin?: string;
  signature: string | null;
  initial: string | null;
}
