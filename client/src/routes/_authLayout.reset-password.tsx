import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import {
  resetPasswordSchema,
  type ResetPasswordValues,
} from "~/lib/schemas";
import { ApiError, request } from "~/lib/api";
import { TextField } from "~/components/TextField";
import { Button } from "~/components/Button";

export const Route = createFileRoute("/_authLayout/reset-password")({
  validateSearch: z.object({ token: z.string().optional() }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const { token } = Route.useSearch();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { token: token ?? "" },
  });

  const onSubmit = async (values: ResetPasswordValues) => {
    setError(null);
    try {
      await request("/auth/reset-password", {
        method: "POST",
        body: { token: values.token, password: values.password },
      });
      navigate({ to: "/login" });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong");
    }
  };

  return (
    <>
      <h1 className="auth__title">Reset password</h1>
      <p className="auth__subtitle">Choose a new password for your account.</p>

      {error && <div className="auth__banner auth__banner--error">{error}</div>}

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <TextField
          label="Reset token"
          error={errors.token?.message}
          {...register("token")}
        />
        <TextField
          label="New password"
          passwordToggle
          autoComplete="new-password"
          error={errors.password?.message}
          {...register("password")}
        />
        <TextField
          label="Confirm password"
          passwordToggle
          autoComplete="new-password"
          error={errors.confirmPassword?.message}
          {...register("confirmPassword")}
        />
        <Button type="submit" fullWidth disabled={isSubmitting}>
          {isSubmitting ? "Resetting…" : "Reset password"}
        </Button>
      </form>

      <p className="auth__footer">
        <Link to="/login" className="link-accent">
          Back to sign in
        </Link>
      </p>
    </>
  );
}
