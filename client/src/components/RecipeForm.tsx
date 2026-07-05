import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { recipeFormSchema, type RecipeFormValues } from "~/lib/schemas";
import { useCreateRecipe, useUpdateRecipe } from "~/hooks/useRecipes";
import type { Recipe } from "~/lib/types";
import { TextField } from "./TextField";
import { TextArea } from "./TextArea";
import { Button } from "./Button";
import "./EntityForm.css";

interface RecipeFormProps {
  recipe?: Recipe;
  onDone: () => void;
}

export function RecipeForm({ recipe, onDone }: RecipeFormProps) {
  const isEdit = Boolean(recipe);
  const create = useCreateRecipe();
  const update = useUpdateRecipe(recipe?.id ?? "");

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<RecipeFormValues>({
    resolver: zodResolver(recipeFormSchema),
    defaultValues: {
      title: recipe?.title ?? "",
      imageUrl: recipe?.imageUrl ?? "",
      description: recipe?.description ?? "",
      directions: recipe?.directions ?? "",
      cookingTimeMins: recipe?.cookingTimeMins ?? 30,
      ingredients: recipe?.ingredients ?? [{ name: "", amount: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "ingredients",
  });

  const onSubmit = handleSubmit(async (values) => {
    if (isEdit) await update.mutateAsync(values);
    else await create.mutateAsync(values);
    onDone();
  });

  return (
    <form className="entity-form" onSubmit={onSubmit} noValidate>
      <h2 className="entity-form__title">
        {isEdit ? "Edit Recipe" : "Create New Recipe"}
      </h2>

      <TextField
        label="Recipe Title *"
        error={errors.title?.message}
        {...register("title")}
      />
      <TextField
        label="Image URL *"
        placeholder="https://…"
        error={errors.imageUrl?.message}
        {...register("imageUrl")}
      />
      <TextField
        label="Cooking time (minutes) *"
        type="number"
        error={errors.cookingTimeMins?.message}
        {...register("cookingTimeMins")}
      />
      <TextArea
        label="Description"
        error={errors.description?.message}
        {...register("description")}
      />

      <div className="field">
        <span className="field__label">Ingredients *</span>
        {fields.map((field, i) => (
          <div className="entity-form__ingredient" key={field.id}>
            <input
              className="field__input"
              placeholder="Name"
              {...register(`ingredients.${i}.name`)}
            />
            <input
              className="field__input"
              placeholder="Amount"
              {...register(`ingredients.${i}.amount`)}
            />
            <button
              type="button"
              className="entity-form__remove"
              onClick={() => remove(i)}
              aria-label="Remove ingredient"
              disabled={fields.length === 1}
            >
              ×
            </button>
          </div>
        ))}
        {errors.ingredients && (
          <p className="field__error">
            {errors.ingredients.message ??
              "Please complete every ingredient row"}
          </p>
        )}
        <button
          type="button"
          className="entity-form__add"
          onClick={() => append({ name: "", amount: "" })}
        >
          + Add ingredient
        </button>
      </div>

      <TextArea
        label="Directions"
        error={errors.directions?.message}
        {...register("directions")}
      />

      <div className="entity-form__actions">
        <Button type="button" variant="outline" onClick={onDone}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving…" : "Confirm"}
        </Button>
      </div>
    </form>
  );
}
