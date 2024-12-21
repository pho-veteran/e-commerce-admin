import { format } from "date-fns";

import { prisma } from "@/lib/prismadb";

import { OrderClient } from "./components/client";
import { OrderColumn } from "./components/columns";
import { currencyFormatter } from "@/lib/utils";

const OrdersPage = async ({
    params,
}: {
    params: {
        storeId: string;
    };
}) => {
    const orders = await prisma.order.findMany({
        where: {
            storeId: params.storeId,
        },
        orderBy: {
            updatedAt: "desc",
        },
        include: {
            orderItems: {
                select: {
                    product: {
                        select: {
                            price: true,
                        },
                    },
                    quantity: true,
                },
            },
        }
    });

    const formattedOrders: OrderColumn[] = orders.map((order) => {
        return {
            id: order.id,
            name: order.name,
            phone: order.phone,
            totalPrice: currencyFormatter.format(
                order.orderItems.reduce(
                    (acc, item) => acc + item.product.price * item.quantity,
                    0
                )
            ),
            paymentMethod: order.paymentMethod,
            orderStatus: order.orderStatus, 
            updatedAt: format(order.updatedAt, "MMMM do, yyyy"),
        };
    });

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <OrderClient data={formattedOrders} />
            </div>
        </div>
    );
};

export default OrdersPage;
