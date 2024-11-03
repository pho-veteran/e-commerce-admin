import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/prismadb";
import { SidebarTrigger } from "@/components/ui/sidebar";

export default async function SetupLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { userId }: { userId: string | null } = auth();

    if (!userId) {
        redirect("/sign-in");
    }

    const store = await prisma.store.findFirst({
        where: {
            userId,
        },
    });

    if (store) {
        redirect(`/${store.id}`);
    }

    return (
        <>
            {children}
        </>
    );
}
