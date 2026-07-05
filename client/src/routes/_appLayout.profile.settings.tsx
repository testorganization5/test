import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  changePasswordSchema,
  profileSchema,
  type ChangePasswordValues,
  type ProfileValues,
} from "~/lib/schemas";
import { useChangePassword, useUpdateProfile } from "~/hooks/useProfile";
import { useAuth } from "~/context/AuthContext";
import { ApiError } from "~/lib/api";
import { Modal } from "~/components/Modal";
import { TextField } from "~/components/TextField";
import { TextArea } from "~/components/TextArea";
import { Button } from "~/components/Button";

export const Route = createFileRoute("/_appLayout/profile/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  const { user } = useAuth();
  const [editProfile, setEditProfile] = useState(false);
  const [editPassword, setEditPassword] = useState(false);

  return (
    <div className="settings">
      <h2 className="settings__title">Personal information</h2>

      <div className="settings__row">
        <span className="settings__key">Name</span>
        <span>{user?.name}</span>
        <button className="settings__edit" onClick={() => setEditProfile(true)}>
          Edit
        </button>
      </div>
      <div className="settings__row">
        <span className="settings__key">Email</span>
        <span>{user?.email}</span>
        <button className="settings__edit" onClick={() => setEditProfile(true)}>
          Edit
        </button>
      </div>
      <div className="settings__row">
        <span className="settings__key">Password</span>
        <span>••••••••</span>
        <button className="settings__edit" onClick={() => setEditPassword(true)}>
          Change My Password
        </button>
      </div>

      <Modal open={editProfile} onClose={() => setEditProfile(false)} width={480}>
        <ProfileForm onDone={() => setEditProfile(false)} />
      </Modal>
      <Modal open={editPassword} onClose={() => setEditPassword(false)} width={480}>
        <PasswordForm onDone={() => setEditPassword(false)} />
      </Modal>
    </div>
  );
}

function ProfileForm({ onDone }: { onDone: () => void }) {
  const { user, setUser } = useAuth();
  const updateProfile = useUpdateProfile();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name ?? "",
      email: user?.email ?? "",
      bio: user?.bio ?? "",
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null);
    try {
      const updated = await updateProfile.mutateAsync(values);
      setUser(updated);
      onDone();
    } catch (err) {
      setFormError(err instanceof ApiError ? err.message : "Something went wrong");
    }
  });

  return (
    <form onSubmit={onSubmit} noValidate>
      <h2 className="entity-form__title">Edit profile</h2>
      {formError && (
        <div className="auth__banner auth__banner--error">{formError}</div>
      )}
      <TextField label="Name" error={errors.name?.message} {...register("name")} />
      <TextField
        label="Email"
        type="email"
        error={errors.email?.message}
        {...register("email")}
      />
      <TextArea label="Bio" error={errors.bio?.message} {...register("bio")} />
      <div className="entity-form__actions">
        <Button type="button" variant="outline" onClick={onDone}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          Save
        </Button>
      </div>
    </form>
  );
}

function PasswordForm({ onDone }: { onDone: () => void }) {
  const changePassword = useChangePassword();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordValues>({
    resolver: zodResolver(changePasswordSchema),
  });

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null);
    try {
      await changePassword.mutateAsync({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });
      onDone();
    } catch (err) {
      setFormError(err instanceof ApiError ? err.message : "Something went wrong");
    }
  });

  return (
    <form onSubmit={onSubmit} noValidate>
      <h2 className="entity-form__title">Change password</h2>
      {formError && (
        <div className="auth__banner auth__banner--error">{formError}</div>
      )}
      <TextField
        label="Current password"
        passwordToggle
        error={errors.currentPassword?.message}
        {...register("currentPassword")}
      />
      <TextField
        label="New password"
        passwordToggle
        error={errors.newPassword?.message}
        {...register("newPassword")}
      />
      <TextField
        label="Confirm new password"
        passwordToggle
        error={errors.confirmPassword?.message}
        {...register("confirmPassword")}
      />
      <div className="entity-form__actions">
        <Button type="button" variant="outline" onClick={onDone}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          Update password
        </Button>
      </div>
    </form>
  );
}
