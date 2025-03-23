"use client";
import { useState, useEffect } from "react";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { UserNav } from "./user-nav";
import { Task } from "@/types/task";
import { Button } from "@/components/ui/button";
import { Plus as PlusIcon } from "lucide-react";
import { TaskDrawer } from "./task-drawer";

// interface Task extends BaseTask {
//   label: string;
// }

interface TaskContentProps {
  tasks: Task[];
  loading?: boolean;
}

export function TaskContent({ tasks, loading = false }: TaskContentProps) {
  const [tasksState, setTasksState] = useState<Task[]>(tasks);
  const [isNewTaskDrawerOpen, setIsNewTaskDrawerOpen] = useState(false);
  
  // Update local state when tasks prop changes
  useEffect(() => {
    setTasksState(tasks);
  }, [tasks]);
  
  const handleTaskCreated = (newTask: Task) => {
    setTasksState((prevTasks) => [...prevTasks, newTask]);
    setIsNewTaskDrawerOpen(false);
  };
  
  const handleTaskUpdated = (updatedTask: Task) => {
    setTasksState((prevTasks) =>
      prevTasks.map((task) => (task.id === updatedTask.id ? updatedTask : task))
    );
  };
  
  return (
    <>
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Welcome back!</h2>
          <p className="text-muted-foreground">
            Here&apos;s a list of your tasks for this month!
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button 
            onClick={() => setIsNewTaskDrawerOpen(true)}
            className="flex items-center gap-2"
          >
            <PlusIcon className="h-4 w-4" />
            New Task
          </Button>
          <UserNav />
        </div>
      </div>
      
      {loading ? (
        <div className="flex h-[400px] items-center justify-center">
          <p className="text-muted-foreground">Loading tasks...</p>
        </div>
      ) : (
        <DataTable 
          data={tasksState} 
          columns={columns} 
          onTaskUpdated={handleTaskUpdated}
        />
      )}
      
      <TaskDrawer
        isOpen={isNewTaskDrawerOpen}
        onClose={() => setIsNewTaskDrawerOpen(false)}
        onTaskCreated={handleTaskCreated}
      />
    </>
  );
}
