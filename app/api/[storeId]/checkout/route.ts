import { NextResponse } from "next/server";
import { dateFormat, VnpLocale } from "vnpay";
import { getVNPayModel } from "@/model";
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
    { params }: { params: { storeId: string } }
) {
    try {
        if (!params.storeId) {
            return new NextResponse("Invalid Request", { status: 400, headers: corsHeaders });
        }
        const store = await prisma.store.findFirst({
            where: {
                id: params.storeId,
            },
        });
        if (!store) {
            return new NextResponse("Store not found", { status: 404, headers: corsHeaders });
        }

        const payload = await req.json();

        const order = await prisma.order.create({
            data: {
                storeId: params.storeId,
                orderItems: {
                    create: payload.orderItems,
                },
                orderMessage: payload.orderMessage,
                customerId: payload.customerId,
                name: payload.address.name,
                phone: payload.address.phone,
                address:
                    payload.address.streetAddress +
                    ", " +
                    payload.address.generalAddress,
                paymentMethod: payload.paymentMethod === "COD" ? "COD" : "ONLINE",
                shippingFee: payload.shippingFee,
                orderStatus: payload.paymentMethod === "COD" ? "PENDING" : "NOTPAID",
                addressType: payload.addressType,
            },
            include: {
                orderItems: {
                    select: {
                        product: {
                            select: {
                                id: true,
                                price: true,
                                stock: true,
                            },
                        },
                        quantity: true,
                    },
                },
            },
        });
        
        for (const item of order.orderItems) {
            if (item.product.stock < item.quantity) {
                await prisma.orderItem.deleteMany({
                    where: { orderId: order.id },
                });
                await prisma.order.delete({ where: { id: order.id } });

                return NextResponse.json(
                    {
                        url: `${store.frontendUrl}/checkout/result?outOfStock=1`,
                    },
                    { headers: corsHeaders }
                );
            }
        }

        await Promise.all(
            order.orderItems.map((item) =>
                prisma.product.update({
                    where: { id: item.product.id },
                    data: { stock: item.product.stock - item.quantity, isArchived: item.product.stock - item.quantity === 0 },
                })
            )
        );

        if (payload.paymentMethod === "COD") {
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

        const vnpay = await getVNPayModel(
            store.vnpay_tmn,
            store.vnpay_hashSecret
        );

        const url = vnpay.buildPaymentUrl({
            vnp_Amount: totalPrice,
            vnp_IpAddr: payload.clientIp,
            vnp_OrderInfo: `Order ${order.id}`,
            vnp_ReturnUrl: `${store.frontendUrl}/checkout/result`,
            vnp_TxnRef: order.id,
            vnp_BankCode:
                payload.paymentMethod === "VNPAYEWALLET"
                    ? "VNPAYEWALLET"
                    : undefined,
            vnp_Locale: VnpLocale.EN,
            vnp_CreateDate: dateFormat(new Date()),
        });

        return NextResponse.json({ url: url }, { headers: corsHeaders });
    } catch (error) {
        console.error("[POST /api/checkout]", error);
        return new NextResponse("Internal Server Error", { status: 500, headers: corsHeaders });
    }
}
