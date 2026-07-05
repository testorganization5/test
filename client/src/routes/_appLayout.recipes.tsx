import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { useRecipes } from "~/hooks/useRecipes";
import { FilterSidebar, FilterGroup } from "~/components/FilterSidebar";
import { RecipeRow } from "~/components/RecipeRow";
import { RecipeDetail } from "~/components/RecipeDetail";
import { Modal } from "~/components/Modal";
import { Spinner } from "~/components/Spinner";
import "~/styles/search.css";

const searchSchema = z.object({
  search: z.string().optional(),
  sort: z.enum(["popularity", "rating", "cooking-time", "newest"]).optional(),
  maxCookingTime: z.number().optional(),
  recipe: z.string().optional(),
});

export const Route = createFileRoute("/_appLayout/recipes")({
  validateSearch: searchSchema,
  component: RecipesPage,
});

function RecipesPage() {
  const params = Route.useSearch();
  const navigate = useNavigate();

  const { data, isLoading } = useRecipes({
    search: params.search,
    sort: params.sort ?? "popularity",
    maxCookingTime: params.maxCookingTime,
  });

  const patch = (next: Partial<typeof params>) =>
    navigate({ to: "/recipes", search: { ...params, ...next } });

  return (
    <div className="container page search">
      <FilterSidebar onClear={() => navigate({ to: "/recipes", search: {} })}>
        <FilterGroup label="Sort by">
          <select
            className="filters__select"
            value={params.sort ?? "popularity"}
            onChange={(e) => patch({ sort: e.target.value as never })}
          >
            <option value="popularity">Popularity</option>
            <option value="rating">Rating</option>
            <option value="cooking-time">Cooking time</option>
            <option value="newest">Newest</option>
          </select>
        </FilterGroup>

        <FilterGroup label="Cooking Time">
          <input
            className="filters__range"
            type="range"
            min={10}
            max={120}
            step={5}
            value={params.maxCookingTime ?? 120}
            onChange={(e) =>
              patch({
                maxCookingTime:
                  Number(e.target.value) >= 120
                    ? undefined
                    : Number(e.target.value),
              })
            }
          />
          <div className="filters__range-labels">
            <span>10 min</span>
            <span>
              {params.maxCookingTime ? `≤ ${params.maxCookingTime} min` : "Any"}
            </span>
            <span>2 hrs</span>
          </div>
        </FilterGroup>
      </FilterSidebar>

      <div className="search__main">
        <div className="tabs">
          <Link to="/cookbooks" className="tabs__tab">
            Cookbooks
          </Link>
          <Link to="/recipes" className="tabs__tab tabs__tab--active">
            Recipes
          </Link>
        </div>

        {isLoading ? (
          <Spinner />
        ) : data && data.length > 0 ? (
          <div className="search__list">
            {data.map((r) => (
              <RecipeRow
                key={r.id}
                recipe={r}
                onOpen={(id) => patch({ recipe: id })}
              />
            ))}
          </div>
        ) : (
          <p className="muted">No recipes match your filters.</p>
        )}
      </div>

      <Modal
        open={Boolean(params.recipe)}
        onClose={() => patch({ recipe: undefined })}
        width={820}
      >
        {params.recipe && <RecipeDetail id={params.recipe} />}
      </Modal>
    </div>
  );
}
