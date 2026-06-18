import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const MIN_PASSWORD_LENGTH = 8;
const SALT_ROUNDS = 12;

const connectionString = process.env.DATABASE_URL;
const email = process.env.BOOTSTRAP_USER_EMAIL?.trim().toLowerCase();
const name = process.env.BOOTSTRAP_USER_NAME?.trim();
const password = process.env.BOOTSTRAP_USER_PASSWORD;

const fail = (message) => {
  console.error(`Bootstrap aborted: ${message}`);
  process.exitCode = 1;
};

const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

if (!connectionString) {
  fail("DATABASE_URL is required.");
} else if (!email || !isValidEmail(email)) {
  fail("BOOTSTRAP_USER_EMAIL must be a valid email.");
} else if (!name) {
  fail("BOOTSTRAP_USER_NAME is required.");
} else if (!password || password.length < MIN_PASSWORD_LENGTH) {
  fail(
    `BOOTSTRAP_USER_PASSWORD must have at least ${MIN_PASSWORD_LENGTH} characters.`,
  );
}

if (process.exitCode) {
  process.exit();
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

try {
  const existingSuperadmin = await prisma.user.findFirst({
    where: {
      role: "SUPERADMIN",
    },
    select: {
      id: true,
    },
  });

  if (existingSuperadmin) {
    fail("a SUPERADMIN user already exists.");
    process.exit();
  }

  const existingEmail = await prisma.user.findUnique({
    where: {
      email,
    },
    select: {
      id: true,
    },
  });

  if (existingEmail) {
    fail("a user with BOOTSTRAP_USER_EMAIL already exists.");
    process.exit();
  }

  const passwordHash = await hash(password, SALT_ROUNDS);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      passwordHash,
      role: "SUPERADMIN",
      status: "ACTIVE",
      clientId: null,
    },
    select: {
      id: true,
      email: true,
      role: true,
      status: true,
    },
  });

  console.log(
    `Bootstrap completed: created ${user.role} user ${user.email} with status ${user.status}.`,
  );
} catch (error) {
  console.error("Bootstrap failed.");
  console.error(error instanceof Error ? error.message : "Unknown error.");
  process.exitCode = 1;
} finally {
  await prisma.$disconnect();
}
