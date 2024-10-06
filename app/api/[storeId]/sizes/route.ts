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

        const { name, value } = body;

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if (!name || !value || !params.storeId) {
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

        const size = await prisma.size.create({
            data: {
                name,
                value,
                storeId: params.storeId,
            },
        });

        return NextResponse.json(size);
    } catch (error) {
        console.error("[POST /api/sizes]", error);
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

        const size = await prisma.size.findMany({
            where: {
                storeId: params.storeId,
            },
        });

        return NextResponse.json(size);
    } catch (error) {
        console.error("[GET /api/sizes]", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
