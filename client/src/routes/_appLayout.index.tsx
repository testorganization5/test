import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useRecipes } from "~/hooks/useRecipes";
import { useCookbooks } from "~/hooks/useCookbooks";
import { RecipeCard } from "~/components/RecipeCard";
import { CookbookCard } from "~/components/CookbookCard";
import { SearchBar } from "~/components/SearchBar";
import { Spinner } from "~/components/Spinner";
import "~/styles/home.css";

export const Route = createFileRoute("/_appLayout/")({
  component: HomePage,
});

function HomePage() {
  const navigate = useNavigate();
  const topRated = useRecipes({ sort: "rating", limit: 8 });
  const popular = useCookbooks({ sort: "popular", limit: 6 });
  const trending = useRecipes({ sort: "views", limit: 8 });

  const openRecipe = (id: string) =>
    navigate({ to: "/recipes", search: { recipe: id } });
  const openCookbook = (id: string) =>
    navigate({ to: "/cookbooks", search: { cookbook: id } });

  return (
    <div className="home">
      <section className="hero">
        <div className="container hero__inner">
          <h1 className="hero__title">
            Find Recipes and Create
            <br />
            Your Favourite Cookbooks
          </h1>
          <div className="hero__search">
            <SearchBar placeholder="Find best recipes" to="/recipes" />
          </div>
        </div>
      </section>

      <div className="container">
        <Section title="Highest-Rated Recipes">
          {topRated.isLoading ? (
            <Spinner />
          ) : (
            <div className="scroller">
              {topRated.data?.map((r) => (
                <div className="scroller__item" key={r.id}>
                  <RecipeCard recipe={r} onOpen={openRecipe} />
                </div>
              ))}
            </div>
          )}
        </Section>

        <Section title="Most Popular CookBooks">
          {popular.isLoading ? (
            <Spinner />
          ) : (
            <div className="home__grid">
              {popular.data?.map((c) => (
                <CookbookCard key={c.id} cookbook={c} onOpen={openCookbook} />
              ))}
            </div>
          )}
        </Section>

        <Section title="Trending Recipes">
          {trending.isLoading ? (
            <Spinner />
          ) : (
            <div className="scroller">
              {trending.data?.map((r) => (
                <div className="scroller__item" key={r.id}>
                  <RecipeCard recipe={r} onOpen={openRecipe} />
                </div>
              ))}
            </div>
          )}
        </Section>
      </div>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="section">
      <h2 className="section__title">{title}</h2>
      {children}
    </section>
  );
}
