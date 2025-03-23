"use client"

import * as React from "react"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  side?: "right" | "left" | "top" | "bottom";
  children: React.ReactNode;
  className?: string;
}

export function Drawer({
  isOpen,
  onClose,
  side = "right",
  children,
  className,
}: DrawerProps) {
  const [isVisible, setIsVisible] = React.useState(isOpen);
  
  React.useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 300); // Match this with your CSS transition time
      return () => clearTimeout(timer);
    }
  }, [isOpen]);
  
  if (!isVisible && !isOpen) return null;
  
  const sideStyles = {
    right: "inset-y-0 right-0 h-full w-full sm:max-w-sm transform translate-x-full",
    left: "inset-y-0 left-0 h-full w-full sm:max-w-sm transform -translate-x-full",
    top: "inset-x-0 top-0 h-96 w-full transform -translate-y-full",
    bottom: "inset-x-0 bottom-0 h-96 w-full transform translate-y-full",
  };
  
  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className={cn(
          "fixed inset-0 bg-black/50 transition-opacity duration-300 ease-in-out",
          isOpen ? "opacity-100" : "opacity-0"
        )}
        onClick={onClose}
      />
      
      {/* Drawer panel */}
      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div 
            className={cn(
              "pointer-events-none fixed max-w-full",
              side === "left" || side === "right" ? "inset-y-0" : "inset-x-0",
            )}
          >
            <div 
              className={cn(
                "pointer-events-auto relative flex h-full flex-col bg-background shadow-xl transition-transform duration-300 ease-in-out",
                sideStyles[side],
                isOpen && "translate-x-0 translate-y-0",
                className
              )}
            >
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-4 rounded-full"
                onClick={onClose}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </Button>
              
              <div className="flex-1 overflow-y-auto p-4 pt-12">
                {children}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}