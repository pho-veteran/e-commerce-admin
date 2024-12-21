"use client";

import * as z from "zod";
import axios from "axios";
import toast from "react-hot-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Trash } from "lucide-react";
import { useState } from "react";
import { useRouter, useParams } from "next/navigation";

import { Color } from "@prisma/client";

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
import { ColorPicker } from "@/components/ui/color-picker";

interface ColorFormProps {
    initialData: Color | null;
}

const formSchema = z.object({
    name: z.string().min(3),
    value: z.string().min(4).regex(/^#/, {
        message: "String must be a valid hex color",
    }),
});

type ColorFormValues = z.infer<typeof formSchema>;

const ColorForm: React.FC<ColorFormProps> = ({ initialData }) => {
    const router = useRouter();
    const params = useParams();

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const title = initialData ? "Edit Color" : "New Color";
    const description = initialData
        ? "Edit the color settings"
        : "Create a new color";
    const toastMessage = initialData
        ? "Color updated successfully"
        : "Color created successfully";
    const action = initialData ? "Save changes" : "Create";

    const form = useForm<ColorFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            name: "",
            value: "",
        },
    });

    const onSubmit = async (data: ColorFormValues) => {
        try {
            setLoading(true);

            if (!initialData) {
                await axios.post(`/api/${params.storeId}/colors`, data);
            } else {
                await axios.patch(
                    `/api/${params.storeId}/colors/${initialData.id}`,
                    data
                );
            }

            router.push(`/${params.storeId}/colors`);
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
                `/api/${params.storeId}/colors/${params.colorId}`
            );

            router.push(`/${params.storeId}/colors`);
            router.refresh();

            toast.success("Color deleted successfully");
        } catch (error) {
            toast.error("Make sure to delete all products using this color");
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
                    <div className="grid grid-cols-2 gap-8">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Color Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            disabled={loading}
                                            placeholder="Color Name"
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
                                    <FormLabel>Color Value</FormLabel>
                                    <FormControl>
                                        <div className="flex items-center gap-x-4">
                                            <ColorPicker 
                                                onChange={field.onChange}
                                                color={field.value}
                                                loading={loading}
                                            />
                                        </div>
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

export default ColorForm;
