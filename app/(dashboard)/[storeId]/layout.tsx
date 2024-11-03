import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { ObjectId } from "mongodb";

import { prisma } from "@/lib/prismadb";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import NavBreadcrumb from "@/components/nav-breadcrumb";

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

    const store = !ObjectId.isValid(params.storeId)
        ? null
        : await prisma.store.findFirst({
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
            <SidebarProvider>
                <AppSidebar />
                <SidebarInset>
                    <main className="w-full">
                        <NavBreadcrumb />
                        {children}
                    </main>
                </SidebarInset>
            </SidebarProvider>
        </>
    );
}
