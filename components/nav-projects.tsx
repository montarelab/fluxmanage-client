"use client"

import { useState } from "react"
import {
  Folder,
  MoreHorizontal,
  Plus,
  Share,
  Trash2,
  type LucideIcon,
  Pencil,
} from "lucide-react"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { useProjects } from "@/hooks/useProjects"
import { ProjectService } from "@/lib/http-client"

export function NavProjects({
  projects,
}: {
  projects: {
    id: string;
    name: string
    url: string
    icon: LucideIcon
  }[]
}) {
  const { isMobile } = useSidebar()
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [selectedProject, setSelectedProject] = useState<{ id: string; name: string } | null>(null)
  const [projectName, setProjectName] = useState("")
  const { setProjects } = useProjects()

  const handleCreateProject = async () => {
    try {
      const newProject = await ProjectService.createProject({ name: projectName })
      setProjects(prev => [...prev, newProject])
      setIsCreateOpen(false)
      setProjectName("")
    } catch (error) {
      console.error("Failed to create project:", error)
    }
  }

  const handleEditProject = async () => {
    if (!selectedProject) return
    try {
      const updatedProject = await ProjectService.updateProject(selectedProject.id, { name: projectName })
      setProjects(prev => prev.map(p => p.id === updatedProject.id ? updatedProject : p))
      setIsEditOpen(false)
      setSelectedProject(null)
      setProjectName("")
    } catch (error) {
      console.error("Failed to update project:", error)
    }
  }

  const handleDeleteProject = async () => {
    if (!selectedProject) return
    try {
      await ProjectService.deleteProject(selectedProject.id)
      setProjects(prev => prev.filter(p => p.id !== selectedProject.id))
      setIsDeleteOpen(false)
      setSelectedProject(null)
    } catch (error) {
      console.error("Failed to delete project:", error)
    }
  }

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <div className="flex items-center justify-between px-4">
        <SidebarGroupLabel>Projects</SidebarGroupLabel>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={() => {
            setProjectName("")
            setIsCreateOpen(true)
          }}
        >
          <Plus className="h-4 w-4" />
          <span className="sr-only">Add Project</span>
        </Button>
      </div>
      <SidebarMenu>
        {projects.map((item) => (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton asChild>
              <a href={item.url}>
                <item.icon />
                <span>{item.name}</span>
              </a>
            </SidebarMenuButton>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuAction showOnHover>
                  <MoreHorizontal />
                  <span className="sr-only">More</span>
                </SidebarMenuAction>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-48"
                side={isMobile ? "bottom" : "right"}
                align={isMobile ? "end" : "start"}
              >
                <DropdownMenuItem onSelect={() => {
                  setSelectedProject({ id: item.id, name: item.name })
                  setProjectName(item.name)
                  setIsEditOpen(true)
                }}>
                  <Pencil className="text-muted-foreground" />
                  <span>Edit Project</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Share className="text-muted-foreground" />
                  <span>Share Project</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-red-600"
                  onSelect={() => {
                    setSelectedProject({ id: item.id, name: item.name })
                    setIsDeleteOpen(true)
                  }}
                >
                  <Trash2 className="text-red-600" />
                  <span>Delete Project</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>

      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Project</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Input
              placeholder="Project name"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleCreateProject}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Project</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Input
              placeholder="Project name"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleEditProject}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Project</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {selectedProject?.name}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteProject} className="bg-red-600">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </SidebarGroup>
  )
}
