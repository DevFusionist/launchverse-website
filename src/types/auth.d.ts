import 'next-auth';
import { DefaultSession, DefaultUser } from 'next-auth';
import { JWT as DefaultJWT } from 'next-auth/jwt';

export type UserRole = 'ADMIN' | 'SUPER_ADMIN' | 'STUDENT';

export interface User extends Omit<DefaultUser, 'role'> {
  role: UserRole;
}

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: UserRole;
    } & Omit<DefaultSession['user'], 'role'>;
  }

  interface User extends Omit<DefaultUser, 'role'> {
    role: UserRole;
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends Omit<DefaultJWT, 'role'> {
    id: string;
    role: UserRole;
  }
}
