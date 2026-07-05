import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { registerSchema, type RegisterValues } from "~/lib/schemas";
import { ApiError, request } from "~/lib/api";
import type { AuthResponse } from "~/lib/types";
import { useAuth } from "~/context/AuthContext";
import { TextField } from "~/components/TextField";
import { Button } from "~/components/Button";

export const Route = createFileRoute("/_authLayout/register")({
  component: RegisterPage,
});

function RegisterPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterValues>({ resolver: zodResolver(registerSchema) });

  const onSubmit = async (values: RegisterValues) => {
    setFormError(null);
    try {
      const auth = await request<AuthResponse>("/auth/register", {
        method: "POST",
        body: values,
      });
      login(auth.user);
      navigate({ to: "/" });
    } catch (err) {
      setFormError(
        err instanceof ApiError ? err.message : "Something went wrong",
      );
    }
  };

  return (
    <>
      <h1 className="auth__title">Create account</h1>
      <p className="auth__subtitle">
        Already have one?{" "}
        <Link to="/login" className="link-accent">Sign in</Link>
      </p>

      {formError && (
        <div className="auth__banner auth__banner--error">{formError}</div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <TextField
          label="Name"
          autoComplete="name"
          error={errors.name?.message}
          {...register("name")}
        />
        <TextField
          label="Email"
          type="email"
          autoComplete="email"
          error={errors.email?.message}
          {...register("email")}
        />
        <TextField
          label="Password"
          passwordToggle
          autoComplete="new-password"
          error={errors.password?.message}
          {...register("password")}
        />
        <Button type="submit" fullWidth disabled={isSubmitting}>
          {isSubmitting ? "Creating…" : "Sign Up"}
        </Button>
      </form>
    </>
  );
}
