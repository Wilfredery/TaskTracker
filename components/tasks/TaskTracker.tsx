"use client";
import { useState, useMemo } from "react";
import type { Task, FilterType } from "@/types/task";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { TaskInput, TaskFilter, TaskList } from "@/components/tasks/index";

export function TaskTracker() {
  const [tasks, setTasks, isLoaded] = useLocalStorage<Task[]>("tasks", []);
  const [filter, setFilter] = useState<FilterType>("all");

  const addTask = (title: string) => {
    const newTask: Task = {
      id: crypto.randomUUID(),
      title,
      completed: false,
      createdAt: Date.now(),
    };
    setTasks([newTask, ...tasks]);
  };

  const toggleTask = (id: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task,
      ),
    );
  };
  const deleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const counts = useMemo(
    () => ({
      all: tasks.length,
      active: tasks.filter((t) => !t.completed).length,
      completed: tasks.filter((t) => t.completed).length,
    }),
    [tasks],
  );

  const filteredTasks = useMemo(() => {
    switch (filter) {
      case "active":
        return tasks.filter((t) => !t.completed);

      case "completed":
        return tasks.filter((t) => t.completed);

      default:
        return tasks;
    }
  }, [tasks, filter]);

  if (!isLoaded) {
    return (
      <div className="flex justify-center py-8">
        <span className="loading loading-spinner loading-md"></span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <TaskInput onAddTask={addTask} />
      <TaskFilter filter={filter} onFilterChange={setFilter} counts={counts} />
      <TaskList
        tasks={filteredTasks}
        onToggle={toggleTask}
        onDelete={deleteTask}
      />
    </div>
  );
}
