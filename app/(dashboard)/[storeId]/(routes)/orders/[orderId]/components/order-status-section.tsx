"use client"

import axios from "axios";
import { useState } from "react";
import { Settings } from "lucide-react";
import { Order } from "@prisma/client";
import { currencyFormatter } from "@/lib/utils";

import StatusBadge from "./status-badge";
import { OrderStatusCombobox } from "@/components/ui/status-combobox";
import toast from "react-hot-toast";

const badges = [
    {
        value: "PENDING",
        label: "Pending",
        className: "bg-yellow-100 text-yellow-600",
        message: "Order is waiting for confirmation"
    },
    {
        value: "CONFIRMED",
        label: "Confirmed",
        className: "bg-blue-100 text-blue-600",
        message: "Order is confirmed and ready for shipping"
    },
    {
        value: "SHIPPING",
        label: "Shipping",
        className: "bg-green-100 text-green-600",
        message: "Order is on the way"
    },
    {
        value: "DELIVERED",
        label: "Delivered",
        className: "bg-green-100 text-green-600",
        message: "Order is delivered"
    },
    {
        value: "CANCELLED",
        label: "Cancelled",
        className: "bg-red-100 text-red-600",
        message: "Order is cancelled"
    },
    {
        value: "NOTPAID",
        label: "Payment Pending",
        className: "bg-red-100 text-red-600",
        message: "Payment is pending"
    }
]

interface OrderStatusSectionProps {
    data: Order;
    subTotal: string | number;
    storeId: string;
    orderId: string;
}

const OrderStatusSection: React.FC<OrderStatusSectionProps> = ({
    data,
    subTotal,
    storeId,
    orderId
}) => {
    const [loading, setLoading] = useState(false);

    const status = badges.find((badge) => badge.value === data.orderStatus);

    const onStatusChange = async (statusValue: string) => {
        if (statusValue === data.orderStatus) return;
        try {
            setLoading(true);
            const result = await axios.patch(`/api/${storeId}/orders/${orderId}`, {
                orderStatus: statusValue
            });
            const message = result.data.message;
            if (result.data.success) {
                toast.success(message);
            } else {
                toast.error(message);
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to update order status");
        } finally {
            window.location.reload();
        }
    }

    return (
        <div className="border border-neutral-200 rounded-md shadow-sm dark:bg-sidebar dark:border-black">
            <div className="px-4 pt-4">
                <h3 className="flex items-center gap-x-2 text-lg font-semibold">
                    <Settings className="h-6 w-6" />
                    Order Status
                </h3>
                <div className="mt-2 px-4">
                    <div className="flex gap-x-2">
                        <StatusBadge
                            data={status}
                        />
                        <StatusBadge
                            data={{
                                label: data.paymentMethod === "COD" ? "Cash on Delivery" : "Online Payment",
                                className: "bg-blue-100 text-blue-600"
                            }}
                        />
                    </div>
                    <div className="mt-4 flex flex-col gap-y-2">
                        <div className="flex justify-between items-center">
                            <span className="text-neutral-400">Subtotal</span>
                            <div className="text-gray-900 dark:text-white">
                                {currencyFormatter.format(Number(subTotal || 0))}
                            </div>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-neutral-400">Shipping</span>
                            <div className="text-gray-900 dark:text-white">
                                {currencyFormatter.format(Number(data.shippingFee || 0))}
                            </div>
                        </div>
                        <hr className="my-2" />
                        <div className="flex justify-between items-center">
                            <span className="text-black dark:text-white">Total</span>
                            <div className="text-red-500">
                                {currencyFormatter.format(Number(Number(subTotal || 0) + (data.shippingFee || 0)))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="bg-neutral-100 px-6 py-4 rounded-b-md mt-4 flex justify-between items-center dark:bg-sidebar-accent">
                <p className="text-sm text-neutral-500 dark:text-white">{status?.message}</p>
                <OrderStatusCombobox
                    onChange={onStatusChange}
                    initialValue={data.orderStatus}
                    loading={loading}
                />
            </div>
        </div>
    );
}

export default OrderStatusSection;