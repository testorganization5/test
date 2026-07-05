import { useMutation } from "@tanstack/react-query";
import { request } from "~/lib/api";
import type { User } from "~/lib/types";
import type { ChangePasswordValues, ProfileValues } from "~/lib/schemas";

export function useUpdateProfile() {
  return useMutation({
    mutationFn: (values: ProfileValues) =>
      request<User>("/me", { method: "PATCH", body: values }),
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: (values: Pick<ChangePasswordValues, "currentPassword" | "newPassword">) =>
      request<{ message: string }>("/me/password", {
        method: "PATCH",
        body: values,
      }),
  });
}
