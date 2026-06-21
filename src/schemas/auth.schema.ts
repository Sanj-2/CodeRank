import { z } from "zod";

// DTU roll numbers: e.g. 2K22/CO/123 — kept permissive but bounded so we don't
// accidentally reject legitimate formats across branches/years.
const ROLL_NUMBER_REGEX = /^[A-Za-z0-9/]{6,15}$/;

export const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(80, "Name is too long"),
  rollNumber: z
    .string()
    .trim()
    .regex(ROLL_NUMBER_REGEX, "Enter a valid DTU roll number"),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Enter a valid email")
    .refine((val) => val.endsWith("@dtu.ac.in"), {
      message: "Use your DTU email (@dtu.ac.in)",
    }),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Include at least one uppercase letter")
    .regex(/[0-9]/, "Include at least one number"),
  leetcodeUsername: z
    .string()
    .trim()
    .min(1, "LeetCode username is required")
    .max(50, "LeetCode username is too long"),
});

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
