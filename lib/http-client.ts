import axios from "axios";
import { Task } from "../types/task";
import { Project } from "../types/project";

const readHttpClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL_READ, 
  headers: {
    "Content-Type": "application/json",
  },
});

const writeHttpClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL_WRITE, 
  headers: {
    "Content-Type": "application/json",
  },
});


readHttpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle errors globally
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const TaskService = {
  async getAllTasks(): Promise<Task[]> {
    const response = await readHttpClient.get("/tasks");
    return response.data;
  },

  async createTask(task: Partial<Task>): Promise<Task> {
    const response = await readHttpClient.post("/tasks", task);
    return response.data;
  },

  async updateTask(taskId: string, updates: Partial<Task>): Promise<Task> {
    const response = await readHttpClient.put(`/tasks/${taskId}`, updates);
    return response.data;
  },

  async deleteTask(taskId: string): Promise<void> {
    await readHttpClient.delete(`/tasks/${taskId}`);
  },

  async completeTask(taskId: string): Promise<Task> {
    const response = await readHttpClient.patch(`/tasks/${taskId}/complete`);
    return response.data;
  },

  async assignTask(taskId: string, userId: string): Promise<Task> {
    const response = await readHttpClient.patch(`/tasks/${taskId}/assign`, { userId });
    return response.data;
  },
};

export const ProjectService = {
  async getAllProjects(): Promise<Project[]> {
    const response = await readHttpClient.get("/projects/all");
    return response.data.projects;
  },

  async createProject(project: Partial<Project>): Promise<Project> {
    const response = await writeHttpClient.post("/projects", project);
    return response.data;
  },

  async updateProject(projectId: string, updates: Partial<Project>): Promise<Project> {
    const response = await writeHttpClient.put(`/projects/${projectId}`, updates);
    return response.data;
  },

  async deleteProject(projectId: string): Promise<void> {
    await writeHttpClient.delete(`/projects/${projectId}`);
  },

  // async inviteToProject(projectId: string, email: string): Promise<void> {
  //   await writeHttpClient.post(`/projects/${projectId}/invite`, { email });
  // },
};

export default readHttpClient;