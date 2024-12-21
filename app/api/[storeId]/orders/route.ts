import { NextResponse } from "next/server";

import { prisma } from "@/lib/prismadb";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
    return NextResponse.json({}, { headers: corsHeaders });
}

export async function GET(
    req: Request,
    { params }: { params: { storeId: string } }
) {
    try {
        const { searchParams } = new URL(req.url);
        const customerId = searchParams.get("customerId") || undefined;

        if (!params.storeId || !customerId) {
            return new NextResponse("Invalid Request", { status: 400 });
        }

        const orders = await prisma.order.findMany({
            where: {
                storeId: params.storeId,
                customerId,
            },
            include: {
                orderItems: {
                    select: {
                        product: {
                            select: {
                                images: true,
                                name: true,
                                price: true,
                                category: {
                                    select: {
                                        name: true,
                                    },
                                },
                            },
                        },
                        color: true,
                        size: true,
                        quantity: true,
                    },
                }
            },
            orderBy: {
                updatedAt: "desc",
            },
        });

        return NextResponse.json(orders);
    } catch (error) {
        console.error("[POST /api/orders]", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
