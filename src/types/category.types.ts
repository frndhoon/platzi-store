// default category schema
type Category = {
  id: number;
  name: string;
  image: string;
  slug: string;
};

// category list 데이터를 받아올 때 response type
type GetCategoryListResponse = Category[];

export { type Category, type GetCategoryListResponse };
