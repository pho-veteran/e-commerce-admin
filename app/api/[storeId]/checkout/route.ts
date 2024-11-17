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
            return new NextResponse("Invalid Request", { status: 400 });
        }
        const store = await prisma.store.findFirst({
            where: {
                id: params.storeId,
            },
        });
        if (!store) {
            return new NextResponse("Store not found", { status: 404 });
        }

        const payload = await req.json();

        const order = await prisma.order.create({
            data: {
                storeId: params.storeId,
                orderItems: {
                    create: payload.orderItems,
                },
                orderMessage: payload.orderMessage,
                name: payload.address.name,
                phone: payload.address.phone,
                address:
                    payload.address.generalAddress +
                    ", " +
                    payload.address.streetAddress,
                paymentMethod: payload.paymentMethod === "COD" ? "COD" : "ONLINE",
                totalPrice: payload.totalPrice,
            },
        });

        if (payload.paymentMethod === "COD") {
            return NextResponse.json(
                {
                    url: `${store.frontendUrl}/checkout/result?cod=1&orderId=${order.id}&amount=${order.totalPrice}`,
                },
                { headers: corsHeaders }
            );
        }

        const vnpay = await getVNPayModel(
            store.vnpay_tmn,
            store.vnpay_hashSecret
        );

        const url = vnpay.buildPaymentUrl({
            vnp_Amount: payload.totalPrice,
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
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
