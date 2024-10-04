import { UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { MainNav } from "@/components/main-nav";
import StoreSwitcher from "@/components/store-switcher";
import { prisma } from "@/lib/prismadb";

const Navbar = async () => {
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
        <div className="border-b">
            <div className="flex h-16 items-center px-4">
                <StoreSwitcher
                    items={stores}
                />
                <MainNav className="mx-6" />
                <div className="ml-auto flex items-center space-x-4">
                    <UserButton />
                </div>
            </div>
        </div>
    );
};

export default Navbar;
