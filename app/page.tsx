"use client";
import { TaskInput } from "@/components/tasks";
import { TaskItem } from "@/components/tasks";
import { Task } from "@/types/task";

export default function Home() {
  const fakeTask: Task = {
    id: "123",
    title: "Test",
    completed: false,
    createdAt: 0,
  };

  return (
    <main className="container mx-auto max-w-lg px-4 py-8">
      <TaskInput onAddTask={(title) => console.log("Agregado:", title)} />

      <TaskItem
        task={fakeTask}
        onToggle={(id) => console.log("Toggle:", id)}
        onDelete={(id) => console.log("Delete:", id)}
      />
    </main>
  );
}
