"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";

export type OrderColumn = {
    id: string;
    name: string;
    phone: string;
    totalPrice: string;
    paymentMethod: string;
    orderStatus: string;
    updatedAt: string;
};

export const columns: ColumnDef<OrderColumn>[] = [
    {
        accessorKey: "name",
        header: "Name",
    },
    {
        accessorKey: "phone",
        header: "Phone",
    },
    {
        accessorKey: "totalPrice",
        header: "Total Price",
    },
    {
        accessorKey: "paymentMethod",
        header: "Payment Method",
    },
    {
        accessorKey: "orderStatus",
        header: "Status",
    },
    {
        id: "actions",
        cell: ({ row }) => <CellAction data={row.original}/>,
    },
];
