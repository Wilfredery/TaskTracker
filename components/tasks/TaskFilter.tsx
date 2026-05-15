"use client";
import type { FilterType } from "@/types/task";

interface TaskFilterProps {
  filter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  counts: {
    all: number;
    active: number;
    completed: number;
  };
}

export function TaskFilter({
  filter,
  onFilterChange,
  counts,
}: TaskFilterProps) {
  const filters: { value: FilterType; label: string }[] = [
    { value: "all", label: `All (${counts.all})` },
    { value: "active", label: `Active (${counts.active})` },
    { value: "completed", label: `Done (${counts.completed})` },
  ];

  return (
    <div
      className="flex gap-1 flex-wrap"
      role="tablist"
      aria-label="Filter tasks"
    >
      {filters.map(({ value, label }) => (
        <button
          key={value}
          onClick={() => onFilterChange(value)}
          className={`btn btn-sm ${filter === value ? "btn-primary" : "btn-ghost"}`}
          role="tab"
          aria-selected={filter === value}
        >
          {" "}
          {label}{" "}
        </button>
      ))}
    </div>
  );
}
