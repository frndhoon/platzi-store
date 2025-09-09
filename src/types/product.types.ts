// 데이터를 받아올 때 default product type
type Product = {
  id: number;
  title: string;
  slug: string;
  price: number;
  description: string;
  category: {
    id: number;
    name: string;
    image: string;
    slug: string;
  };
  images: string[];
};

type GetProductResponse = Product;

// 여러 개의 product 데이터를 받아올 때 response type
type GetProductListResponse = Product[];

// 생성 시 request로 보내야할 product type
type PostProductRequest = {
  title: string;
  price: number;
  description: string;
  categoryId: number;
  images: string[];
};

// 생성 시 response로 받는 product type
type PostProductResponse = Product & {
  creationAt: string;
  updatedAt: string;
};

export {
  type GetProductListResponse,
  type GetProductResponse,
  type PostProductRequest,
  type PostProductResponse,
  type Product
};
