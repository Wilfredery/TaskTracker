import { render, screen, fireEvent } from "@testing-library/react";
import { TaskItem } from "@/components/tasks/TaskItem";
import type { Task } from "@/types/task";

const mockTask: Task = {
  id: "1",
  title: "test task",
  completed: false,
  createdAt: Date.now(),
};

describe("TaskItem", () => {
  //test 1: Se rederiza el titulo?
  it("renders task title", () => {
    render(
      <TaskItem task={mockTask} onToggle={() => {}} onDelete={() => {}} />,
    );

    expect(screen.getByText("test task")).toBeInTheDocument();
  });
});
