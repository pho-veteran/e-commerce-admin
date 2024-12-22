import { prisma } from "@/lib/prismadb";

const getProductsStock = async (storeId: string) => {
    const stockedProducts = await prisma.product.findMany({
        where: {
            storeId,
            isArchived: false,
        },
    });

    return stockedProducts.length;
}

export default getProductsStock;