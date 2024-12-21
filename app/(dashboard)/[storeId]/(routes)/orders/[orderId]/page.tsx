import { prisma } from "@/lib/prismadb";
import { ObjectId } from "mongodb";
import { redirect } from "next/navigation";
import OrderItemCard from "./components/order-item-card";
import { AlignJustify, MapPinHouse, Package, PencilLine, Phone, User } from "lucide-react";
import OrderStatusSection from "./components/order-status-section";

const OrderPage = async ({
    params,
}: {
    params: {
        storeId: string;
        orderId: string;
    };
}) => {
    const order = !ObjectId.isValid(params.orderId)
        ? null
        : await prisma.order.findUnique({
            where: {
                id: params.orderId,
            },
            include: {
                orderItems: {
                    select: {
                        product: {
                            select: {
                                images: true,
                                name: true,
                                price: true,
                                category: {
                                    select: {
                                        name: true,
                                    },
                                },
                            },
                        },
                        color: true,
                        size: true,
                        quantity: true,
                    },
                }
            }
        });

    if (!order) {
        redirect(`/${params.storeId}/orders`);
    }

    const orderItems = order.orderItems.map((orderItem) => ({
        product: {
            name: orderItem.product.name,
            images: orderItem.product.images,
            price: orderItem.product.price,
            category: {
                name: orderItem.product.category.name,
            },
        },
        color: {
            name: orderItem.color.name,
            value: orderItem.color.value,
        },
        size: {
            name: orderItem.size.name,
        },
        quantity: orderItem.quantity
    }));

    const subTotal = orderItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

    const formattedDate = new Date(order.updatedAt).toLocaleString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: true,
    });

    return (
        <div className="p-8 pt-6">
            <div className="space-y-2">
                <h1
                    className="text-2xl font-semibold tracking-tight"
                >Order #{order.id}</h1>
                <p className="text-neutral-400 text-sm">{formattedDate} from {order.name}</p>
            </div>
            <div className="flex-1 md:grid grid-cols-12 mt-8 gap-x-4">
                <div className="md:col-span-8 space-y-4">
                    <OrderStatusSection 
                        data={order}
                        subTotal={subTotal}
                        storeId={params.storeId}
                        orderId={params.orderId}
                    />

                    <div className="border border-neutral-200 rounded-md shadow-sm dark:bg-sidebar dark:border-none">
                        <div className="px-4 pt-4">
                            <h3 className="flex items-center gap-x-2 text-lg font-semibold">
                                <Package className="h-6 w-6" />
                                Order Item
                            </h3>
                            <ul className="mt-6 max-h-[32rem] overflow-y-auto overflow-x-hidden space-y-2 px-4">
                                {orderItems.map((item, index) => (
                                    <OrderItemCard
                                        key={index}
                                        data={item}
                                    />
                                ))}
                            </ul>
                        </div>
                        <div className="bg-neutral-100 px-6 py-4 rounded-b-md mt-4 dark:bg-sidebar-accent flex h-16">
                            <p className="text-sm text-neutral-500 dark:text-white my-auto block">Review customer order items</p>
                        </div>
                    </div>
                </div>
                <div className="md:col-span-4 mt-4 md:mt-0">
                    <div className="md:sticky top-10 right-0 rounded-md w-full space-y-4">
                        <div className="border border-neutral-200 rounded-md p-4 dark:bg-sidebar dark:border-none dark:text-white">
                            <h3 className="flex items-center gap-x-2 text-base font-semibold justify-between">
                                <span>Note</span>
                                <PencilLine className="w-6 h-6" />
                            </h3>
                            <p className="mt-2 text-sm text-neutral-600 dark:text-white">
                                {order.orderMessage ? order.orderMessage : "No note"}
                            </p>
                        </div>  
                        <div className="border border-neutral-200 rounded-md p-4 dark:bg-sidebar dark:border-none dark:text-white">
                            <h3 className="flex items-center gap-x-2 text-base font-semibold justify-between">
                                <span>Shipping address</span>
                                <MapPinHouse className="w-6 h-6" />
                            </h3>
                            <div className="mt-4 space-y-4 text-neutral-600 dark:text-white">
                                <p className="text-sm gap-x-2 flex items-center">
                                    <span>{order.address}</span>
                                </p>
                                <p className="text-sm gap-x-2 flex items-center">
                                    <User className="w-4 h-4" />
                                    <span>{order.name}</span>
                                </p>
                                <p className="text-sm gap-x-2 flex items-center">
                                    <Phone className="w-4 h-4" />
                                    <span>{order.phone}</span>
                                </p>
                                <p className="text-sm gap-x-2 flex items-center">
                                    <AlignJustify className="w-4 h-4"/>
                                    <span>{order.addressType.charAt(0) + order.addressType.slice(1).toLowerCase()} Address</span>
                                </p>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderPage;
