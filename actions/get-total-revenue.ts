import { prisma } from "@/lib/prismadb";

const getTotalRevenue = async (storeId: string) => {
    const deliveredOrders = await prisma.order.findMany({
        where: {
            storeId,
            orderStatus: "DELIVERED",
        },
        include: {
            orderItems: {
                select: {
                    product: {
                        select: {
                            price: true,
                        }
                    },
                    quantity: true,
                },
            }
        }
    });

    const totalRevenue = deliveredOrders.reduce((acc, order) => {
        return acc + order.orderItems.reduce((acc2, orderItem) => {
            return acc2 + orderItem.product.price * orderItem.quantity;
        }, 0);
    }, 0);

    return totalRevenue;
}
 
export default getTotalRevenue;