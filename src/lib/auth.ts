import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { compare } from 'bcryptjs';
import { prisma } from './prisma';
import { AdminRole } from '@prisma/client';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        mode: { label: 'Mode', type: 'text' }, // 'admin' or 'student'
      },
      async authorize(credentials) {
        if (
          !credentials?.email ||
          !credentials?.password ||
          !credentials?.mode
        ) {
          throw new Error('Missing credentials');
        }

        const { email, password, mode } = credentials;

        if (mode === 'admin') {
          // Admin authentication
          const admin = await prisma.admin.findUnique({
            where: { email },
          });

          if (!admin) {
            throw new Error('Invalid email or password');
          }

          const isValid = await compare(password, admin.password);

          if (!isValid) {
            throw new Error('Invalid email or password');
          }

          return {
            id: admin.id,
            email: admin.email,
            name: admin.name,
            role: admin.role,
          };
        } else if (mode === 'student') {
          // Student authentication
          const student = await prisma.student.findUnique({
            where: { email },
          });

          if (!student || !student.password) {
            throw new Error('Invalid email or password');
          }

          const isValid = await compare(password, student.password);

          if (!isValid) {
            throw new Error('Invalid email or password');
          }

          return {
            id: student.id,
            email: student.email,
            name: student.name,
            role: 'STUDENT' as const,
          };
        }

        throw new Error('Invalid mode');
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.user.role = token.role as AdminRole | 'STUDENT';
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
};
