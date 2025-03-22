import { useState, useEffect } from "react";
import { ProjectService } from "../lib/http-client";
import { Project } from "../types/project";

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchProjects() {
      setLoading(true);
      try {
        const data = await ProjectService.getAllProjects();
        setProjects(data);
      } catch (error) {
        console.error("Failed to fetch projects:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
  }, []);

  return { projects, loading, setProjects };
}