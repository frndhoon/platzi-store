import { Skeleton } from "@/components/ui/skeleton";
import { type Product } from "@/types/product.types";

interface ProductInfoSectionProps {
  product?: Product;
  isLoading: boolean;
}

const ProductInfoSection = ({
  product,
  isLoading
}: ProductInfoSectionProps) => {
  return (
    <div className="flex flex-col gap-4">
      {/* 제목과 가격 */}
      <div className="flex flex-col gap-2">
        {isLoading ? (
          <>
            <Skeleton className="w-full h-8" />
            <Skeleton className="w-1/12 h-7" />
          </>
        ) : (
          <>
            <h1 className="text-2xl font-bold">{product?.title}</h1>
            <p className="text-xl font-semibold text-green-500">
              ${product?.price}
            </p>
          </>
        )}
      </div>

      {/* 설명 */}
      <div className="flex flex-col gap-2">
        {isLoading ? (
          <>
            <Skeleton className="w-32 h-7" />
            <Skeleton className="w-full h-4" />
            <Skeleton className="w-full h-4" />
            <Skeleton className="w-full h-4" />
          </>
        ) : (
          <>
            <h2 className="text-lg font-semibold">Description</h2>
            <p>{product?.description}</p>
          </>
        )}
      </div>
    </div>
  );
};

export { ProductInfoSection };
