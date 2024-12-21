"use client";

import Heading from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { OrderColumn, columns } from "./columns";
import { DataTable } from "./order-data-table";

interface OrderProps {
    data: OrderColumn[];
}

export const OrderClient: React.FC<OrderProps> = ({ data }) => {
    return (
        <>
            <Heading
                title={`Orders (${data.length})`}
                description="Manage orders for your store"
            />
            <Separator />
            <DataTable columns={columns} data={data} searchKey="name" />
        </> 
    );
};
