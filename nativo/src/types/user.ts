export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  xp: number;
  level: number;
  streak: number;
}