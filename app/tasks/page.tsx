"use client";

import Image from "next/image";
import { Task } from "@/types/task";
import { TaskContent } from "./components/TaskContent";
import { TaskService } from "../../lib/http-client";
import tasksData from "./data/tasks.json";

const dummyTasks: ExtendedTask[] = tasksData.map((task) => ({
  ...task,
  label: `Label ${task.id}`,
  status: task.status === "pending" || task.status === "completed" ? task.status : "pending",
  // Ensure priority is one of the valid values
  priority: ["low", "medium", "high"].includes(task.priority) ? 
    task.priority as "low" | "medium" | "high" : 
    "medium"
}));

interface ExtendedTask extends Task {
  label: string;
}

export default async function TaskPage() {
  const tasks = dummyTasks;  // Using dummyTasks directly since getTasks isn't defined

  async function handleCreateTask() {
    const newTask = await TaskService.createTask({ title: "New Task" });
    console.log("Task created:", newTask);
  }

  return (
    <>
      <div className="md:hidden">
        <Image
          src="/examples/tasks-light.png"
          width={1280}
          height={998}
          alt="Playground"
          className="block dark:hidden"
        />
        <Image
          src="/examples/tasks-dark.png"
          width={1280}
          height={998}
          alt="Playground"
          className="hidden dark:block"
        />
      </div>
      <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
        <TaskContent tasks={tasks} />
      </div>
      <div>
        <h1>Tasks</h1>
        <button onClick={handleCreateTask}>Create Task</button>
      </div>
    </>
  );
}
