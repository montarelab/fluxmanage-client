import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Task } from "@/types/task";
import { TaskService } from "@/lib/http-client";

import { TaskContent } from "../tasks/components/TaskContent";

interface ExtendedTask extends Task {
  label: string;
}

async function getTasks(): Promise<ExtendedTask[]> {
  // Import tasks from JSON file
  const tasks = await import('../tasks/data/tasks.json').then(module => module.default);
  return tasks.map(task => ({
    ...task,
    // Map various status values to either "pending" or "completed"
    status: ["done", "canceled"].includes(task.status) ? "completed" : "pending",
    // Ensure priority is one of the allowed values
    priority: task.priority as "medium" | "high" | "low"
  }));
}

export default async function DashboardPage() {
  const tasks = await getTasks();

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 p-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <h1 className="text-xl font-bold">Dashboard</h1>
        </header>
        <div className="p-4">
          <TaskContent tasks={tasks} />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
