import { promises as fs } from "fs";
import path from "path";
import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

import { TaskContent } from "../tasks/components/TaskContent";
import { taskSchema } from "../tasks/data/schema";
import { z } from "zod";

// Optionally, move getTasks to a shared file.
async function getTasks() {
  const data = await fs.readFile(
    path.join(process.cwd(), "app/tasks/data/tasks.json")
  );
  const tasks = JSON.parse(data.toString());
  return z.array(taskSchema).parse(tasks);
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
