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

        const { label, imageUrl } = body;

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if (!label || !imageUrl || !params.storeId) {
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

        const billboard = await prisma.billboard.create({
            data: {
                label,
                imageUrl,
                storeId: params.storeId,
            },
        });

        return NextResponse.json(billboard);
    } catch (error) {
        console.error("[POST /api/billboards]", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export async function GET(
    req: Request,
    { params }: { params: { storeId: string } }
) {
    try {
        if (!params.storeId) {
            return new NextResponse("Invalid Request", { status: 400 });
        }

        const billboard = await prisma.billboard.findMany({
            where: {
                storeId: params.storeId,
            },
        });

        return NextResponse.json(billboard);
    } catch (error) {
        console.error("[GET /api/billboards]", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
