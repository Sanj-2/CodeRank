import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      rollNumber: string;
      leetcodeUsername: string;
    } & DefaultSession["user"];
  }

  interface User {
    rollNumber: string;
    leetcodeUsername: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    rollNumber: string;
    leetcodeUsername: string;
  }
}
