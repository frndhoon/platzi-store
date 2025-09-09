import { ProductCard } from "@/components/product/product-card";
import productList from "@/mocks/get-products.json";

const ProductListPage = () => {
  return (
    // TODO: grid -> flex로 변경
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 place-items-center">
      {productList.map((product) => (
        <ProductCard product={product} key={product.id} />
      ))}
    </div>
  );
};

export default ProductListPage;
