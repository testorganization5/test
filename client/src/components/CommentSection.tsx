import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { commentSchema, type CommentValues } from "~/lib/schemas";
import {
  useAddComment,
  useComments,
  useDeleteComment,
} from "~/hooks/useComments";
import { useAuth } from "~/context/AuthContext";
import { Avatar } from "./Avatar";
import { Spinner } from "./Spinner";
import "./CommentSection.css";

interface CommentSectionProps {
  target: "recipe" | "cookbook";
  targetId: string;
}

export function CommentSection({ target, targetId }: CommentSectionProps) {
  const { user } = useAuth();
  const { data: comments, isLoading } = useComments(target, targetId);
  const addComment = useAddComment(target, targetId);
  const deleteComment = useDeleteComment(target, targetId);

  const { register, handleSubmit, reset, formState } = useForm<CommentValues>({
    resolver: zodResolver(commentSchema),
  });

  const onSubmit = handleSubmit(async (values) => {
    await addComment.mutateAsync(values.text);
    reset();
  });

  return (
    <section className="comments">
      <h3 className="comments__title">
        Comments ({comments?.length ?? 0})
      </h3>

      <form className="comments__form" onSubmit={onSubmit}>
        <input
          className="comments__input"
          placeholder="Add a comment…"
          {...register("text")}
        />
        <button
          className="comments__send"
          type="submit"
          disabled={addComment.isPending}
          aria-label="Send comment"
        >
          ➤
        </button>
      </form>
      {formState.errors.text && (
        <p className="field__error">{formState.errors.text.message}</p>
      )}

      {isLoading ? (
        <Spinner />
      ) : (
        <ul className="comments__list">
          {comments?.map((c) => (
            <li key={c.id} className="comment">
              <Avatar src={c.author?.avatarUrl} name={c.author?.name} size={40} />
              <div className="comment__body">
                <div className="comment__head">
                  <span className="comment__author">{c.author?.name}</span>
                  <span className="comment__time">
                    {new Date(c.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="comment__text">{c.text}</p>
              </div>
              {c.author?.id === user?.id && (
                <button
                  className="comment__delete"
                  onClick={() => deleteComment.mutate(c.id)}
                  aria-label="Delete comment"
                >
                  ×
                </button>
              )}
            </li>
          ))}
          {comments?.length === 0 && (
            <li className="comments__empty">Be the first to comment.</li>
          )}
        </ul>
      )}
    </section>
  );
}
