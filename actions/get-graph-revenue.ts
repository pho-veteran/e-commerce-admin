import { prisma } from "@/lib/prismadb";

interface GraphData {
    name: string;
    total: number;
}

const getGraphRevenue = async (storeId: string) => {
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

    const monthlyRevenue: { [key: number]: number } = {};

    for (const order of deliveredOrders) {
        const month = order.createdAt.getMonth();
        const revenue = order.orderItems.reduce((acc, orderItem) => {
            return acc + orderItem.product.price * orderItem.quantity;
        }, 0);

        if (monthlyRevenue[month]) {
            monthlyRevenue[month] += revenue;
        } else {
            monthlyRevenue[month] = revenue;
        }
    }

    const graphData: GraphData[] = [
        {
            name: "Jan",
            total: monthlyRevenue[0] || 0,
        },
        {
            name: "Feb",
            total: monthlyRevenue[1] || 0,
        },
        {
            name: "Mar",
            total: monthlyRevenue[2] || 0,
        },
        {
            name: "Apr",
            total: monthlyRevenue[3] || 0,
        },
        {
            name: "May",
            total: monthlyRevenue[4] || 0,
        },
        {
            name: "Jun",
            total: monthlyRevenue[5] || 0,
        },
        {
            name: "Jul",
            total: monthlyRevenue[6] || 0,
        },
        {
            name: "Aug",
            total: monthlyRevenue[7] || 0,
        },
        {
            name: "Sep",
            total: monthlyRevenue[8] || 0,
        },
        {
            name: "Oct",
            total: monthlyRevenue[9] || 0,
        },
        {
            name: "Nov",
            total: monthlyRevenue[10] || 0,
        },
        {
            name: "Dec",
            total: monthlyRevenue[11] || 0,
        }
    ];

    return graphData;
}
 
export default getGraphRevenue;