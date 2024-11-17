import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import { prisma } from "@/lib/prismadb";

export async function POST(
    req: Request,
    { params }: { params: { storeId: string } }
) {
    try {
        const { userId }: { userId: string | null } = auth();
        const body = await req.json();

        const {
            name,
            price,
            categoryId,
            productSizes,
            productColors,
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

        const product = await prisma.product.create({
            data: {
                name,
                price,
                categoryId,
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
                isFeatured,
                isArchived,
                storeId: params.storeId,
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
        console.error("[POST /api/products]", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export async function GET(
    req: Request,
    { params }: { params: { storeId: string } }
) {
    try {
        const { searchParams } = new URL(req.url);
        const categoryId = searchParams.get("categoryId") || undefined;
        const colorId = searchParams.get("colorId") || undefined;
        const sizeId = searchParams.get("sizeId") || undefined;
        const isFeatured = searchParams.get("isFeatured");
        const name = searchParams.get("name") || undefined;
        const ids = searchParams.get("ids")?.split(",") || undefined;

        if (!params.storeId) {
            return new NextResponse("Invalid Request", { status: 400 });
        }

        const product = await prisma.product.findMany({
            where: {
                storeId: params.storeId,
                categoryId,
                isFeatured: isFeatured ? true : undefined,
                isArchived: false,
                name: {
                    contains: name,
                    mode: "insensitive",
                },
                productColors: {
                    some: {
                        colorId: colorId, 
                    },
                },
                productSizes: {
                    some: {
                        sizeId: sizeId, 
                    },
                },
                id: ids ? { in: ids } : undefined,
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
            orderBy: {
                createdAt: "desc",
            },
        });

        return NextResponse.json(product);
    } catch (error) {
        console.error("[GET /api/products]", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
