import { NextResponse } from "next/server";
import { prisma } from "@/lib/prismadb";
import { getVNPayModel } from "@/model";
import { dateFormat, VnpLocale } from "vnpay";

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
        if (!params.storeId) {
            return new NextResponse("Invalid Request", {
                status: 400,
                headers: corsHeaders,
            });
        }
        const store = await prisma.store.findFirst({
            where: {
                id: params.storeId,
            },
        });
        if (!store) {
            return new NextResponse("Store not found", {
                status: 404,
                headers: corsHeaders,
            });
        }

        const payload = await req.json();

        const { 
            orderId, 
            clientIp, 
            paymentMethod, 
            customerId 
        } = payload;

        if (!orderId || !clientIp) {
            return new NextResponse("Invalid Request", {
                status: 400,
                headers: corsHeaders,
            });
        }

        const order = await prisma.order.findFirst({
            where: {
                id: orderId,
                customerId: customerId,
            },
            include: {
                orderItems: {
                    select: {
                        product: {
                            select: {
                                price: true,
                            },
                        },
                        quantity: true,
                    },
                },
            },
        });

        if (!order) {
            return new NextResponse("Order not found", {
                status: 404,
                headers: corsHeaders,
            });
        }

        if (paymentMethod === "COD") {
            await prisma.order.update({
                where: {
                    id: orderId,
                },
                data: {
                    orderStatus: "PENDING",
                    paymentMethod: "COD",
                },
            });

            return NextResponse.json(
                {
                    url: `${store.frontendUrl}/checkout/result?cod=1&orderId=${order.id}`,
                },
                { headers: corsHeaders }
            );
        }

        const totalPrice =
            order.orderItems.reduce(
                (acc, item) => acc + item.product.price * item.quantity,
                0
            ) + order.shippingFee;

        if (
            order.orderStatus !== "NOTPAID" &&
            order.paymentMethod !== "ONLINE"
        ) {
            return new NextResponse("Order already paid", {
                status: 400,
                headers: corsHeaders,
            });
        }

        const vnpay = await getVNPayModel(
            store.vnpay_tmn,
            store.vnpay_hashSecret
        );

        const url = vnpay.buildPaymentUrl({
            vnp_Amount: totalPrice,
            vnp_IpAddr: clientIp,
            vnp_OrderInfo: `Order ${order.id}`,
            vnp_ReturnUrl: `${store.frontendUrl}/checkout/result`,
            vnp_TxnRef: order.id,
            vnp_BankCode:
                paymentMethod === "VNPAYEWALLET" ? "VNPAYEWALLET" : undefined,
            vnp_Locale: VnpLocale.EN,
            vnp_CreateDate: dateFormat(new Date()),
        });

        return NextResponse.json({ url: url }, { headers: corsHeaders });
    } catch (error) {
        console.error("[POST /api/checkout]", error);
        return new NextResponse("Internal Server Error", {
            status: 500,
            headers: corsHeaders,
        });
    }
}
