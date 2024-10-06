import { prisma } from "@/lib/prismadb";
import { ObjectId } from "mongodb";
import CategoryForm from "./components/category-form";

const CategoryPage = async ({
    params,
}: {
    params: {
        storeId: string;
        categoryId: string;
    };
}) => {
    const category = !ObjectId.isValid(params.categoryId)
        ? null
        : await prisma.category.findUnique({
              where: {
                  id: params.categoryId,
              },
          });
    
    const billboards = await prisma.billboard.findMany({
        where: {
            storeId: params.storeId,
        },
        orderBy: {
            createdAt: "desc",
        }
    });

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <CategoryForm 
                    billboards={billboards}
                    initialData={category} 
                />
            </div>
        </div>
    );
};

export default CategoryPage;
