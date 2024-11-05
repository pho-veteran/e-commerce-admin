"use client";

import * as z from "zod";
import axios from "axios";
import toast from "react-hot-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Trash } from "lucide-react";
import { Product, Image, Category, Size, Color, ProductSize, ProductColor } from "@prisma/client";
import { useState } from "react";
import { useRouter, useParams } from "next/navigation";

import Heading from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { ConfirmModal } from "@/components/modals/confirm-modal";
import ImageUpload from "@/components/ui/image-upload";
import { Checkbox } from "@/components/ui/checkbox";
import { MultiSelect } from "@/components/ui/multi-select";

interface ProductFormProps {
    categories: Category[];
    sizes: Size[];
    colors: Color[];
    initialData:
    (
        Product &
        { images: Image[] } &
        { productSizes: string[] } &
        { productColors: string[] }
    )
    | null;
}

const formSchema = z.object({
    name: z.string().min(3),
    images: z.object({ url: z.string() }).array().min(1),
    price: z.coerce.number().min(1),
    categoryId: z.string(),
    productColors: z.string().array().min(1),
    productSizes: z.string().array().min(1),
    isFeatured: z.boolean().default(false).optional(),
    isArchived: z.boolean().default(false).optional(),
});

type ProductFormValues = z.infer<typeof formSchema>;

const ProductForm: React.FC<ProductFormProps> = ({
    categories,
    sizes,
    colors,
    initialData,
}) => {
    const router = useRouter();
    const params = useParams();

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const title = initialData ? "Edit Product" : "New Product";
    const description = initialData
        ? "Edit the product settings"
        : "Create a new product";
    const toastMessage = initialData
        ? "Product updated successfully"
        : "Product created successfully";
    const action = initialData ? "Save changes" : "Create";

    const form = useForm<ProductFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData
            ? {
                ...initialData,
                price: parseFloat(String(initialData?.price)),
            }
            : {
                name: "",
                images: [],
                price: 0,
                categoryId: "",
                productColors: [],
                productSizes: [],
                isFeatured: false,
                isArchived: false,
            },
    });

    const formattedSizes = sizes.map((size) => (
        {
            label: size.name,
            value: size.id,
            icon: () => (
                <span
                    className="block p-1 font-semibold text-sm"
                >{size.value}</span>
            )
        }
    ))

    const formattedColors = colors.map((color) => (
        {
            label: color.name,
            value: color.id,
            icon: () => (
                <div className="p-1">
                    <div
                        className={"h-5 w-5 rounded-full border"}
                        style={{ backgroundColor: color.value }}
                    />
                </div>
            )
        }
    ))

    const onSubmit = async (data: ProductFormValues) => {
        try {
            setLoading(true);

            if (!initialData) {
                await axios.post(`/api/${params.storeId}/products`, data);
            } else {
                await axios.patch(
                    `/api/${params.storeId}/products/${initialData.id}`,
                    data
                );
            }

            router.push(`/${params.storeId}/products`);
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
            await axios.delete(
                `/api/${params.storeId}/products/${params.productId}`
            );

            router.push(`/${params.storeId}/products`);
            router.refresh();

            toast.success("Product deleted successfully");
        } catch (error) {
            toast.error("Something went wrong.");
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
                        name="images"
                        render={({ field }) => {
                            return (
                                <FormItem>
                                    <FormLabel>Images</FormLabel>
                                    <FormControl>
                                        <ImageUpload
                                            disabled={loading}
                                            onChange={(url) =>
                                                field.onChange([
                                                    ...field.value,
                                                    { url },
                                                ])
                                            }
                                            onRemove={(url) =>
                                                field.onChange([
                                                    ...field.value.filter(
                                                        (image) =>
                                                            image.url !== url
                                                    ),
                                                ])
                                            }
                                            value={field.value.map(
                                                (image) => image.url
                                            )}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            );
                        }}
                    />

                    <div className="grid md:grid-cols-3 grid-cols-1 gap-8">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            disabled={loading}
                                            placeholder="Product Name"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="price"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Price</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            type="number"
                                            disabled={loading}
                                            placeholder="9.99"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="categoryId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Category</FormLabel>
                                    <Select
                                        disabled={loading}
                                        onValueChange={field.onChange}
                                        value={field.value}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue
                                                    defaultValue={field.value}
                                                    placeholder="Select a category"
                                                />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {categories.map((category) => (
                                                <SelectItem
                                                    key={category.id}
                                                    value={category.id}
                                                >
                                                    {category.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="productSizes"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Size</FormLabel>
                                    <MultiSelect
                                        options={formattedSizes}
                                        value={field.value}
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                        placeholder="Select sizes"
                                        animation={2}
                                        maxCount={3}
                                        variant={"inverted"}
                                    />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="productColors"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Product Colors</FormLabel>
                                    <MultiSelect
                                        options={formattedColors}
                                        value={field.value}
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                        placeholder="Select colors"
                                        animation={2}
                                        maxCount={3}
                                        variant={"inverted"}
                                    />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="isFeatured"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center gap-x-4 gap-y-3 rounded-md border p-4">
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <div className="space-y-1 leading-none mb-8">
                                        <FormLabel className="font-semibold">
                                            Featured
                                        </FormLabel>
                                        <FormDescription>
                                            This product will be featured on the
                                            homepage
                                        </FormDescription>
                                    </div>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="isArchived"
                            render={({ field }) => (
                                <FormItem className="flex items-center gap-x-4 gap-y-3 rounded-md border p-4">
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <div className="space-y-1 leading-none mb-8">
                                        <FormLabel className="font-semibold">
                                            Archived
                                        </FormLabel>
                                        <FormDescription>
                                            This product will be not be
                                            displayed on the store
                                        </FormDescription>
                                    </div>
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

export default ProductForm;
