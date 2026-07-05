import type { ReactNode } from "react";
import "./FilterSidebar.css";

interface FilterSidebarProps {
  children: ReactNode;
  onClear?: () => void;
}

export function FilterSidebar({ children, onClear }: FilterSidebarProps) {
  return (
    <aside className="filters">
      <div className="filters__head">
        <h3 className="filters__title">Filter</h3>
        {onClear && (
          <button className="filters__clear" onClick={onClear}>
            clear all
          </button>
        )}
      </div>
      {children}
    </aside>
  );
}

export function FilterGroup({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="filters__group">
      <p className="filters__label">{label}</p>
      {children}
    </div>
  );
}
