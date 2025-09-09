import { ProductCard } from "@/components/product/product-card";
import { useProductList } from "@/hooks/useProducts";
import { type Product } from "@/types/product";
import { Skeleton } from "@/components/ui/skeleton";

const ProductListPage = () => {
  const { data: productList, isLoading, error } = useProductList();

  // TODO: 로딩, refetch, 상품 없음 컴포넌트 추가
  if (isLoading) {
    return <p>상품을 불러오는 중...</p>;
  }

  // 아직 데이터가 없거나 에러가 발생한 경우
  if (!productList || error) {
    return <p>상품을 불러오는데 실패했습니다. 다시 시도해주세요.</p>;
  }

  // 성공적으로 데이터를 받았지만 상품이 없는 경우만
  if (productList && productList.length === 0) {
    return <p>등록된 상품이 없습니다.</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-5 gap-3 justify-items-center">
      {/* 로딩 중일 때 */}
      {isLoading &&
        // 10개의 스켈레톤 카드 출력 (한 페이지에 꽉 채울 수 있는 개수)
        // TODO: 384px 카드 높이가 고정돼있긴 하나, 더 좋은 방법이 없을까?
        // 왜냐하면, 카드의 높이는 카드 내부 컴포넌트의 내용에 따라 달라지기 때문에, 수정하면 또 직접 보고 수정해야함
        // 카드 높이를 동적으로 조절하는 방법이 있을까?
        Array.from({ length: 10 }).map((_, index) => (
          <Skeleton
            className="w-full h-[384px] rounded-xl border shadow-sm"
            key={index}
          />
        ))}

      {/* 로딩 완료 후 */}
      {!isLoading &&
        productList?.map((product: Product) => (
        <ProductCard product={product} key={product.id} />
      ))}
    </div>
  );
};

export default ProductListPage;
