import React, { useState, useEffect } from "react";
import { Drawer } from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Task } from "@/types/task";
import { TaskService } from "@/lib/http-client";
import { useSearchParams } from "next/navigation";

interface TaskDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  task?: Task;
  onTaskCreated?: (task: Task) => void;
  onTaskUpdated?: (task: Task) => void;
}

export function TaskDrawer({
  isOpen,
  onClose,
  task,
  onTaskCreated,
  onTaskUpdated,
}: TaskDrawerProps) {
  const searchParams = useSearchParams();
  const projectId = searchParams.get("projectId");
  const isEditMode = !!task;
  
  const defaultTask: Partial<Task> = {
    title: "",
    description: "",
    status: "created",
    estimatedStoryPoints: 1,
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7 days from now
    projectId: projectId || "",
  };

  const [formData, setFormData] = useState<Partial<Task>>(task || defaultTask);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (task) {
      setFormData(task);
    } else {
      setFormData({
        ...defaultTask,
        projectId: projectId || "",
      });
    }
  }, [task, projectId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Make sure projectId is included
    if (!formData.projectId && projectId) {
      formData.projectId = projectId;
    }
    
    setIsSaving(true);
    try {
      if (isEditMode && task) {
        // Update existing task
        formData.id = await TaskService.updateTask(task.id, formData);
        if (onTaskUpdated) {
          onTaskUpdated(formData as Task);
        }
      } else {
        // Create new task
        const taskId = await TaskService.createTask(formData);
        if (onTaskCreated && taskId) {
          const newTask = {
            id: taskId,
            ...formData,
          } as Task;
          onTaskCreated(newTask);
        }
      }
      onClose();
    } catch (error) {
      console.error("Failed to save task:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Drawer isOpen={isOpen} onClose={onClose} side="right">
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-6">
          {isEditMode ? "Edit Task" : "Create New Task"}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title*</Label>
              <Input
                id="title"
                name="title"
                value={formData.title || ""}
                onChange={handleChange}
                placeholder="Task title"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description || ""}
                onChange={handleChange}
                placeholder="Task description"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status*</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleSelectChange("status", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="created">Created</SelectItem>
                  <SelectItem value="inProgress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date*</Label>
              <Input
                id="dueDate"
                name="dueDate"
                type="date"
                value={
                  formData.dueDate
                    ? new Date(formData.dueDate).toISOString().split("T")[0]
                    : ""
                }
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="estimatedStoryPoints">Story Points</Label>
              <Input
                id="estimatedStoryPoints"
                name="estimatedStoryPoints"
                type="number"
                min="1"
                max="10"
                value={formData.estimatedStoryPoints || ""}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="projectId">Project ID*</Label>
              <Input
                id="projectId"
                name="projectId"
                value={formData.projectId || ""}
                onChange={handleChange}
                required
                disabled={!!projectId}
              />
            </div>
          </div>

          <div className="mt-8 flex justify-end space-x-4">
            <Button variant="outline" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving
                ? "Saving..."
                : isEditMode
                ? "Update Task"
                : "Create Task"}
            </Button>
          </div>
        </form>
      </div>
    </Drawer>
  );
}