import { prisma } from "@/lib/prismadb";

interface DashboardPageProps {
    params: {
        storeId: string;
    };
}

const DashboardPage: React.FC<DashboardPageProps> = async ({ params }) => {
    const { storeId } = params;
    const store = await prisma.store.findFirst({
        where: {
            id: storeId,
        },
    });
    return (
        <div>
            <h1>{store?.name}</h1>
        </div>
    );
};

export default DashboardPage;
