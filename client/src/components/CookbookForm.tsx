import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cookbookFormSchema, type CookbookFormValues } from "~/lib/schemas";
import { useCreateCookbook, useUpdateCookbook } from "~/hooks/useCookbooks";
import type { Cookbook, CookbookType } from "~/lib/types";
import { TextField } from "./TextField";
import { TextArea } from "./TextArea";
import { Checkbox } from "./Checkbox";
import { RecipePicker } from "./RecipePicker";
import { Button } from "./Button";
import "./EntityForm.css";

const TYPES: { value: CookbookType; label: string }[] = [
  { value: "vegetarian", label: "Vegetarian" },
  { value: "without-milk", label: "Without Milk" },
  { value: "without-eggs", label: "Without Eggs" },
];

interface CookbookFormProps {
  cookbook?: Cookbook;
  onDone: () => void;
}

export function CookbookForm({ cookbook, onDone }: CookbookFormProps) {
  const isEdit = Boolean(cookbook);
  const create = useCreateCookbook();
  const update = useUpdateCookbook(cookbook?.id ?? "");

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<CookbookFormValues>({
    resolver: zodResolver(cookbookFormSchema),
    defaultValues: {
      title: cookbook?.title ?? "",
      imageUrl: cookbook?.imageUrl ?? "",
      description: cookbook?.description ?? "",
      type: cookbook?.type ?? [],
      recipeIds: cookbook?.recipeIds ?? [],
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    if (isEdit) await update.mutateAsync(values);
    else await create.mutateAsync(values);
    onDone();
  });

  return (
    <form className="entity-form" onSubmit={onSubmit} noValidate>
      <h2 className="entity-form__title">
        {isEdit ? "Edit CookBook" : "Create New CookBook"}
      </h2>

      <TextField
        label="CookBook Title *"
        error={errors.title?.message}
        {...register("title")}
      />
      <TextField
        label="Image URL *"
        placeholder="https://…"
        error={errors.imageUrl?.message}
        {...register("imageUrl")}
      />
      <TextArea
        label="Description"
        error={errors.description?.message}
        {...register("description")}
      />

      <div className="field">
        <span className="field__label">Cookbook type</span>
        <Controller
          control={control}
          name="type"
          render={({ field }) => (
            <div className="entity-form__checks">
              {TYPES.map((t) => (
                <Checkbox
                  key={t.value}
                  label={t.label}
                  checked={field.value.includes(t.value)}
                  onChange={(e) =>
                    field.onChange(
                      e.target.checked
                        ? [...field.value, t.value]
                        : field.value.filter((v) => v !== t.value),
                    )
                  }
                />
              ))}
            </div>
          )}
        />
      </div>

      <div className="field">
        <span className="field__label">Recipes</span>
        <Controller
          control={control}
          name="recipeIds"
          render={({ field }) => (
            <RecipePicker value={field.value} onChange={field.onChange} />
          )}
        />
      </div>

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
