"use client";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ChartColumnStacked, Home, Images, Package, Palette, ScanEye, Settings, ShoppingCart } from "lucide-react";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "./ui/sidebar";

export function MainNav({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) {
    const pathName = usePathname();
    const params = useParams();

    const routes = [
        {
            href: `/${params.storeId}`,
            label: "Overview",
            active: pathName === `/${params.storeId}`,
            icon: Home,
        },
        {
            href: `/${params.storeId}/billboards`,
            label: "Billboards",
            active: pathName === `/${params.storeId}/billboards`,
            icon: Images,
        },
        {
            href: `/${params.storeId}/categories`,
            label: "Categories",
            active: pathName === `/${params.storeId}/categories`,
            icon: ChartColumnStacked,
        },
        {
            href: `/${params.storeId}/sizes`,
            label: "Sizes",
            active: pathName === `/${params.storeId}/sizes`,
            icon: ScanEye,
        },
        {
            href: `/${params.storeId}/colors`,
            label: "Colors",
            active: pathName === `/${params.storeId}/colors`,
            icon: Palette,
        },
        {
            href: `/${params.storeId}/products`,
            label: "Products",
            active: pathName === `/${params.storeId}/products`,
            icon: Package,
        },
        {
            href: `/${params.storeId}/orders`,
            label: "Orders",
            active: pathName === `/${params.storeId}/orders`,
            icon: ShoppingCart,
        },
        {
            href: `/${params.storeId}/settings`,
            label: "Settings",
            active: pathName === `/${params.storeId}/settings`,
            icon: Settings,
        },
    ];
    return (
        <nav
            className={cn(
                "flex items-center space-x-4 lg:space-x-6",
                className
            )}
            {...props}
        >
            <SidebarMenu>
                {routes.map((route) => (
                    <SidebarMenuItem key={route.label}>
                        <SidebarMenuButton asChild>
                            <Link
                                key={route.href}
                                href={route.href}
                                className={cn(
                                    "text-md font-medium transition-colors hover:text-primary",
                                    route.active
                                        ? "text-black dark:text-white font-semibold"
                                        : "text-gray-500"
                                )}
                            >
                                <route.icon />
                                {route.label}
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </nav>
    );
}
