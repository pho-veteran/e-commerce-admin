import { CreditCard, DollarSign, Package } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { currencyFormatter } from "@/lib/utils";
import getTotalRevenue from "@/actions/get-total-revenue";
import getSalesCount from "@/actions/get-sales-count";
import getProductsStock from "@/actions/get-products-stock";

interface StatsSectionProps {
    storeId: string;
}

const StatsSection: React.FC<StatsSectionProps> = async ({
    storeId,
}) => {    
    const totalRevenue = await getTotalRevenue(storeId);
    const salesCount = await getSalesCount(storeId);
    const productsInStock = await getProductsStock(storeId);

    return (
        <div className="grid gap-4 sm:grid-cols-3 grid-cols-1">
            <Card className="flex flex-col justify-between">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Total Revenue
                    </CardTitle>
                    <DollarSign className="h-6 m-4 text-muted-foreground shrink-0" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">
                        {currencyFormatter.format(totalRevenue)}
                    </div>
                </CardContent>
            </Card>
            <Card className="flex flex-col justify-between">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Sales
                    </CardTitle>
                    <CreditCard className="h-6 m-4 text-muted-foreground shrink-0" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{`+${salesCount}`}</div>
                </CardContent>
            </Card>
            <Card className="flex flex-col justify-between">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Product In Stock
                    </CardTitle>
                    <Package className="h-6 m-4 text-muted-foreground shrink-0" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{productsInStock}</div>
                </CardContent>
            </Card>
        </div>
    );
}

export default StatsSection;