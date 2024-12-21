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

        const { searchParams } = new URL(req.url);

        const orderId = searchParams.get("vnp_TxnRef");
        const responseCode = searchParams.get("vnp_ResponseCode");

        if (!orderId || !responseCode || responseCode !== "00") {
            return NextResponse.json({
                RspCode: '93', 
                Message: 'Invalid Request'
            }, {
                headers: corsHeaders,
            });
        }

        const order = await prisma.order.findFirst({
            where: {
                id: orderId,
                paymentMethod: "ONLINE",
                orderStatus: "NOTPAID"
            },
        });

        if (!order) {
            return NextResponse.json({
                RspCode: '99', 
                Message: 'Order Invalid'
            }, {
                headers: corsHeaders,
            });
        }

        await prisma.order.update({
            where: {
                id: orderId,
            },
            data: {
                orderStatus: "PENDING",
            },
        })

        return NextResponse.json({
            RspCode: '00', 
            Message: 'Success'
        }, {
            headers: corsHeaders,
        });
    } catch (error) {
        console.error("[GET /api/checkout/IPN]", error);
        return new NextResponse("Internal Server Error", {
            status: 500,
            headers: corsHeaders,
        });
    }
}
