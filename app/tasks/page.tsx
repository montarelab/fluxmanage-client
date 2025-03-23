"use client";
import { useTasks } from "@/hooks/useTasks";
import { TaskContent } from "./components/TaskContent";

export default function TasksPage() {
  const { tasks, loading } = useTasks();

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      {loading ? (
        <div className="flex h-[400px] items-center justify-center">
          <p className="text-muted-foreground">Loading tasks...</p>
        </div>
      ) : (
        <TaskContent tasks={tasks} loading={loading} />
      )}
    </div>
  );
}
