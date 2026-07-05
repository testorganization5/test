import { forwardRef, useState, type InputHTMLAttributes } from "react";
import "./Field.css";

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  /** Adds a show/hide toggle; forces type between text/password. */
  passwordToggle?: boolean;
}

// forwardRef so react-hook-form's `register` can attach its ref.
export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  ({ label, error, passwordToggle, type = "text", id, ...props }, ref) => {
    const [reveal, setReveal] = useState(false);
    const inputType = passwordToggle ? (reveal ? "text" : "password") : type;
    const fieldId = id ?? props.name;

    return (
      <div className={`field ${error ? "field--error" : ""}`}>
        {label && (
          <label className="field__label" htmlFor={fieldId}>
            {label}
          </label>
        )}
        <div className="field__control">
          <input
            id={fieldId}
            ref={ref}
            type={inputType}
            className="field__input"
            {...props}
          />
          {passwordToggle && (
            <button
              type="button"
              className="field__toggle"
              onClick={() => setReveal((v) => !v)}
              aria-label={reveal ? "Hide password" : "Show password"}
            >
              {reveal ? "🙈" : "👁"}
            </button>
          )}
        </div>
        {error && <p className="field__error">{error}</p>}
      </div>
    );
  },
);
TextField.displayName = "TextField";
