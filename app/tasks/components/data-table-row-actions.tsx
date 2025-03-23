"use client";

import React, { useState } from "react";
import { Row } from "@tanstack/react-table";
import { MoreHorizontal, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Task } from "@/types/task";
import { TaskService } from "@/lib/http-client";
import { TaskDrawer } from "./task-drawer";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
  isSheetOpenExternal?: boolean;
  setIsSheetOpenExternal?: (open: boolean) => void;
  onTaskUpdated?: (task: Task) => void;
}

export function DataTableRowActions<TData>({
  row,
  isSheetOpenExternal,
  setIsSheetOpenExternal,
  onTaskUpdated,
}: DataTableRowActionsProps<TData>) {
  const [isLocalSheetOpen, setIsLocalSheetOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Use the task from the row data
  const task = row.original as Task;
  
  // Determine if we should use external or local state for sheet open status
  const isSheetOpen = isSheetOpenExternal !== undefined ? isSheetOpenExternal : isLocalSheetOpen;
  const setIsSheetOpen = setIsSheetOpenExternal || setIsLocalSheetOpen;
  
  const handleTaskUpdated = (updatedTask: Task) => {
    if (onTaskUpdated) {
      onTaskUpdated(updatedTask);
    }
  };
  
  const handleDeleteTask = async () => {
    if (!task || !task.id) return;
    
    setIsDeleting(true);
    try {
      await TaskService.deleteTask(task.id);
      setIsDeleteDialogOpen(false);
      // We would ideally remove the task from the list here, but would need to lift this state up
      // For now, we'll rely on a page refresh or the parent component handling deletion
    } catch (error) {
      console.error("Failed to delete task:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      {!isSheetOpenExternal && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[160px]">
            <DropdownMenuItem onClick={() => setIsSheetOpen(true)}>
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={(e) => {
                e.stopPropagation();
                setIsDeleteDialogOpen(true);
              }}
              className="text-destructive focus:text-destructive"
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
      
      <TaskDrawer
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
        task={task}
        onTaskUpdated={handleTaskUpdated}
      />

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the task "{task?.title}". This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteTask} 
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
