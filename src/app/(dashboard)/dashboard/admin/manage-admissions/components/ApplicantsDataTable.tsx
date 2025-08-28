"use client";

import { DataTable } from "@/components/ui/data-table"
import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { useDataTable } from '@/hooks/useDataTable'
import { getAdmissionApplicants } from "@/app/actions/applications";
import { baseUrl } from "@/config";
import { ActionMenu } from "@/components/ui/datatable/ActionMenu";
import { NotebookTabs } from "lucide-react";
import { UserInterface } from "@/config/Types";

const basePath = `${baseUrl}/dashboard/update-application-form`;
export type StudentTableColumnsType = {
    id: string
    first_name: string
    last_name: string
    other_name: string
    email: string
    reference: string
    phone_number: string
    // is_applied: any
    // admission_status: any
    // actions: string
}
export const ApplicantsDataTable = () => {
    const admissionStatusStyles: Record<
        "ADMITTED" | "PENDING" | "NOT_ADMITTED",
        string
    > = {
        ADMITTED: "bg-green-100 text-green-700 border-green-400",
        PENDING: "bg-yellow-100 text-yellow-800 border-yellow-400",
        NOT_ADMITTED: "bg-red-100 text-red-700 border-red-400",
    };
    const {
        data = [],
        isLoading,
        error,
        total,
        pageIndex,
        pageSize,
        setPageIndex,
        setPageSize,
        search,
        setSearch,
        setFilter,
        setSorting,
    } = useDataTable<UserInterface>({
        fetchFn: getAdmissionApplicants,
        queryKey: ["getAllApplicants"],
        initialState: {
            pageIndex: 0,
            pageSize: 10,
            sortBy: "id",
            sortOrder: "desc",
        },
    });

    const columns: ColumnDef<Record<string, unknown>, UserInterface>[] = [
        // {
        //     accessorKey: "id",
        //     header: "Student ID",
        //     cell: ({ row }) => `${row.getValue("id")}`,
        // },
        {
            accessorKey: "first_name",
            header: "First Name",
            cell: ({ row }) => `${row.getValue("first_name")}`,
        },
        {
            accessorKey: "last_name",
            header: "Last Name",
            cell: ({ row }) => `${row.getValue("last_name")}`,
        },
        {
            accessorKey: "email",
            header: "Email Address",
            cell: ({ row }) => `${row.getValue("email")}`,
        },
        {
            accessorKey: "is_applied",
            header: "Application Status",
            cell: ({ row }) => {
                const key = row.getValue("is_applied");
                const isApplied = key === true || key === 1 || key === "1";
                const statusText = isApplied ? "APPLIED" : "NOT APPLIED"
                const statusClassList = key
                    ? "text-green-700	bg-green-100	border-green-400" : "text-red-700	bg-red-100	border-red-400";
                return (
                    <Badge className={`rounded-lg ${statusClassList}`} variant={isApplied ? "destructive" : "secondary"}>
                        {statusText}
                    </Badge>
                );
            },
        },
        {
            accessorKey: "admission_status",
            header: "Admission Status",
            cell: ({ row }) => {
                const statusKey = row.getValue("admission_status") as string;
                const statusText = statusKey === "ADMITTED"
                    ? "ADMITTED" : statusKey === "PENDING"
                        ? "PENDING" : "NOT ADMITTED";
                return (
                    <Badge
                        variant={"default"}
                        className={`font-semibold rounded-lg ${admissionStatusStyles[statusKey]}`}
                    >
                        {statusText}
                    </Badge>
                );
            }
        },
        {
            id: "actions",
            header: "Actions",
            cell: ({ row }) => {
                const student = row.original as StudentTableColumnsType;

                if (!student?.id) return null;

                return (
                    <ActionMenu
                        row={student}
                        onCopy={(id) => navigator.clipboard.writeText(id ?? "")}
                        menu={[
                            { title: "Review Application", url: `${basePath}?id=${student.id}`, icon: NotebookTabs },
                        ]}
                    />
                );
            },
        }

    ]

    return (
        <DataTable<Record<string, unknown>, UserInterface>
            columns={columns}
            fetchedData={data as unknown as Record<string, unknown>[]}
            isLoading={isLoading}
            error={error}
            title="Admission Management"
            pageIndex={pageIndex}
            pageSize={pageSize}
            totalItems={total}
            onPaginationChange={(page, size) => {
                setPageIndex(page);
                setPageSize(size);
            }}
            onSortChange={(field, order) => {
                setSorting([{ id: field, desc: order === "desc" }]);
            }}
            onSearchChange={setSearch}
            onFilterChange={(updated) => {
                Object.entries(updated).forEach(([key, value]) =>
                    setFilter(key, value)
                );
            }}
            searchConfig={{
                searchableFields: ["first_name", "last_name", "othername", "email", "reference"],
                placeholder: "Search products by names, email or reference number...",
                search,
                setSearch,
            }}
            filterConfigs={[
                {
                    key: 'admission_status',
                    label: 'Admission Status',
                    options: [
                        { value: 'PENDING', label: 'PENDING' },
                        { value: 'ADMITTED', label: 'ADMITTED' },
                        { value: 'NOT_ADMITTED', label: 'NOT ADMITTED' }
                    ]
                },
            ]}
            getRowClickUrl={(product) => `${basePath}?id=${product.id}`}
            enableRowClick={true}
        />
    )
}

