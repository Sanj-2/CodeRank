"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { registerSchema, type RegisterInput } from "@/schemas/auth.schema";
import { registerUser } from "@/actions/auth.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function RegisterForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (values: RegisterInput) => {
    setIsSubmitting(true);
    const result = await registerUser(values);

    if (!result.success) {
      if (result.field) {
        setError(result.field, { message: result.error });
      }
      toast.error(result.error);
      setIsSubmitting(false);
      return;
    }

    // Auto sign-in right after registration so the user lands straight on the dashboard.
    const signInResult = await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: false,
    });

    setIsSubmitting(false);

    if (signInResult?.error) {
      toast.success("Account created — please log in.");
      router.push("/login");
      return;
    }

    toast.success("Welcome to CodeRank!");
    router.push("/dashboard");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="name">Full name</Label>
        <Input id="name" placeholder="Aman Sharma" {...register("name")} />
        {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="rollNumber">Roll number</Label>
        <Input id="rollNumber" placeholder="2K22/CO/123" {...register("rollNumber")} />
        {errors.rollNumber && (
          <p className="text-xs text-destructive">{errors.rollNumber.message}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="email">DTU email</Label>
        <Input id="email" type="email" placeholder="you@dtu.ac.in" {...register("email")} />
        {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="leetcodeUsername">LeetCode username</Label>
        <Input id="leetcodeUsername" placeholder="your_lc_handle" {...register("leetcodeUsername")} />
        {errors.leetcodeUsername && (
          <p className="text-xs text-destructive">{errors.leetcodeUsername.message}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="password">Password</Label>
        <Input id="password" type="password" {...register("password")} />
        {errors.password && (
          <p className="text-xs text-destructive">{errors.password.message}</p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Creating account…" : "Create account"}
      </Button>
    </form>
  );
}
