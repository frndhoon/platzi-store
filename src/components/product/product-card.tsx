import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type Product } from "@/types/product";

// https://fakeapi.platzi.com/en/rest/products/#get-a-single-product-by-id
type ProductCardProps = {
  product: Product;
};

// 상품 단일 출력 카드
const ProductCard = ({ product }: ProductCardProps) => {
  const { title, images, price, description } = product;
  const thumbnail = images[0];

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {/* 상품명 */}
          상품명: {title}
        </CardTitle>
      </CardHeader>

      <CardContent>
        {/* 상품 이미지, 가격, 설명 */}

        <img src={thumbnail} alt="image" />

        <p className="mt-2" />
        <div className="flex flex-col">
          <p>가격: {price}</p>
          <p>설명: {description}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export { ProductCard };
