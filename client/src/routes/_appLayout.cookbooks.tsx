import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { useCookbooks } from "~/hooks/useCookbooks";
import { FilterSidebar, FilterGroup } from "~/components/FilterSidebar";
import { Checkbox } from "~/components/Checkbox";
import { CookbookCard } from "~/components/CookbookCard";
import { CookbookDetail } from "~/components/CookbookDetail";
import { Modal } from "~/components/Modal";
import { Spinner } from "~/components/Spinner";
import type { CookbookType } from "~/lib/types";
import "~/styles/search.css";

const TYPES: { value: CookbookType; label: string }[] = [
  { value: "vegetarian", label: "Vegetarian" },
  { value: "without-milk", label: "Without Milk" },
  { value: "without-eggs", label: "Without Eggs" },
];

const searchSchema = z.object({
  search: z.string().optional(),
  sort: z.enum(["popularity", "rating", "newest"]).optional(),
  type: z.array(z.enum(["vegetarian", "without-milk", "without-eggs"])).optional(),
  hideMine: z.boolean().optional(),
  cookbook: z.string().optional(),
});

export const Route = createFileRoute("/_appLayout/cookbooks")({
  validateSearch: searchSchema,
  component: CookbooksPage,
});

function CookbooksPage() {
  const params = Route.useSearch();
  const navigate = useNavigate();

  const { data, isLoading } = useCookbooks({
    search: params.search,
    sort: params.sort ?? "popularity",
    type: params.type,
    hideMine: params.hideMine,
  });

  // Helper to patch the URL search params (keeps everything URL-driven).
  const patch = (next: Partial<typeof params>) =>
    navigate({ to: "/cookbooks", search: { ...params, ...next } });

  const toggleType = (value: CookbookType) => {
    const current = new Set(params.type ?? []);
    current.has(value) ? current.delete(value) : current.add(value);
    patch({ type: current.size ? [...current] : undefined });
  };

  return (
    <div className="container page search">
      <FilterSidebar
        onClear={() =>
          navigate({ to: "/cookbooks", search: {} })
        }
      >
        <FilterGroup label="Sort by">
          <select
            className="filters__select"
            value={params.sort ?? "popularity"}
            onChange={(e) => patch({ sort: e.target.value as never })}
          >
            <option value="popularity">Popularity</option>
            <option value="rating">Rating</option>
            <option value="newest">Newest</option>
          </select>
        </FilterGroup>

        <FilterGroup label="Cookbook type">
          {TYPES.map((t) => (
            <Checkbox
              key={t.value}
              label={t.label}
              checked={params.type?.includes(t.value) ?? false}
              onChange={() => toggleType(t.value)}
            />
          ))}
        </FilterGroup>

        <FilterGroup label="Visibility">
          <Checkbox
            label="Hide My Cookbooks"
            checked={params.hideMine ?? false}
            onChange={(e) => patch({ hideMine: e.target.checked || undefined })}
          />
        </FilterGroup>
      </FilterSidebar>

      <div className="search__main">
        <div className="tabs">
          <Link to="/cookbooks" className="tabs__tab tabs__tab--active">
            Cookbooks
          </Link>
          <Link to="/recipes" className="tabs__tab">
            Recipes
          </Link>
        </div>

        {isLoading ? (
          <Spinner />
        ) : data && data.length > 0 ? (
          <div className="search__grid">
            {data.map((c) => (
              <CookbookCard
                key={c.id}
                cookbook={c}
                onOpen={(id) => patch({ cookbook: id })}
              />
            ))}
          </div>
        ) : (
          <p className="muted">No cookbooks match your filters.</p>
        )}
      </div>

      <Modal
        open={Boolean(params.cookbook)}
        onClose={() => patch({ cookbook: undefined })}
        width={880}
      >
        {params.cookbook && <CookbookDetail id={params.cookbook} />}
      </Modal>
    </div>
  );
}
