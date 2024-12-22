import { format } from "date-fns";

import { prisma } from "@/lib/prismadb";

import { ProductClient } from "./components/client";
import { ProductColumn } from "./components/columns";
import { currencyFormatter } from "@/lib/utils";

const ProductsPage = async ({
    params,
}: {
    params: {
        storeId: string;
    };
}) => {
    const products = await prisma.product.findMany({
        where: {
            storeId: params.storeId,
        },
        include: {
            category: true,
            productColors: true,
            productSizes: true,
        },
        orderBy: {
            createdAt: "desc",
        }
    });

    const formattedProducts : ProductColumn[] = products.map((product) => {
        return {
            id: product.id,
            name: product.name,
            isFeatured: product.isFeatured,
            isArchived: product.isArchived,
            price: currencyFormatter.format(product.price),
            category: product.category.name,
            productSizes: product.productSizes.length,
            productColors: product.productColors.length,
            createdAt: format(product.createdAt, "MMMM do, yyyy"),
        };
    });

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-2">
                <ProductClient data={formattedProducts}/>
            </div>
        </div>
    );
};

export default ProductsPage;
