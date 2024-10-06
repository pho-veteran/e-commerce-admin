import { Overview } from "@/components/overview";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Heading from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { prisma } from "@/lib/prismadb";
import { currencyFormatter } from "@/lib/utils";
import { CreditCard, DollarSign, Package } from "lucide-react";

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
        <div className="flex flex-col ">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <Heading
                    title="Dashboard"
                    description={`Welcome to your ${store?.name} store dashboard!`}
                />
                <Separator />
                <div className="grid gap-4 grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Revenue
                            </CardTitle>
                            <DollarSign className="h-4 m-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {currencyFormatter.format(865)}
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Sales
                            </CardTitle>
                            <CreditCard className="h-4 m-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{"+100"}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Product In Stock
                            </CardTitle>
                            <Package className="h-4 m-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{"4564"}</div>
                        </CardContent>
                    </Card>
                </div>
                <Card className="col-span-4 space-y-2">
                    <CardHeader>
                        <CardTitle>
                            Overview
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Overview data={[
                            // Mock data
                            { name: "Jan", total: 400 },
                            { name: "Feb", total: 300 },
                            { name: "Mar", total: 200 },
                            { name: "Apr", total: 278 },
                            { name: "May", total: 189 },
                            { name: "Jun", total: 239 },
                            { name: "Jul", total: 349 },
                            { name: "Aug", total: 278 },
                            { name: "Sep", total: 189 },
                            { name: "Oct", total: 239 },
                            { name: "Nov", total: 349 },
                            { name: "Dec", total: 278 },
                        ]} />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default DashboardPage;
