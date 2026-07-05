import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { request } from "~/lib/api";
import type { Comment } from "~/lib/types";

type Target = "recipe" | "cookbook";

const path = (target: Target, id: string) =>
  target === "recipe" ? `/recipes/${id}/comments` : `/cookbooks/${id}/comments`;

export const commentKeys = {
  list: (target: Target, id: string) => ["comments", target, id] as const,
};

export function useComments(target: Target, id: string | undefined) {
  return useQuery({
    queryKey: commentKeys.list(target, id ?? ""),
    queryFn: () => request<Comment[]>(path(target, id!)),
    enabled: Boolean(id),
  });
}

export function useAddComment(target: Target, id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (text: string) =>
      request<Comment>(path(target, id), { method: "POST", body: { text } }),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: commentKeys.list(target, id) }),
  });
}

export function useDeleteComment(target: Target, id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (commentId: string) =>
      request<void>(`/comments/${commentId}`, { method: "DELETE" }),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: commentKeys.list(target, id) }),
  });
}
