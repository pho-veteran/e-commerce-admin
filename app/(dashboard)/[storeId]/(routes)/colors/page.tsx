import { format } from "date-fns";

import { prisma } from "@/lib/prismadb";

import { ColorClient } from "./components/client";
import { ColorColumn } from "./components/columns";

const ColorsPage = async ({
    params,
}: {
    params: {
        storeId: string;
    };
}) => {
    const colors = await prisma.color.findMany({
        where: {
            storeId: params.storeId,
        },
        orderBy: {
            createdAt: "desc",
        }
    });

    const formattedColors : ColorColumn[] = colors.map((size) => {
        return {
            id: size.id,
            name: size.name,
            value: size.value,
            createdAt: format(size.createdAt, "MMMM do, yyyy"),
        };
    });

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-2">
                <ColorClient data={formattedColors}/>
            </div>
        </div>
    );
};

export default ColorsPage;
