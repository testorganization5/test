import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { useRecipes, useDeleteRecipe } from "~/hooks/useRecipes";
import { RecipeCard } from "~/components/RecipeCard";
import { RecipeForm } from "~/components/RecipeForm";
import { RecipeDetail } from "~/components/RecipeDetail";
import { Modal } from "~/components/Modal";
import { Button } from "~/components/Button";
import { Spinner } from "~/components/Spinner";

const searchSchema = z.object({
  create: z.boolean().optional(),
  edit: z.string().optional(),
  recipe: z.string().optional(),
});

export const Route = createFileRoute("/_appLayout/profile/recipes")({
  validateSearch: searchSchema,
  component: MyRecipes,
});

function MyRecipes() {
  const params = Route.useSearch();
  const navigate = useNavigate();
  const { data, isLoading } = useRecipes({ mine: true });
  const deleteRecipe = useDeleteRecipe();

  const patch = (next: Partial<typeof params>) =>
    navigate({ to: "/profile/recipes", search: { ...params, ...next } });

  const editing = data?.find((r) => r.id === params.edit);

  return (
    <>
      <div className="profile__toolbar">
        <Button onClick={() => patch({ create: true })}>
          Create New Recipe
        </Button>
      </div>

      {isLoading ? (
        <Spinner />
      ) : data && data.length > 0 ? (
        <div className="profile__grid">
          {data.map((r) => (
            <RecipeCard
              key={r.id}
              recipe={r}
              onOpen={(id) => patch({ recipe: id })}
              actions={
                <>
                  <button
                    className="card__action"
                    onClick={(e) => {
                      e.stopPropagation();
                      patch({ edit: r.id });
                    }}
                  >
                    Edit Recipe
                  </button>
                  <button
                    className="card__action card__action--danger"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm(`Delete "${r.title}"?`))
                        deleteRecipe.mutate(r.id);
                    }}
                  >
                    Delete Recipe
                  </button>
                </>
              }
            />
          ))}
        </div>
      ) : (
        <p className="muted">
          You haven't created any recipes yet. Click "Create New Recipe".
        </p>
      )}

      <Modal
        open={Boolean(params.create || editing)}
        onClose={() => patch({ create: undefined, edit: undefined })}
        width={640}
      >
        <RecipeForm
          recipe={editing}
          onDone={() => patch({ create: undefined, edit: undefined })}
        />
      </Modal>

      <Modal
        open={Boolean(params.recipe)}
        onClose={() => patch({ recipe: undefined })}
        width={820}
      >
        {params.recipe && <RecipeDetail id={params.recipe} />}
      </Modal>
    </>
  );
}
