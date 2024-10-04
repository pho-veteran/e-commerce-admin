import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import { prisma } from "@/lib/prismadb";

export async function PATCH (
    req: Request,
    { params }: { params: { storeId: string } }
) {
    try {
        const { userId }: { userId: string | null } = auth();
        const body = await req.json();

        const { name } = body;

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }
        if (!name) {
            return new NextResponse("Invalid Request", { status: 400 });
        }

        if (!params.storeId) {
            return new NextResponse("Invalid Request", { status: 400 });
        }

        const store = await prisma.store.updateMany({
            where: {
                id: params.storeId,
                userId,
            },
            data: {
                name,
            },
        });

        return NextResponse.json(store);
    } catch (error) {
        console.error("[PATCH /api/stores]", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export async function DELETE (
    req: Request,
    { params }: { params: { storeId: string } }
) {
    try {
        const { userId }: { userId: string | null } = auth();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if (!params.storeId) {
            return new NextResponse("Invalid Request", { status: 400 });
        }

        const store = await prisma.store.deleteMany({
            where: {
                id: params.storeId,
                userId,
            },
        });

        return NextResponse.json(store);
    } catch (error) {
        console.error("[DELETE /api/stores]", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
