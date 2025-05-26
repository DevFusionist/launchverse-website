import type { User } from 'next-auth';
import type { Student } from '@prisma/client';

export type StudentWithPassword = Student & {
  password: string | null;
};

export type StudentUser = Omit<User, 'role'> & {
  role: 'STUDENT';
};
