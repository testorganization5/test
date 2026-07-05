import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { loginSchema, type LoginValues } from "~/lib/schemas";
import { ApiError, request } from "~/lib/api";
import type { AuthResponse } from "~/lib/types";
import { useAuth } from "~/context/AuthContext";
import { TextField } from "~/components/TextField";
import { Button } from "~/components/Button";

export const Route = createFileRoute("/_authLayout/login")({
  validateSearch: z.object({ redirect: z.string().optional() }),
  component: LoginPage,
});

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { redirect } = Route.useSearch();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (values: LoginValues) => {
    setFormError(null);
    try {
      const auth = await request<AuthResponse>("/auth/login", {
        method: "POST",
        body: values,
        auth: false,
      });
      login(auth);
      navigate({ to: redirect ?? "/" });
    } catch (err) {
      setFormError(
        err instanceof ApiError ? err.message : "Something went wrong",
      );
    }
  };

  return (
    <>
      <h1 className="auth__title">Welcome back</h1>
      <p className="auth__subtitle">
        New here? <Link to="/register" className="link-accent">Create an account</Link>
      </p>

      {formError && (
        <div className="auth__banner auth__banner--error">{formError}</div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
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
          autoComplete="current-password"
          error={errors.password?.message}
          {...register("password")}
        />
        <div className="auth__row">
          <span />
          <Link to="/forgot-password" className="auth__forgot">
            Forgot password?
          </Link>
        </div>
        <Button type="submit" fullWidth disabled={isSubmitting}>
          {isSubmitting ? "Signing in…" : "Sign In"}
        </Button>
      </form>
    </>
  );
}
