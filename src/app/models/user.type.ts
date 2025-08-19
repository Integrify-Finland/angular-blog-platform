export type Role = 'admin' | 'editor' | 'author';

export type User = {
  id: number;
  name: string;
  username: string;
  email: string;
  avator: string
  role: Role;
  blocked: boolean;
  bio: string
};
