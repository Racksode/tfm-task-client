import { Prisma, type UserRole, type UserStatus } from "@prisma/client";
import { compare } from "bcryptjs";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

import { prisma } from "@/lib/prisma";

/** Mensaje genérico (sin filtrar tipo de BD ni infra) ante fallo de conexión. */
const CONNECTION_ERROR_MESSAGE =
  "No se puede conectar con el servidor. Inténtalo de nuevo más tarde.";

/** True si el error de Prisma es de conexión/inicialización (códigos `P1xxx`). */
const isConnectionError = (error: unknown): boolean =>
  error instanceof Prisma.PrismaClientInitializationError ||
  (error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code.startsWith("P1"));

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

        let user;
        try {
          user = await prisma.user.findUnique({
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
        } catch (error) {
          // Fallo de conexión: se re-lanza para distinguirlo de "credenciales mal"
          // (la acción de login lo mostrará como error de conexión). Solo se avisa
          // con un mensaje genérico; el resto de errores también se propagan.
          if (isConnectionError(error)) {
            console.error(CONNECTION_ERROR_MESSAGE);
          }
          throw error;
        }

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

      let currentUser;
      try {
        currentUser = await prisma.user.findUnique({
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
      } catch (error) {
        // Fallo de conexión: no deslogueamos por un corte transitorio; se conserva
        // el token y se avisa con un mensaje genérico. Cualquier otro error (p. ej.
        // de esquema) se re-lanza para no ocultar bugs.
        if (isConnectionError(error)) {
          console.error(CONNECTION_ERROR_MESSAGE);
          return token;
        }

        throw error;
      }

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
