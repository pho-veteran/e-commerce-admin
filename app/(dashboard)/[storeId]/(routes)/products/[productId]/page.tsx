import { prisma } from "@/lib/prismadb";
import { ObjectId } from "mongodb";
import ProductForm from "./components/product-form";

const ProductPage = async ({
    params,
}: {
    params: {
        storeId: string;
        productId: string;
    };
}) => {
    const product = !ObjectId.isValid(params.productId)
        ? null
        : await prisma.product.findUnique({
            where: {
                id: params.productId,
            },
            include: {
                images: true,
                productColors: true,
                productSizes: true,
            },
        });

    const formattedProduct = product
        ? {
            ...product,
            productSizes: product.productSizes.map((productSize) => productSize.sizeId),
            productColors: product.productColors.map((productColor) => productColor.colorId),
        }
        : null;

    const categories = await prisma.category.findMany({
        where: {
            storeId: params.storeId,
        },
    });

    const sizes = await prisma.size.findMany({
        where: {
            storeId: params.storeId,
        },
    });

    const colors = await prisma.color.findMany({
        where: {
            storeId: params.storeId,
        },
    });

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <ProductForm
                    categories={categories}
                    sizes={sizes}
                    colors={colors}
                    initialData={formattedProduct}
                />
            </div>
        </div>
    );
};

export default ProductPage;
