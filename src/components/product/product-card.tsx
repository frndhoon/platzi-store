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
        {/* truncate: 줄 바꿈 없이 한 줄로 표시 */}
        <CardTitle className="truncate">
          {/* 상품명 */}
          {title}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-2">
        {/* 상품 이미지, 가격, 설명 */}
        <img src={thumbnail} alt={title} className="w-48 h-48 rounded-md" />

        <div className="space-y-2">
          <p>{price}$</p>
          {/* line-clamp-3: 3줄까지 표시하고,
           overflow-hidden: 넘치는 부분은 숨김 */}
          <p className="line-clamp-3 overflow-hidden">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export { ProductCard };
