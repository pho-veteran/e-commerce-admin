import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prismadb";

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarInput,
} from "@/components/ui/sidebar"
import StoreSwitcher from "./store-switcher";
import { MainNav } from "./main-nav";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import Logo from "./ui/logo";

export async function AppSidebar() {
    const { userId }: { userId: string | null } = auth();

    if (!userId) {
        redirect("/sign-in");
    }

    const stores = await prisma.store.findMany({
        where: {
            userId,
        },
    });

    return (
        <Sidebar variant="inset">
            <SidebarContent className="h-full">
                <SidebarHeader>
                    <div className="mt-4 px-2">
                        <Logo />                      
                        <span className="text-xs text-sidebar-foreground/70 block pb-3">Store Switcher</span>
                        <StoreSwitcher
                            items={stores}
                        />
                        <hr className="mt-6" />
                    </div>
                </SidebarHeader>
                <SidebarGroup className="px-2">
                    <SidebarGroupLabel>Navigation</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <MainNav />
                    </SidebarGroupContent>
                </SidebarGroup>
                <SidebarFooter>
                    <div className="p-1 hidden">
                        <Card className="shadow-none">
                            <form>
                                <CardHeader className="p-4 pb-0">
                                    <CardTitle className="text-sm">
                                        Subscribe to our newsletter
                                    </CardTitle>
                                    <CardDescription>
                                        Opt-in to receive updates and news about VShop Ecommerce Platform
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="grid gap-2.5 p-4">
                                    <SidebarInput type="email" placeholder="Email" />
                                    <Button
                                        className="w-full bg-sidebar-primary text-sidebar-primary-foreground shadow-none"
                                        size="sm"
                                    >
                                        Subscribe
                                    </Button>
                                </CardContent>
                            </form>
                        </Card>
                    </div>
                </SidebarFooter>
            </SidebarContent>
        </Sidebar>
    )
}
