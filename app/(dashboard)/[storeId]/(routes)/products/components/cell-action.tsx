"use client";

import axios from "axios";
import { useRouter, useParams } from "next/navigation";
import { useState } from "react";
import { Copy, Edit, MoreHorizontal, Trash } from "lucide-react";
import toast from "react-hot-toast";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ProductColumn } from "./columns";
import { Button } from "@/components/ui/button";
import { ConfirmModal } from "@/components/modals/confirm-modal";

interface CellActionProps {
    data: ProductColumn;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
    const router = useRouter();
    const params = useParams();

    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);

    const onCopy = (id: string) => {
        navigator.clipboard.writeText(id);
        toast.success("Copied to clipboard!");
    };
    const onUpdate = () => {
        router.push(`/${params.storeId}/products/${data.id}`);
    };
    const onDelete = async () => {
        try {
            setLoading(true);
            await axios.delete(`/api/${params.storeId}/products/${data.id}`);
            router.refresh();
            toast.success("Product deleted successfully");
        } catch (error) {
            toast.error(
                "Make sure to delete all categories using this product"
            );
            console.error(error);
        } finally {
            setLoading(false);
        }
    };
    return (
        <>
            <ConfirmModal 
                isOpen={open}
                onClose={() => setOpen(false)}
                onConfirm={() => onDelete()}
                loading={loading}
            />
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => onCopy(data.id)}>
                        <Copy className="mr-2 w-4 h-4" />
                        Copy ID
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={onUpdate}>
                        <Edit className="mr-2 w-4 h-4" />
                        Update
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => setOpen(true)}
                    >
                        <Trash className="mr-2 w-4 h-4" />
                        Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
};
