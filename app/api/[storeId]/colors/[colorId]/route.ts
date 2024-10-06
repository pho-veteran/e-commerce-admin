import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import { prisma } from "@/lib/prismadb";

export async function GET(
    req: Request,
    { params }: { params: { colorId: string } }
) {
    try {
        if (!params.colorId) {
            return new NextResponse("Invalid Request", { status: 400 });
        }

        const color = await prisma.color.findUnique({
            where: {
                id: params.colorId,
            },
        });

        return NextResponse.json(color);
    } catch (error) {
        console.error("[GET /api/colors]", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export async function PATCH(
    req: Request,
    { params }: { params: { storeId: string; colorId: string } }
) {
    try {
        const { userId }: { userId: string | null } = auth();
        const body = await req.json();

        const { name, value } = body;

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if (!name || !value || !params.storeId || !params.colorId) {
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

        const color = await prisma.color.updateMany({
            where: {
                id: params.colorId,
            },
            data: {
                name,
                value
            },
        });

        return NextResponse.json(color);
    } catch (error) {
        console.error("[PATCH /api/colors]", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: { storeId: string; colorId: string } }
) {
    try {
        const { userId }: { userId: string | null } = auth();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if (!params.storeId || !params.colorId) {
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

        const color = await prisma.color.deleteMany({
            where: {
                id: params.colorId,
            },
        });

        return NextResponse.json(color);
    } catch (error) {
        console.error("[DELETE /api/colors]", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
