"use client";
import { TaskInput } from "@/components/tasks";

export default function Home() {
  return (
    <main className="container mx-auto max-w-lg px-4 py-8">
      <TaskInput onAddTask={(title) => console.log("Agregado:", title)} />
    </main>
  );
}
