"use client";

import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Task } from "@/types/task";
import { TaskService } from "@/lib/http-client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

import { TaskContent } from "../tasks/components/TaskContent";

interface ExtendedTask extends Task {
  label: string;
}

export default function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const projectId = searchParams.get("project");
  
  useEffect(() => {
    async function fetchTasks() {
      setLoading(true);
      try {
        const fetchedTasks = await TaskService.getAllTasks(projectId || undefined);
        setTasks(fetchedTasks);
      } catch (error) {
        console.error("Failed to fetch tasks:", error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchTasks();
  }, [projectId]); // Re-fetch when projectId changes

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
          <TaskContent tasks={tasks} loading={loading} />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
