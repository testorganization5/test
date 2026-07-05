import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { useCookbooks, useDeleteCookbook } from "~/hooks/useCookbooks";
import { CookbookCard } from "~/components/CookbookCard";
import { CookbookForm } from "~/components/CookbookForm";
import { CookbookDetail } from "~/components/CookbookDetail";
import { Modal } from "~/components/Modal";
import { Button } from "~/components/Button";
import { Spinner } from "~/components/Spinner";

const searchSchema = z.object({
  create: z.boolean().optional(),
  edit: z.string().optional(),
  cookbook: z.string().optional(),
});

export const Route = createFileRoute("/_appLayout/profile/cookbooks")({
  validateSearch: searchSchema,
  component: MyCookbooks,
});

function MyCookbooks() {
  const params = Route.useSearch();
  const navigate = useNavigate();
  const { data, isLoading } = useCookbooks({ mine: true });
  const deleteCookbook = useDeleteCookbook();

  const patch = (next: Partial<typeof params>) =>
    navigate({ to: "/profile/cookbooks", search: { ...params, ...next } });

  const editing = data?.find((c) => c.id === params.edit);

  return (
    <>
      <div className="profile__toolbar">
        <Button onClick={() => patch({ create: true })}>
          Create New CookBook
        </Button>
      </div>

      {isLoading ? (
        <Spinner />
      ) : data && data.length > 0 ? (
        <div className="profile__grid">
          {data.map((c) => (
            <CookbookCard
              key={c.id}
              cookbook={c}
              onOpen={(id) => patch({ cookbook: id })}
              actions={
                <>
                  <button
                    className="card__action"
                    onClick={(e) => {
                      e.stopPropagation();
                      patch({ edit: c.id });
                    }}
                  >
                    Edit CookBook
                  </button>
                  <button
                    className="card__action card__action--danger"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm(`Delete "${c.title}"?`))
                        deleteCookbook.mutate(c.id);
                    }}
                  >
                    Delete CookBook
                  </button>
                </>
              }
            />
          ))}
        </div>
      ) : (
        <p className="muted">
          You haven't created any cookbooks yet. Click "Create New CookBook".
        </p>
      )}

      {/* Create / Edit modal */}
      <Modal
        open={Boolean(params.create || editing)}
        onClose={() => patch({ create: undefined, edit: undefined })}
        width={640}
      >
        <CookbookForm
          cookbook={editing}
          onDone={() => patch({ create: undefined, edit: undefined })}
        />
      </Modal>

      {/* Detail modal */}
      <Modal
        open={Boolean(params.cookbook)}
        onClose={() => patch({ cookbook: undefined })}
        width={880}
      >
        {params.cookbook && <CookbookDetail id={params.cookbook} />}
      </Modal>
    </>
  );
}
