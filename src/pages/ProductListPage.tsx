import { ProductCard } from "@/components/product/product-card";
import { useProductList } from "@/hooks/useProducts";
import { type Product } from "@/types/product";

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
      {productList.map((product: Product) => (
        <ProductCard product={product} key={product.id} />
      ))}
    </div>
  );
};

export default ProductListPage;
