import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/prismadb";

export default async function DashboardLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: {
        storeId: string;
    };
}) {
    const { userId }: { userId: string | null } = auth();

    if (!userId) {
        redirect("/sign-in");
    }

    const store = await prisma.store.findFirst({
        where: {
            id: params.storeId,
            userId,
        },
    });

    if (!store) {
        redirect("/");
    }

    return (
        <>
            <p>This is navbarr</p>
            {children}
        </>
    );
}
