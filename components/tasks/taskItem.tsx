import type { Task } from "@/types/task";

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export function TaskItem({ task, onToggle, onDelete }: TaskItemProps) {
  return (
    <li className="flex items-center gap-3 p-3 bg-base-200 rounded-lg">
      <input
        type="checkbox"
        checked={task.completed}
        onChange={() => onToggle(task.id)}
        className="checkbox checkbox-primary"
        aria-label={`Mark "${task.title}" as ${task.completed ? "incomplete" : "complete"}`}
      />

      <span
        className={`flex-1 ${task.completed ? "line-through text-base-content/50" : ""}`}
      >
        {" "}
        {task.title}
      </span>
      <button
        onClick={() => onDelete(task.id)}
        className="btn btn-ghost btn-sm btn-square text-error"
        aria-label={`Delete "${task.title}"`}
      >
        ✕
      </button>
    </li>
  );
}
