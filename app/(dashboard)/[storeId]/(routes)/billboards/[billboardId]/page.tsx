import { prisma } from "@/lib/prismadb";
import { ObjectId } from "mongodb";
import BillboardForm from "./components/billboard-form";

const BillboardPage = async ({
    params,
}: {
    params: {
        storeId: string;
        billboardId: string;
    };
}) => {
    const billboard = !ObjectId.isValid(params.billboardId)
        ? null
        : await prisma.billboard.findUnique({
              where: {
                  id: params.billboardId,
              },
          });

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <BillboardForm initialData={billboard} />
            </div>
        </div>
    );
};

export default BillboardPage;
