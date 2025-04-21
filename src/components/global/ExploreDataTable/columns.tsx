"use client";
import { renderPlagiarismBadge, renderStatusBadge } from "@/lib/constants";
import { ProjectType } from "@/lib/types";
// import { FunnelsForSubAccount } from "@/lib/types";
import { ColumnDef } from "@tanstack/react-table";
import { ExternalLink } from "lucide-react";
import Link from "next/link";

export const columns: ColumnDef<ProjectType>[] = [
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => {
      return (
        <Link
          className="flex gap-2 items-center"
          href={`/subaccount/${row.original.title}/funnels/${row.original.id}`}
        >
          {row.getValue("title")}
          <ExternalLink size={15} />
        </Link>
      );
    },
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => {
      return row.original.description;
    },
  },
  {
    accessorKey: "updatedAt",
    header: "Last Updated",
    cell: ({ row }) => {
      const date = ` ${row.original.updatedAt.toDateString()} ${row.original.updatedAt.toLocaleTimeString()} `;
      return <span className="text-muted-foreground">{date}</span>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      return renderStatusBadge(status);
    },
  },
  {
    accessorKey: "plagiarismScore",
    header: "plagiarism",
    cell: ({ row }) => {
      const score = row.original.plagiarismScore;
      return renderPlagiarismBadge(score);
    },
  },
  // {
  //   accessorKey: "",
  //   cell: () => {
  //     <span>view morew</span>;
  //   },
  // },
];
