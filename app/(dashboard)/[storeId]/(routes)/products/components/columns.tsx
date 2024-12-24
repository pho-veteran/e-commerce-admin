"use client";

import { ColumnDef } from "@tanstack/react-table";

import { CellAction } from "./cell-action";

export type ProductColumn = {
    id: string;
    name: string;
    price: string;
    productSizes: number;
    productColors: number;
    category: string;
    isFeatured: boolean;
    isArchived: boolean;
    stock: number;
};

export const columns: ColumnDef<ProductColumn>[] = [
    {
        accessorKey: "name",
        header: "Name",
    },
    {
        accessorKey: "isArchived",
        header: "Archived",
    },
    {
        accessorKey: "isFeatured",
        header: "Featured",
    },
    {
        accessorKey: "price",
        header: "Price",
    },
    {
        accessorKey: "category",
        header: "Category",
    },
    {
        accessorKey: "productSizes",
        header: "Sizes",
    },
    {
        accessorKey: "productColors",
        header: "Colors",
    },
    {
        accessorKey: "stock",
        header: "Stock",
    },
    {
        id: "actions",
        cell: ({ row }) => <CellAction data={row.original} />,
    },
];
