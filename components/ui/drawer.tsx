"use client";


import React from "react";
import { cn } from "@/lib/utils";

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export function Drawer({ isOpen, onClose, children }: DrawerProps) {
  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-end transition-transform",
        isOpen ? "translate-x-0" : "translate-x-full"
      )}
    >
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative w-96 bg-white p-4 shadow-lg dark:bg-gray-800">
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          onClick={onClose}
        >
          Close
        </button>
        {children}
      </div>
    </div>
  );
}