"use client";

import * as z from "zod";
import axios from "axios";
import toast from "react-hot-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Trash } from "lucide-react";
import { useState } from "react";
import { useRouter, useParams } from "next/navigation";

import { Size } from "@prisma/client";

import Heading from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ConfirmModal } from "@/components/modals/confirm-modal";
import ImageUpload from "@/components/ui/image-upload";

interface SizeFormProps {
    initialData: Size | null;
}

const formSchema = z.object({
    name: z.string().min(3),
    value: z.string().min(1),
});

type SizeFormValues = z.infer<typeof formSchema>;

const SizeForm: React.FC<SizeFormProps> = ({ initialData }) => {
    const router = useRouter();
    const params = useParams();

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const title = initialData ? "Edit Size" : "New Size";
    const description = initialData
        ? "Edit the size settings"
        : "Create a new size";
    const toastMessage = initialData
        ? "Size updated successfully"
        : "Size created successfully";
    const action = initialData ? "Save changes" : "Create";

    const form = useForm<SizeFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            name: "",
            value: "",
        },
    });

    const onSubmit = async (data: SizeFormValues) => {
        try {
            setLoading(true);

            if (!initialData) {
                await axios.post(`/api/${params.storeId}/sizes`, data);
            } else {
                await axios.patch(
                    `/api/${params.storeId}/sizes/${initialData.id}`,
                    data
                );
            }
            
            router.push(`/${params.storeId}/sizes`);
            router.refresh();
            
            toast.success(toastMessage);
        } catch (error) {
            toast.error("Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    const onDelete = async () => {
        try {
            setLoading(true);
            await axios.delete(`/api/${params.storeId}/sizes/${params.sizeId}`);
            
            router.push(`/${params.storeId}/sizes`);
            router.refresh();
            
            toast.success("Size deleted successfully");
        } catch (error) {
            toast.error(
                "Make sure to delete all products using this size"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <ConfirmModal
                isOpen={open}
                onClose={() => setOpen(false)}
                onConfirm={() => {
                    onDelete();
                }}
                loading={loading}
            ></ConfirmModal>
            <div className="flex items-center justify-between">
                <Heading title={title} description={description} />
                {initialData && (
                    <Button
                        disabled={loading}
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                            setOpen(true);
                        }}
                    >
                        <Trash className="h-4 w-4" />
                    </Button>
                )}
            </div>
            <Separator />
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-8 w-full"
                >
                    <div className="grid grid-cols-2 gap-8">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Size Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={loading}
                                            placeholder="Size Name"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="value"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Size Value</FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={loading}
                                            placeholder="Size Value"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <Button
                        disabled={loading}
                        className="ml-auto"
                        type="submit"
                    >
                        {action}
                    </Button>
                </form>
            </Form>
            <Separator />
        </>
    );
};

export default SizeForm;
