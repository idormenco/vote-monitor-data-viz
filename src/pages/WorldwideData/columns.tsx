"use client";

import type { ElectionModel } from "@/common/types";
import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";
import { type ColumnDef } from "@tanstack/react-table";
import { Eye } from "lucide-react";

interface ClickableTableCellProps {
  id: string;
}

function ClickableTableCell({ id }: ClickableTableCellProps) {
  const navigate = useNavigate();
  return (
    <Button
      variant={"link"}
      className="cursor-pointer"
      onClick={() => navigate({ to: "/elections/$id", params: { id: id } })}
    >
      <Eye className="h-4 w-4" />
    </Button>
  );
}

export const columns: ColumnDef<ElectionModel>[] = [
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "englishTitle",
    header: "English title",
  },
  {
    accessorKey: "startDate",
    header: "Election date",
  },
  {
    header: "",
    accessorKey: "action",
    enableSorting: false,
    cell: ({ row }) => <ClickableTableCell id={row.original.id} />,
  },
];
