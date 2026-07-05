import { forwardRef, type TextareaHTMLAttributes } from "react";
import "./Field.css";

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ label, error, id, ...props }, ref) => {
    const fieldId = id ?? props.name;
    return (
      <div className={`field ${error ? "field--error" : ""}`}>
        {label && (
          <label className="field__label" htmlFor={fieldId}>
            {label}
          </label>
        )}
        <textarea
          id={fieldId}
          ref={ref}
          className="field__input field__textarea"
          {...props}
        />
        {error && <p className="field__error">{error}</p>}
      </div>
    );
  },
);
TextArea.displayName = "TextArea";
