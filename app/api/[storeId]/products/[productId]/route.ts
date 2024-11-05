import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import { prisma } from "@/lib/prismadb";

export async function GET(
    req: Request,
    { params }: { params: { productId: string } }
) {
    try {
        if (!params.productId) {
            return new NextResponse("Invalid Request", { status: 400 });
        }

        const product = await prisma.product.findUnique({
            where: {
                id: params.productId,
            },
            include: {
                images: true,
                category: true,
                productColors: {
                    include: {
                        color: true, 
                    },
                },
                productSizes: {
                    include: {
                        size: true,
                    },
                },
            },
        });

        if (!product) {
            return new NextResponse("Product Not Found", { status: 404 });
        }

        return NextResponse.json(product);
    } catch (error) {
        console.error("[GET /api/products]", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export async function PATCH(
    req: Request,
    { params }: { params: { storeId: string; productId: string } }
) {
    try {
        const { userId }: { userId: string | null } = auth();
        const body = await req.json();

        const {
            name,
            price,
            categoryId,
            productColors,
            productSizes,
            images,
            isFeatured,
            isArchived,
        } = body;

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if (
            !name ||
            !price ||
            !categoryId ||
            !productColors ||
            !productSizes ||
            !params.storeId
        ) {
            return new NextResponse("Invalid Request", { status: 400 });
        }

        if (!images || images.length === 0) {
            return new NextResponse("Images are required", { status: 400 });
        }

        const storeByUserId = await prisma.store.findFirst({
            where: {
                id: params.storeId,
                userId,
            },
        });

        if (!storeByUserId) {
            return new NextResponse("Unauthorized", { status: 403 });
        }

        await prisma.product.update({
            where: {
                id: params.productId,
            },
            data: {
                name,
                price,
                categoryId,
                isFeatured,
                isArchived,
                storeId: params.storeId,
                productColors: {
                    deleteMany: {},
                },
                productSizes: {
                    deleteMany: {},
                },
                images: {
                    deleteMany: {},
                },
            },
        });

        const product = await prisma.product.update({
            where: {
                id: params.productId,
            },
            data: {
                productColors: {
                    createMany: {
                        data: productColors.map((colorId: string) => ({
                            colorId,
                        })),
                    },
                },
                productSizes: {
                    createMany: {
                        data: productSizes.map((sizeId: string) => ({
                            sizeId,
                        })),
                    },
                },
                images: {
                    createMany: {
                        data: images.map((image: { url: string }) => ({
                            url: image.url,
                        })),
                    },
                },
            },
        });

        return NextResponse.json(product);
    } catch (error) {
        console.error("[PATCH /api/products]", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: { storeId: string; productId: string } }
) {
    try {
        const { userId }: { userId: string | null } = auth();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if (!params.storeId || !params.productId) {
            return new NextResponse("Invalid Request", { status: 400 });
        }

        const storeByUserId = await prisma.store.findFirst({
            where: {
                id: params.storeId,
                userId,
            },
        });

        if (!storeByUserId) {
            return new NextResponse("Unauthorized", { status: 403 });
        }

        const product = await prisma.product.deleteMany({
            where: {
                id: params.productId,
            },
        });

        return NextResponse.json(product);
    } catch (error) {
        console.error("[DELETE /api/product]", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
