"use client";

import React, { useState, useEffect } from "react";
import { Row } from "@tanstack/react-table";
import { CheckIcon, MoreHorizontal, XIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

import { statuses, priorities, labels } from "../data/data";
import { taskSchema } from "../data/schema";
import { TaskService } from "@/lib/http-client";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
  isSheetOpenExternal?: boolean;
  setIsSheetOpenExternal?: (open: boolean) => void;
}

export function DataTableRowActions<TData>({
  row,
  isSheetOpenExternal,
  setIsSheetOpenExternal,
}: DataTableRowActionsProps<TData>) {
  const [isLocalSheetOpen, setIsLocalSheetOpen] = useState(false);
  const task = taskSchema.parse(row.original);
  const [formData, setFormData] = useState(task);
  const [isSaving, setIsSaving] = useState(false);
  
  // Determine if we should use external or local state for sheet open status
  const isSheetOpen = isSheetOpenExternal !== undefined ? isSheetOpenExternal : isLocalSheetOpen;
  const setIsSheetOpen = setIsSheetOpenExternal || setIsLocalSheetOpen;
  
  // Update form data when row changes
  useEffect(() => {
    setFormData(taskSchema.parse(row.original));
  }, [row.original]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    setIsSaving(true);
    try {
      // In a real app, you would call the API here
      // await TaskService.updateTask(task.id, formData);
      console.log("Task updated:", formData);
      setIsSheetOpen(false);
    } catch (error) {
      console.error("Failed to update task:", error);
    } finally {
      setIsSaving(false);
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
              <MoreHorizontal />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[160px]">
            <DropdownMenuItem onClick={() => setIsSheetOpen(true)}>
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem>Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="sm:max-w-md md:max-w-lg lg:max-w-xl" side="right">
          <SheetHeader className="pb-6 px-6">
            <SheetTitle className="text-xl">Edit Task</SheetTitle>
            <SheetDescription>
              Make changes to the task. Click save when you're done.
            </SheetDescription>
          </SheetHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-8 py-6 px-6">
              <div className="space-y-3">
                <Label htmlFor="id" className="text-base">Task ID</Label>
                <Input 
                  id="id" 
                  name="id" 
                  value={formData.id} 
                  disabled 
                  className="bg-muted cursor-not-allowed px-4 py-3 text-sm"
                />
              </div>
              
              <div className="space-y-3">
                <Label htmlFor="title" className="text-base">Title</Label>
                <Input 
                  id="title" 
                  name="title" 
                  value={formData.title} 
                  onChange={handleChange} 
                  placeholder="Task title"
                  className="px-4 py-3 text-sm"
                />
              </div>
              
              <div className="space-y-3">
                <Label htmlFor="status" className="text-base">Status</Label>
                <Select 
                  value={formData.status} 
                  onValueChange={(value) => handleSelectChange("status", value)}
                >
                  <SelectTrigger className="px-4 py-3">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statuses.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        <div className="flex items-center gap-3">
                          {status.icon && <status.icon className="h-5 w-5 text-muted-foreground" />}
                          <span>{status.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-3">
                <Label htmlFor="priority" className="text-base">Priority</Label>
                <Select 
                  value={formData.priority} 
                  onValueChange={(value) => handleSelectChange("priority", value)}
                >
                  <SelectTrigger className="px-4 py-3">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    {priorities.map((priority) => (
                      <SelectItem key={priority.value} value={priority.value}>
                        <div className="flex items-center gap-3">
                          {priority.icon && <priority.icon className="h-5 w-5 text-muted-foreground" />}
                          <span>{priority.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-3">
                <Label htmlFor="label" className="text-base">Label</Label>
                <Select 
                  value={formData.label} 
                  onValueChange={(value) => handleSelectChange("label", value)}
                >
                  <SelectTrigger className="px-4 py-3">
                    <SelectValue placeholder="Select label" />
                  </SelectTrigger>
                  <SelectContent>
                    {labels.map((label) => (
                      <SelectItem key={label.value} value={label.value}>
                        {label.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <Separator className="my-2" />
              
              <div className="flex items-center space-x-3">
                <Checkbox id="is-important" className="h-5 w-5" />
                <Label htmlFor="is-important" className="text-base">Mark as important</Label>
              </div>
            </div>
            
            <SheetFooter className="pt-6 px-6">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsSheetOpen(false)}
                className="px-6 py-3"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isSaving}
                className="px-6 py-3"
              >
                {isSaving ? "Saving..." : "Save changes"}
              </Button>
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>
    </>
  );
}
