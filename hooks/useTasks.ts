import { useState, useEffect } from "react";
import { TaskService } from "../lib/http-client";
import { Task } from "../types/task";

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchTasks() {
      setLoading(true);
      try {
        const data = await TaskService.getAllTasks();
        setTasks(data);
      } catch (error) {
        console.error("Failed to fetch tasks:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchTasks();
  }, []);

  return { tasks, loading, setTasks };
}