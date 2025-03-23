import { useState, useEffect } from "react";
import { TaskService } from "../lib/http-client";
import { Task } from "../types/task";
import { useSearchParams } from "next/navigation";

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const projectId = searchParams.get("projectId");

  useEffect(() => {
    async function fetchTasks() {
      setLoading(true);
      try {
        // Reset tasks to empty array at the start of each fetch
        setTasks([]);
        
        if (projectId) {
          const data = await TaskService.getAllTasks(projectId);
          setTasks(data || []);
        } else {
          // Only fetch all tasks if no projectId is specified
          // const data = await TaskService.getAllTasks(undefined);
          setTasks([]);
        }
      } catch (error) {
        console.error("Failed to fetch tasks:", error);
        setTasks([]);
      } finally {
        setLoading(false);
      }
    }

    fetchTasks();
  }, [projectId]);

  return { tasks, loading, setTasks };
}