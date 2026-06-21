"use server";

import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { registerSchema, type RegisterInput } from "@/schemas/auth.schema";

type RegisterResult =
  | { success: true }
  | { success: false; error: string; field?: keyof RegisterInput };

const SALT_ROUNDS = 12;

export async function registerUser(input: RegisterInput): Promise<RegisterResult> {
  const parsed = registerSchema.safeParse(input);
  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0];
    return {
      success: false,
      error: firstIssue.message,
      field: firstIssue.path[0] as keyof RegisterInput,
    };
  }

  const { name, rollNumber, email, password, leetcodeUsername } = parsed.data;

  const normalizedRollNumber = rollNumber
  .trim()
  .toUpperCase()
  .replaceAll("/", "-")
  .replaceAll(" ", "");

  const existing = await prisma.user.findFirst({
    where: { OR: [{ email }, { rollNumber: normalizedRollNumber }, { leetcodeUsername }] },
    select: { email: true, rollNumber: true, leetcodeUsername: true },
  });

  if (existing) {
    if (existing.email === email) {
      return { success: false, error: "An account with this email already exists", field: "email" };
    }
    if (existing.rollNumber === normalizedRollNumber) {
      return { success: false, error: "This roll number is already registered", field: "rollNumber" };
    }
    return {
      success: false,
      error: "This LeetCode username is already linked to another account",
      field: "leetcodeUsername",
    };
  }

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  await prisma.user.create({
  data: {
    name,
    rollNumber: normalizedRollNumber,
    email,
    password: hashedPassword,
    leetcodeUsername,
  },
});

  return { success: true };
}
