import { TaskTracker } from "@/components/tasks";

export default function Home() {
  return (
    <main className="container mx-auto max-w-lg px-4 py-8">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-center">Task tracker</h1>
        <p className="text-center text-base-content/60 mt-1">
          Keep track of your daily tasks
        </p>
      </header>

      <TaskTracker />
    </main>
  );
}
