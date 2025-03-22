import { promises as fs } from "fs";
import path from "path";
import Image from "next/image";
import { z } from "zod";

import { taskSchema } from "./data/schema";
import { TaskContent } from "./components/TaskContent";
import { TaskService } from "../../lib/http-client";

// Simulate a database read for tasks.
async function getTasks() {
  const data = await fs.readFile(
    path.join(process.cwd(), "app/tasks/data/tasks.json")
  );
  const tasks = JSON.parse(data.toString());
  return z.array(taskSchema).parse(tasks);
}

export default async function TaskPage() {
  const tasks = await getTasks();

  // Example usage of TaskService
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
