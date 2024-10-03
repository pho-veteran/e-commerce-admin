import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import { prisma } from "@/lib/prismadb";
export async function POST(req: Request) {
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

        const store = await prisma.store.create({
            data: {
                name,
                userId,
            },
        });

        return NextResponse.json(store);
    } catch (error) {
        console.error("[POST /api/stores]", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
