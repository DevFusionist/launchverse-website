export type UserRole = 'ADMIN' | 'SUPER_ADMIN' | 'STUDENT';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

// Extend the next-auth types
declare module 'next-auth' {
  interface Session {
    user: User;
  }

  interface User {
    id: string;
    role: UserRole;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: UserRole;
  }
}
