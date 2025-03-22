"use client";

import { columns } from "./columns";
import { DataTable } from "./data-table";
import { UserNav } from "./user-nav";

interface TaskContentProps {
  tasks: any[];
}

export function TaskContent({ tasks }: TaskContentProps) {
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
          <UserNav />
        </div>
      </div>
      <DataTable data={tasks} columns={columns} />
    </>
  );
}
