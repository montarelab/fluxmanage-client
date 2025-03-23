export interface Task {
  id: string;
  title: string;
  description?: string;
  status: "created" | "inProgress" | "completed";
  estimatedStoryPoints?: number;
  dueDate: string;
  projectId: string;
  createdAt?: string;
}