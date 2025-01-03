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

//This Method is for customer to cancel order
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
                include: {
                    orderItems: {
                        select: {
                            product: {
                                select: {
                                    id: true,
                                    stock: true
                                }
                            },
                            quantity: true
                        }
                    }
                }
            })

            if (!order) {
                return new NextResponse("Invalid Request", { status: 400, headers: corsHeaders });
            }

            if (order.paymentMethod === "COD") {
                if (order.orderStatus !== "PENDING") {
                    return new NextResponse("Invalid Request", { status: 400, headers: corsHeaders });
                }
            }

            if (order.paymentMethod === "ONLINE") {
                if (order.orderStatus !== "NOTPAID") {
                    return new NextResponse("Invalid Request", { status: 400, headers: corsHeaders });
                }
            }

            const updatedOrder = await prisma.order.update({
                where: {
                    id: params.orderId,
                },
                data: {
                    orderStatus,
                },
            });

            await Promise.all(
                order.orderItems.map((item) =>
                    prisma.product.update({
                        where: { id: item.product.id },
                        data: { stock: item.product.stock + item.quantity },
                    })
                )
            );

            return NextResponse.json(updatedOrder, { headers: corsHeaders });
        }

        return new NextResponse("Invalid Request", { status: 400, headers: corsHeaders });
    } catch (error) {
        console.error("[POST /api/orders]", error);
        return new NextResponse("Internal Server Error", { status: 500, headers: corsHeaders });
    }
}

//This method is for store to update order status
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

        const order = await prisma.order.findUnique({
            where: {
                storeId: params.storeId,
                id: params.orderId,
            },
            include: {
                orderItems: {
                    select: {
                        product: {
                            select: {
                                id: true,
                                stock: true,
                            },
                        },
                        quantity: true,
                    },
                },
            },
        });

        if (!order) {
            return new NextResponse("Invalid Request", { status: 400 });
        }

        if (order.orderStatus !== "CANCELLED") {
            if (orderStatus === "CANCELLED") {
                await Promise.all(
                    order.orderItems.map((item) =>
                        prisma.product.update({
                            where: { id: item.product.id },
                            data: { stock: item.product.stock + item.quantity },
                        })
                    )
                );
            }
        } else {
            if (orderStatus !== "CANCELLED") {
                for (const item of order.orderItems) {
                    const product = await prisma.product.findUnique({
                        where: {
                            id: item.product.id,
                        },
                    });

                    if (!product) {
                        return NextResponse.json({
                            message: "Product not found",
                            success: false,
                        });
                    }

                    if (product.stock < item.quantity) {
                        return NextResponse.json({
                            message: "Product stock is not enough",
                            success: false,
                        });
                    }

                    await prisma.product.update({
                        where: { id: item.product.id },
                        data: { stock: product.stock - item.quantity },
                    });
                }
            }
        }

        await prisma.order.update({
            where: {
                storeId: params.storeId,
                id: params.orderId,
            },
            data: {
                orderStatus: orderStatus,
                paymentMethod: orderStatus === "NOTPAID" ? "ONLINE" : undefined,
            },
        });

        return NextResponse.json({
            message: "Order status updated",
            success: true,
        });
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