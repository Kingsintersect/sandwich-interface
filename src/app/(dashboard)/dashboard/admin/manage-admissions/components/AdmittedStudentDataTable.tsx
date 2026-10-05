"use client";
import { Notebook01Icon, PencilEdit02Icon } from "@hugeicons/core-free-icons";

import { DataTable } from "@/components/ui/data-table"
import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { useDataTable } from '@/hooks/useDataTable'
import { getAdmittedApplicants } from "@/app/actions/applications";
import { ActionMenu } from "@/components/ui/datatable/ActionMenu";
import { baseUrl } from "@/config";
import { UserInterface } from "@/config/Types";

const basePath = `${baseUrl}/dashboard/admin/manage-admissions`;
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
export const AdmittedStudentDataTable = () => {
    type StatusKey = "FULLY_PAID" | "PART_PAID" | "NOT_PAID";
    const statusStyles: Record<StatusKey, string> = {
        FULLY_PAID: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300",
        PART_PAID: "bg-ember-50 text-ember-700 border-ember-200 dark:bg-ember-900/40 dark:text-ember-300",
        NOT_PAID: "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/50 dark:text-red-300",
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
        fetchFn: getAdmittedApplicants,
        queryKey: ["getAllAdmittedStudents"],
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
            accessorKey: "academic_session",
            header: "Session",
            cell: ({ row }) => {
                const session = row.getValue("academic_session") as string | null;
                return session
                    ? <span className="font-medium tabular-nums">{session}</span>
                    : <span className="text-muted-foreground">&mdash;</span>;
            },
        },
        {
            accessorKey: "application_payment_status",
            header: "Application Fee",
            cell: ({ row }) => {
                const statusKey = row.getValue("application_payment_status") as StatusKey;
                const statusText = statusKey === "FULLY_PAID"
                    ? "FULLY PAID" : statusKey === "PART_PAID"
                        ? "PART PAID" : "NOT PAID";
                return (
                    <Badge className={`rounded-lg ${statusStyles[statusKey] ?? statusStyles.NOT_PAID}`}>
                        {statusText}
                    </Badge>
                )
            },
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
                            { title: "Review Application", url: `${baseUrl}/dashboard/update-application-form?id=${student.id}`, icon: Notebook01Icon },
                            { title: "Update Record", url: `${basePath}/${student.id}`, icon: PencilEdit02Icon },
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
            getRowClickUrl={(product) => `${basePath}/${product.id}`}
            enableRowClick={false}
        />
    )
}

