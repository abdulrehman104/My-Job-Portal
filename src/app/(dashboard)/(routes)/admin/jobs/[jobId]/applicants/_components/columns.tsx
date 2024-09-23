"use client";

import { ColumnDef } from "@tanstack/react-table";
import {
  ArrowUpDown,
  Ban,
  CircleCheck,
  FileIcon,
  MoreHorizontal,
  Pencil,
} from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { CellActions } from "./cell-action";

export type ApplicantsColumns = {
  id: string;
  fullName: string;
  email: string;
  contact: string;
  appliedAt: string;
  resumes: string;
  resumeName: string;
};

export const columns: ColumnDef<ApplicantsColumns>[] = [
  {
    accessorKey: "fullName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Full Name
          <ArrowUpDown className="ml-2 size-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email
          <ArrowUpDown className="ml-2 size-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "contact",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Contact
          <ArrowUpDown className="ml-2 size-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "resumes",
    header: "Resume",
    cell: ({ row }) => {
      const { resumes, resumeName } = row.original;

      return (
        <Link
          href={resumes}
          target="_blank"
          className="flex items-center text-purple-500"
        >
          {/* Replace `File` with your file icon component */}
          <FileIcon className="mr-2 size-4" />
          <p className="w-44 truncate">{resumeName}</p>
        </Link>
      );
    },
  },
  {
    accessorKey: "appliedAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date
          <ArrowUpDown className="ml-2 size-4" />
        </Button>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const { id, fullName, email } = row.original;

      return <CellActions id={id} email={email} fullName={fullName} />;
    },
  },
];
