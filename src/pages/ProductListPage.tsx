import { ProductCard } from "@/components/product/product-card";
import { EmptyDisplay } from "@/components/shared/empty-display";
import { ErrorDisplay } from "@/components/shared/error-display";
import { Skeleton } from "@/components/ui/skeleton";
import { useProductList } from "@/hooks/useProducts";
import { type Product } from "@/types/product";

const ProductListPage = () => {
  const { data: productList, isLoading, error, refetch } = useProductList();

  // 에러 발생 시
  if (error) {
    return <ErrorDisplay onRefetch={refetch} />;
  }

  // 로딩 중일 때
  // 10개의 스켈레톤 카드 출력 (한 페이지에 꽉 채울 수 있는 개수)
  // TODO: 384px 카드 높이가 고정돼있긴 하나, 더 좋은 방법이 없을까?
  // 왜냐하면, 카드의 높이는 카드 내부 컴포넌트의 내용에 따라 달라지기 때문에, 수정하면 또 직접 보고 수정해야함
  // 카드 높이를 동적으로 조절하는 방법이 있을까?
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-5 gap-3 justify-items-center">
        {Array.from({ length: 10 }).map((_, index) => (
          <Skeleton
            className="w-full h-[384px] rounded-xl border shadow-sm"
            key={index}
          />
        ))}
      </div>
    );
  }

  // 상품이 없는 경우
  if (!productList || productList.length === 0) {
    return <EmptyDisplay />;
  }

  // 상품 목록 표시
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-5 gap-3 justify-items-center">
      {productList.map((product: Product) => (
        <ProductCard product={product} key={product.id} />
      ))}
    </div>
  );
};

export default ProductListPage;
