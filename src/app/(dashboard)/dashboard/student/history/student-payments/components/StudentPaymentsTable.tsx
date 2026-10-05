"use client";
import { Note01Icon } from "@hugeicons/core-free-icons";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableCheckboxColumn, DataTableColumnHeader } from "@/components/ui/datatable/DataTableColumnHeader";
import { ActionMenu } from "@/components/ui/datatable/ActionMenu";
// import { baseUrl } from "@/config";

export type PaymentTableColumnType = {
  id: string;
  status: 'paid' | 'pending' | 'failed';
  session: string;
  amount: string;
  date: string;
  reference: string;
};

export const StudentsPaymentTable: ColumnDef<PaymentTableColumnType>[] = [
  DataTableCheckboxColumn<PaymentTableColumnType>(),
  {
    accessorKey: "amount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="AMOUNT (₦)" />
    ),
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"));
      return (
        <span>
          {amount.toLocaleString('en-NG', {
            style: 'currency',
            currency: 'NGN',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          })}
        </span>
      );
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="PAYMENT STATUS" />
    ),
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const colorMap: Record<string, string> = {
        paid: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
        pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
        failed: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      };
      return (
        <span className={`px-2 py-1 rounded-full text-xs ${colorMap[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'}`}>
          {status.toUpperCase()}
        </span>
      );
    },
  },
  {
    accessorKey: "session",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ACADEMIC SESSION" />
    ),
  },
  {
    accessorKey: "date",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="PAYMENT DATE" />
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue("date"));
      return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    },
  },
  {
    accessorKey: "reference",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="REFERENCE" />
    ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <ActionMenu
        row={row.original}
        // isPaymentRow={true}
        onCopy={(id) => navigator.clipboard.writeText(id)}
        menu={[
          {
            title: "Generate Invoice",
            icon: Note01Icon,
            // onClick will be handled in ActionMenu component
          },
        ]}
      />
    ),
  },
];