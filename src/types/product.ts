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

// 생성 시 제출해야할 product type
type CreatedProductRequest = {
  title: string;
  price: number;
  description: string;
  categoryId: number;
  images: string[];
};

export { type CreatedProductRequest, type Product };
