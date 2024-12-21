import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import { prisma } from "@/lib/prismadb";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
    return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(
    req: Request,
    { params }: { params: { storeId: string; orderId: string } }
) {
    try {
        const body = await req.json();

        const { 
            orderStatus,
            customerId 
        } = body;

        if (orderStatus === "CANCELLED" && customerId) {
            const order = await prisma.order.findUnique({
                where: {
                    storeId: params.storeId,
                    id: params.orderId,
                    customerId
                },
            })

            if (!order || order.paymentMethod !== "COD" || order.orderStatus !== "PENDING") {
                return new NextResponse("Invalid Request", { status: 400, headers: corsHeaders });
            }

            const updatedOrder = await prisma.order.update({
                where: {
                    id: params.orderId,
                },
                data: {
                    orderStatus,
                },
            });

            return NextResponse.json(updatedOrder, { headers: corsHeaders });
        }

        return new NextResponse("Invalid Request", { status: 400, headers: corsHeaders });
    } catch (error) {
        console.error("[POST /api/orders]", error);
        return new NextResponse("Internal Server Error", { status: 500, headers: corsHeaders });
    }
}


export async function PATCH(
    req: Request,
    { params }: { params: { storeId: string; orderId: string } }
) {
    try {
        const body = await req.json();

        const { 
            orderStatus
        } = body;

        const { userId }: { userId: string | null } = auth();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if (!orderStatus || !params.storeId || !params.orderId) {
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

        const updateData: any = { orderStatus };

        if (orderStatus === "NOTPAID") {
            updateData.paymentMethod = "ONLINE";
        }

        const order = await prisma.order.update({
            where: {
                storeId: params.storeId,
                id: params.orderId,
            },
            data: updateData,
        });

        return NextResponse.json(order, { headers: corsHeaders });
    } catch (error) {
        console.error("[PATCH /api/orders]", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export async function GET(
    req: Request,
    { params }: { params: { 
        storeId: string,
        orderId: string, 
    }}
) {
    const url = new URL(req.url);
    const customerId = url.searchParams.get("customerId") || undefined;

    try {
        if (!params.storeId || !params.orderId || !customerId) {
            return new NextResponse("Invalid Request", { status: 400 });
        }

        const order = await prisma.order.findUnique({
            where: {
                storeId: params.storeId,
                id: params.orderId,
                customerId
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
            }
        });

        return NextResponse.json(order, { headers: corsHeaders });
    } catch (error) {
        console.error("[POST /api/orders]", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}