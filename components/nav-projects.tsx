"use client"

import { useState } from "react"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@radix-ui/react-collapsible";
import {
  CircleIcon,
  MoreHorizontal,
  Plus,
  Share,
  Trash2,
  Edit,
  LayoutList,
  Pencil,
  ChevronRight,
} from "lucide-react"

import { Project } from "@/types/project"

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
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  useSidebar,
} from "@/components/ui/sidebar"
import { useProjects } from "@/hooks/useProjects"
import { ProjectService } from "@/lib/http-client"

export function NavProjects() {
  const { isMobile } = useSidebar()
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [selectedProject, setSelectedProject] = useState<{ id: string; title: string } | null>(null)
  const [projectTitle, setProjectTitle] = useState("")
  const { projects, loading, setProjects } = useProjects()

  const handleCreateProject = async () => {
    try {
      const newProject: Project =
      {
        id: "",
        title: projectTitle,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        members: []
      }
      newProject.id = await ProjectService.createProject(newProject)
      
      setProjects(prev => [...prev, newProject])
      setIsCreateOpen(false)
      setProjectTitle("")
      console.log("Project created successfully:", newProject)
    } catch (error) {
      console.error("Failed to create project:", error)
    }
  }

  const handleEditProject = async () => {
    if (!selectedProject) return
    try {

      await ProjectService.updateProject(selectedProject.id, { title: projectTitle })
      const newProject = projects.find(p => p.id === selectedProject.id)
      newProject.title = projectTitle
      setProjects(prev => prev.map(p => p.id === selectedProject.id ? newProject : p))
      setIsEditOpen(false)
      setSelectedProject(null)
      setProjectTitle("")
      console.log("Project updated successfully:", selectedProject)
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

  const handleProjectSelect = (projectId: string) => {
    const url = new URL(window.location.href);
    url.searchParams.set('project', projectId);
    window.history.pushState({}, '', url.toString());
  }

  if (loading) {
    return (
      <SidebarGroup>
        <SidebarGroupLabel>PROJECT MANAGEMENT</SidebarGroupLabel>
        <SidebarMenu>
          <div className="px-4 py-2 text-sm text-muted-foreground">Loading...</div>
        </SidebarMenu>
      </SidebarGroup>
    )
  }

  return (
    <SidebarGroup>
      <SidebarGroupLabel>PROJECT MANAGEMENT</SidebarGroupLabel>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton onClick={() => setIsCreateOpen(true)}>
            <Plus className="h-4 w-4" />
            <span>Create new</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
        
        <Collapsible asChild defaultOpen>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <LayoutList />
              <span>Projects</span>
            </SidebarMenuButton>
            <CollapsibleTrigger asChild>
              <SidebarMenuAction className="data-[state=open]:rotate-90">
                <ChevronRight />
                <span className="sr-only">Toggle</span>
              </SidebarMenuAction>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarMenuSub>
                {projects && projects.map((item) => (
                  <SidebarMenuSubItem key={item.id}>
                    <SidebarMenuSubButton onClick={() => handleProjectSelect(item.id)}>
                      <span>{item.title}</span>
                    </SidebarMenuSubButton>
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
                          setSelectedProject({ id: item.id, title: item.title })
                          setProjectTitle(item.title)
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
                            setSelectedProject({ id: item.id, title: item.title })
                            setIsDeleteOpen(true)
                          }}
                        >
                          <Trash2 className="text-red-600" />
                          <span>Delete Project</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </SidebarMenuSubItem>
                ))}
              </SidebarMenuSub>
            </CollapsibleContent>
          </SidebarMenuItem>
        </Collapsible>
      </SidebarMenu>

      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Project</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Input
              placeholder="Project name"
              value={projectTitle}
              onChange={(e) => setProjectTitle(e.target.value)}
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
              value={projectTitle}
              onChange={(e) => setProjectTitle(e.target.value)}
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
              Are you sure you want to delete {selectedProject?.title}? This action cannot be undone.
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
