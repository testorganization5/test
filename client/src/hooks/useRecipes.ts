import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { request } from "~/lib/api";
import type { Recipe } from "~/lib/types";
import type { RecipeFormValues } from "~/lib/schemas";

export interface RecipeFilters {
  search?: string;
  sort?: string;
  maxCookingTime?: number;
  mine?: boolean;
  limit?: number;
}

function toQuery(filters: RecipeFilters): string {
  const params = new URLSearchParams();
  if (filters.search) params.set("search", filters.search);
  if (filters.sort) params.set("sort", filters.sort);
  if (filters.maxCookingTime) params.set("maxCookingTime", String(filters.maxCookingTime));
  if (filters.mine) params.set("mine", "true");
  if (filters.limit) params.set("limit", String(filters.limit));
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

export const recipeKeys = {
  all: ["recipes"] as const,
  list: (filters: RecipeFilters) => ["recipes", "list", filters] as const,
  detail: (id: string) => ["recipes", "detail", id] as const,
};

export function useRecipes(filters: RecipeFilters = {}) {
  return useQuery({
    queryKey: recipeKeys.list(filters),
    queryFn: () => request<Recipe[]>(`/recipes${toQuery(filters)}`),
  });
}

export function useRecipe(id: string | undefined) {
  return useQuery({
    queryKey: recipeKeys.detail(id ?? ""),
    queryFn: () => request<Recipe>(`/recipes/${id}`),
    enabled: Boolean(id),
  });
}

export function useCreateRecipe() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (values: RecipeFormValues) =>
      request<Recipe>("/recipes", { method: "POST", body: values }),
    onSuccess: () => qc.invalidateQueries({ queryKey: recipeKeys.all }),
  });
}

export function useUpdateRecipe(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (values: RecipeFormValues) =>
      request<Recipe>(`/recipes/${id}`, { method: "PATCH", body: values }),
    onSuccess: () => qc.invalidateQueries({ queryKey: recipeKeys.all }),
  });
}

export function useDeleteRecipe() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      request<void>(`/recipes/${id}`, { method: "DELETE" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: recipeKeys.all }),
  });
}

export function useToggleRecipeLike() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, liked }: { id: string; liked: boolean }) =>
      request<Recipe>(`/recipes/${id}/like`, {
        method: liked ? "DELETE" : "PUT",
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: recipeKeys.all }),
  });
}
