import { createFileRoute, Link } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import {
  forgotPasswordSchema,
  type ForgotPasswordValues,
} from "~/lib/schemas";
import { ApiError, request } from "~/lib/api";
import { TextField } from "~/components/TextField";
import { Button } from "~/components/Button";

export const Route = createFileRoute("/_authLayout/forgot-password")({
  component: ForgotPasswordPage,
});

interface ForgotResponse {
  message: string;
  resetToken?: string;
}

function ForgotPasswordPage() {
  const [error, setError] = useState<string | null>(null);
  const [resetToken, setResetToken] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (values: ForgotPasswordValues) => {
    setError(null);
    try {
      const res = await request<ForgotResponse>("/auth/forgot-password", {
        method: "POST",
        body: values,
      });
      // Demo backend returns the token directly (normally emailed).
      setResetToken(res.resetToken ?? "");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong");
    }
  };

  return (
    <>
      <h1 className="auth__title">Forgot password?</h1>
      <p className="auth__subtitle">
        Enter your email and we'll send a reset link.
      </p>

      {error && <div className="auth__banner auth__banner--error">{error}</div>}

      {resetToken !== null ? (
        <div className="auth__banner auth__banner--success">
          <p>Reset link generated. For this demo, use the token below:</p>
          <p style={{ margin: "8px 0", wordBreak: "break-all" }}>
            <code>{resetToken}</code>
          </p>
          <Link
            to="/reset-password"
            search={{ token: resetToken }}
            className="link-accent"
          >
            Continue to reset password →
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <TextField
            label="Email"
            type="email"
            autoComplete="email"
            error={errors.email?.message}
            {...register("email")}
          />
          <Button type="submit" fullWidth disabled={isSubmitting}>
            {isSubmitting ? "Sending…" : "Send reset link"}
          </Button>
        </form>
      )}

      <p className="auth__footer">
        <Link to="/login" className="link-accent">
          Back to sign in
        </Link>
      </p>
    </>
  );
}
