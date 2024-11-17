"use client";

import * as z from "zod";
import axios from "axios";
import toast from "react-hot-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Trash } from "lucide-react";
import { Store } from "@prisma/client";
import { useState } from "react";
import { useRouter } from "next/navigation";

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
import { ApiAlert } from "@/components/ui/api-alert";
import { useOrigin } from "@/hooks/use-origin";

interface SettingFormProps {
    initialData: Store;
}

const formSchema = z.object({
    name: z.string().min(3),
    frontendUrl: z.string().url(),
    vnpay_tmn: z.string(),
    vnpay_hashSecret: z.string(),
});

type SettingFormValues = z.infer<typeof formSchema>;

const SettingForm: React.FC<SettingFormProps> = ({ initialData }) => {
    const router = useRouter();

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const form = useForm<SettingFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData,
    });

    const onSubmit = async (data: SettingFormValues) => {
        try {
            setLoading(true);
            await axios.patch(`/api/stores/${initialData.id}`, data);
            router.refresh();
            toast.success("Store settings updated successfully");
        } catch (error) {
            toast.error("Failed to update store settings");
        } finally {
            setLoading(false);
        }
    };

    const onDelete = async () => {
        try {
            setLoading(true);
            await axios.delete(`/api/stores/${initialData.id}`);
            router.refresh();
            router.push("/");
            toast.success("Store deleted successfully");
        } catch (error) {
            toast.error("Make sure to delete all products before deleting the store");
        } finally {
            setLoading(false);
        }
    }

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
                <Heading
                    title="Settings"
                    description="Manage store preferences"
                />
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
            </div>
            <Separator />
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-8 w-full"
                >
                    <div className="grid sm:grid-cols-2 gap-8">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={loading}
                                            placeholder="Store name"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="frontendUrl"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Your Store URL</FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={loading}
                                            placeholder="Your store frontend url..."
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="relative sm:col-span-2 pt-8 pb-4 px-4 border grid sm:grid-cols-2 gap-8 rounded-md mt-2">
                            <div className="absolute top-[-16px] left-[12px] flex items-center gap-x-2 bg-background text-sm px-1">
                                <img
                                    className="h-8"
                                    src="/payment-method-imgs/vnpay.png"
                                    alt="VNPay"
                                />
                                <span>VNPay Payments Settings</span>
                            </div>
                            <FormField
                                control={form.control}
                                name="vnpay_tmn"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>VNPay TMN Code</FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={loading}
                                                placeholder="VNPay TMN..."
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="vnpay_hashSecret"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>VNPay Hash Secret</FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={loading}
                                                placeholder="VNPay Hash Secret"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>
                    <Button
                        disabled={loading}
                        className="ml-auto"
                        type="submit"
                    >
                        Save Changes
                    </Button>
                </form>
            </Form>
            <Separator />
            <ApiAlert
                title="PUBLIC_STORE_URL"
                description={`${useOrigin()}/api/${initialData.id}`}
                variant="public"
            ></ApiAlert>
        </>
    );
};

export default SettingForm;
