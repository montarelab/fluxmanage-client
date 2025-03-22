import axios from "axios";
import { Task } from "../types/task";
import { Project } from "../types/project";

const httpClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL, // Base API URL
  headers: {
    "Content-Type": "application/json",
  },
});

httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle errors globally
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const TaskService = {
  async getAllTasks(): Promise<Task[]> {
    const response = await httpClient.get("/tasks");
    return response.data;
  },

  async createTask(task: Partial<Task>): Promise<Task> {
    const response = await httpClient.post("/tasks", task);
    return response.data;
  },

  async updateTask(taskId: string, updates: Partial<Task>): Promise<Task> {
    const response = await httpClient.put(`/tasks/${taskId}`, updates);
    return response.data;
  },

  async deleteTask(taskId: string): Promise<void> {
    await httpClient.delete(`/tasks/${taskId}`);
  },

  async completeTask(taskId: string): Promise<Task> {
    const response = await httpClient.patch(`/tasks/${taskId}/complete`);
    return response.data;
  },

  async assignTask(taskId: string, userId: string): Promise<Task> {
    const response = await httpClient.patch(`/tasks/${taskId}/assign`, { userId });
    return response.data;
  },
};

export const ProjectService = {
  async getAllProjects(): Promise<Project[]> {
    const response = await httpClient.get("/projects");
    return response.data;
  },

  async createProject(project: Partial<Project>): Promise<Project> {
    const response = await httpClient.post("/projects", project);
    return response.data;
  },

  async updateProject(projectId: string, updates: Partial<Project>): Promise<Project> {
    const response = await httpClient.put(`/projects/${projectId}`, updates);
    return response.data;
  },

  async deleteProject(projectId: string): Promise<void> {
    await httpClient.delete(`/projects/${projectId}`);
  },

  async inviteToProject(projectId: string, email: string): Promise<void> {
    await httpClient.post(`/projects/${projectId}/invite`, { email });
  },
};

export default httpClient;