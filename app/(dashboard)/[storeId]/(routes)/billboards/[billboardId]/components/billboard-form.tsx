"use client";

import * as z from "zod";
import axios from "axios";
import toast from "react-hot-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Trash } from "lucide-react";
import { Billboard } from "@prisma/client";
import { useState } from "react";
import { useRouter, useParams } from "next/navigation";

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

interface BillboardFormProps {
    initialData: Billboard | null;
}

const formSchema = z.object({
    label: z.string().min(3),
    imageUrl: z.string().min(1),
});

type BillboardFormValues = z.infer<typeof formSchema>;

const BillboardForm: React.FC<BillboardFormProps> = ({ initialData }) => {
    const router = useRouter();
    const params = useParams();

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const title = initialData ? "Edit Billboard" : "New Billboard";
    const description = initialData
        ? "Edit the billboard settings"
        : "Create a new billboard";
    const toastMessage = initialData
        ? "Billboard updated successfully"
        : "Billboard created successfully";
    const action = initialData ? "Save changes" : "Create";

    const form = useForm<BillboardFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            label: "",
            imageUrl: "",
        },
    });

    const onSubmit = async (data: BillboardFormValues) => {
        try {
            setLoading(true);

            if (!initialData) {
                await axios.post(`/api/${params.storeId}/billboards`, data);
            } else {
                await axios.patch(
                    `/api/${params.storeId}/billboards/${initialData.id}`,
                    data
                );
            }

            router.push(`/${params.storeId}/billboards`);
            router.refresh();

            toast.success(toastMessage);
        } catch (error) {
            toast.error("Something went wrong.");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const onDelete = async () => {
        try {
            setLoading(true);
            await axios.delete(
                `/api/${params.storeId}/billboards/${params.billboardId}`
            );

            router.push(`/${params.storeId}/billboards`);
            router.refresh();

            toast.success("Billboard deleted successfully");
        } catch (error) {
            toast.error(
                "Make sure to delete all categories using this billboard"
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
                    <FormField
                        control={form.control}
                        name="imageUrl"
                        render={({ field }) => {
                            console.log(field);
                            return (
                                <FormItem>
                                    <FormLabel>Background Image</FormLabel>
                                    <FormControl>
                                        <ImageUpload
                                            disabled={loading}
                                            onChange={(url) => {
                                                field.onChange(url);
                                                console.log(field);
                                            }}
                                            onRemove={() => field.onChange("")}
                                            value={
                                                field.value ? [field.value] : []
                                            }
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            );
                        }}
                    />

                    <div className="">
                        <FormField
                            control={form.control}
                            name="label"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Label</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            className="max-w-[300px]"
                                            disabled={loading}
                                            placeholder="Billboard Label"
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

export default BillboardForm;
