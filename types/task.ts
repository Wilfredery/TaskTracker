export interface Task {
  id: string;
  title: string;
  completed: boolean;
  createAt: number;
}

export type FilterType = "all" | "active" | "completed";
