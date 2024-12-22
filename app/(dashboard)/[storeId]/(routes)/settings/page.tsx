import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/prismadb";

import SettingsForm from "./components/setting-form";

interface SettingPageProps {
    params: {
        storeId: string;
    };
}

const SettingPage: React.FC<SettingPageProps> = async ({ params }) => {
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
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-2">
                <SettingsForm
                    initialData={store}
                /> 
            </div>
        </div>
    );
};

export default SettingPage;
