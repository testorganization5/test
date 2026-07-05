import { useRecipes } from "~/hooks/useRecipes";
import { Spinner } from "./Spinner";
import "./RecipePicker.css";

interface RecipePickerProps {
  value: string[];
  onChange: (ids: string[]) => void;
}

/** A checklist of recipes used when building a cookbook. */
export function RecipePicker({ value, onChange }: RecipePickerProps) {
  const { data: recipes, isLoading } = useRecipes();

  const toggle = (id: string) => {
    onChange(
      value.includes(id) ? value.filter((x) => x !== id) : [...value, id],
    );
  };

  if (isLoading) return <Spinner />;

  return (
    <div className="picker">
      {recipes?.map((r) => (
        <label key={r.id} className="picker__item">
          <input
            type="checkbox"
            checked={value.includes(r.id)}
            onChange={() => toggle(r.id)}
          />
          <img src={r.imageUrl} alt="" className="picker__thumb" />
          <span className="picker__name">{r.title}</span>
        </label>
      ))}
    </div>
  );
}
