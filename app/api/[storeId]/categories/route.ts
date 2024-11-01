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

        const { name, billboardId } = body;

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if (!name || !billboardId || !params.storeId) {
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

        const category = await prisma.category.create({
            data: {
                name,
                billboardId,
                storeId: params.storeId,
            },
        });

        return NextResponse.json(category);
    } catch (error) {
        console.error("[POST /api/categories]", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export async function GET(
    req: Request,
    { params }: { params: { storeId: string } }
) {
    try {
        const { searchParams } = new URL(req.url);
        const name = searchParams.get("name") || undefined;

        if (!params.storeId) {
            return new NextResponse("Invalid Request", { status: 400 });
        }

        const categories = await prisma.category.findMany({
            where: {
                storeId: params.storeId,
                name: {
                    contains: name,
                    mode: "insensitive",
                },
            },
            include: {
                billboard: true,
            },
        });

        return NextResponse.json(categories);
    } catch (error) {
        console.error("[GET /api/categories]", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
