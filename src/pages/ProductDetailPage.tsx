import { useNavigate, useParams } from "react-router";

import { BorderLine } from "@/components/shared/border-line";
import { DeleteButton } from "@/components/shared/delete-button";
import { ErrorDisplay } from "@/components/shared/error-display";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from "@/components/ui/carousel";
import { Skeleton } from "@/components/ui/skeleton";
import { useDeleteProduct, useGetProduct } from "@/hooks/useProduct";

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const productId = Number(id);

  const { data: product, isLoading, error, refetch } = useGetProduct(productId);
  const { mutate: deleteProduct } = useDeleteProduct();

  const handleDelete = (): void => {
    deleteProduct(productId);
    navigate("/product");
  };

  // 에러 발생 시
  if (error) {
    return <ErrorDisplay onRefetch={refetch} error={error} />;
  }

  // 상품 데이터가 없을 때
  if (!product && !isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="text-center py-8">
          <p className="text-lg text-gray-500">상품을 찾을 수 없습니다.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex flex-col gap-6">
        {/* 상품 이미지들 */}
        {isLoading ? (
          <div className="w-full">
            <Skeleton className="w-full min-h-[50vh] max-h-[50vh] rounded-lg" />
          </div>
        ) : (
          <Carousel>
            <CarouselContent className="min-h-[50vh] max-h-[50vh]">
              {product?.images.map((image, index) => (
                <CarouselItem key={index}>
                  <img
                    src={image}
                    alt={product.title}
                    className="w-full h-full object-cover rounded-lg cursor-pointer"
                  />
                </CarouselItem>
              ))}
            </CarouselContent>

            <CarouselPrevious className="hidden sm:flex" />
            <CarouselNext className="hidden lg:flex" />
          </Carousel>
        )}

        <BorderLine />

        {/* 상품 정보 */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            {isLoading ? (
              <>
                <Skeleton className="w-full h-8" />
                <Skeleton className="w-1/12 h-7" />
              </>
            ) : (
              <>
                <h1 className="text-2xl font-bold">{product?.title}</h1>
                <p className="text-xl font-semibold">${product?.price}</p>
              </>
            )}
          </div>

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

          <BorderLine />

          <div className="flex flex-row gap-2">
            <DeleteButton
              onDelete={handleDelete}
              target="product"
              disabled={isLoading}
              className="flex-1"
            />
            <Button
              onClick={() => navigate(`/product/${productId}/edit`)}
              className="flex-1"
            >
              Edit
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
