import "./Spinner.css";

export function Spinner({ label = "Loading…" }: { label?: string }) {
  return (
    <div className="spinner" role="status">
      <div className="spinner__ring" />
      <span className="sr-only">{label}</span>
    </div>
  );
}
