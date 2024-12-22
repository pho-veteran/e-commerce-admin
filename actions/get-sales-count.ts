import { prisma } from "@/lib/prismadb";

const getSalesCount = async (storeId: string) => {
    const deliveredOrders = await prisma.order.findMany({
        where: {
            storeId,
            orderStatus: "DELIVERED",
        },
    });

    return deliveredOrders.length;
}
 
export default getSalesCount;