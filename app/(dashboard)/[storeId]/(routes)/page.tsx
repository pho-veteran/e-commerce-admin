import getGraphRevenue from "@/actions/get-graph-revenue";
import { Overview } from "@/components/overview";
import { OverviewLoader } from "@/components/overview-loader";
import StatsSection from "@/components/stats-section";
import { StatsSectionLoader } from "@/components/stats-section-loader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Heading from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { prisma } from "@/lib/prismadb";
import { SquareChartGantt } from "lucide-react";
import { redirect } from "next/navigation";
import { Suspense } from "react";

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

    if (!store) {
        redirect("/");
    }

    const graphData = await getGraphRevenue(storeId);

    return (
        <>
            <div className="flex-1 space-y-4 p-8 pt-2">
                <Heading
                    title="Dashboard"
                    description={`Welcome to your ${store?.name} store dashboard!`}
                />
                <Separator />
                <Suspense fallback={<StatsSectionLoader />}>
                    <StatsSection storeId={storeId} />
                </Suspense>
                <Suspense fallback={<OverviewLoader />}>
                    <Card className="h-[450px] flex flex-col justify-between">
                        <CardHeader className="flex items-center gap-x-2 flex-row space-y-0">
                            <SquareChartGantt className="h-6 text-muted-foreground shrink-0" />
                            <CardTitle className="text-base font-bold">
                                Overview
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Overview
                                data={graphData}
                            />
                        </CardContent>
                    </Card>
                </Suspense>
            </div>
        </>
    );
};

export default DashboardPage;
