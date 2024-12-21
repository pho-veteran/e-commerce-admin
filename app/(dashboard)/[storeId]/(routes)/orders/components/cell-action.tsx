"use client";

import { useRouter, useParams } from "next/navigation";
import { Settings } from "lucide-react";

import { OrderColumn } from "./columns";
import { Button } from "@/components/ui/button";

interface CellActionProps {
    data: OrderColumn;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
    const router = useRouter();
    const params = useParams();

    const onUpdate = () => {
        router.push(`/${params.storeId}/orders/${data.id}`);
    };
    return (
        <>
            <Button
                variant={"ghost"}
                onClick={onUpdate}
            >
                <Settings />
            </Button>
        </>
    );
};
