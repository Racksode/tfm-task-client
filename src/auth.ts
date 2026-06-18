import type { UserRole, UserStatus } from "@prisma/client";
import { compare } from "bcryptjs";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

import { prisma } from "@/lib/prisma";

type ParsedCredentials = {
  email: string;
  password: string;
};

const parseCredentials = (
  credentials: Partial<Record<"email" | "password", unknown>> | undefined,
): ParsedCredentials | null => {
  const email = credentials?.email;
  const password = credentials?.password;

  if (typeof email !== "string" || typeof password !== "string") {
    return null;
  }

  const normalizedEmail = email.trim().toLowerCase();

  if (!normalizedEmail || !password) {
    return null;
  }

  return {
    email: normalizedEmail,
    password,
  };
};

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsedCredentials = parseCredentials(credentials);

        if (!parsedCredentials) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: {
            email: parsedCredentials.email,
          },
          select: {
            id: true,
            name: true,
            email: true,
            passwordHash: true,
            role: true,
            status: true,
            clientId: true,
          },
        });

        if (!user || user.status !== "ACTIVE" || !user.passwordHash) {
          return null;
        }

        const passwordsMatch = await compare(
          parsedCredentials.password,
          user.passwordHash,
        );

        if (!passwordsMatch) {
          return null;
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          status: user.status,
          clientId: user.clientId,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.sub = user.id;
      }

      const userId =
        typeof token.id === "string"
          ? token.id
          : typeof token.sub === "string"
            ? token.sub
            : null;

      if (!userId) {
        return null;
      }

      const currentUser = await prisma.user.findUnique({
        where: {
          id: userId,
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          status: true,
          clientId: true,
        },
      });

      if (!currentUser || currentUser.status !== "ACTIVE") {
        return null;
      }

      token.id = currentUser.id;
      token.sub = currentUser.id;
      token.name = currentUser.name;
      token.email = currentUser.email;
      token.role = currentUser.role;
      token.status = currentUser.status;
      token.clientId = currentUser.clientId;

      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as UserRole;
        session.user.status = token.status as UserStatus;
        session.user.clientId = token.clientId as string | null;
      }

      return session;
    },
  },
});
