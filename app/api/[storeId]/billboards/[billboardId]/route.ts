import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import { prisma } from "@/lib/prismadb";

export async function GET(
    req: Request,
    { params }: { params: { billboardId: string } }
) {
    try {
        if (!params.billboardId) {
            return new NextResponse("Invalid Request", { status: 400 });
        }

        const billboard = await prisma.billboard.findUnique({
            where: {
                id: params.billboardId,
            },
        });

        return NextResponse.json(billboard);
    } catch (error) {
        console.error("[GET /api/billboard]", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export async function PATCH(
    req: Request,
    { params }: { params: { storeId: string; billboardId: string } }
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

        const billboard = await prisma.billboard.updateMany({
            where: {
                id: params.billboardId,
            },
            data: {
                label,
                imageUrl,
            },
        });

        return NextResponse.json(billboard);
    } catch (error) {
        console.error("[PATCH /api/billboards]", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: { storeId: string; billboardId: string } }
) {
    try {
        const { userId }: { userId: string | null } = auth();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if (!params.storeId || !params.billboardId) {
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

        const billboard = await prisma.billboard.deleteMany({
            where: {
                id: params.billboardId,
            },
        });

        return NextResponse.json(billboard);
    } catch (error) {
        console.error("[DELETE /api/billboard]", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
