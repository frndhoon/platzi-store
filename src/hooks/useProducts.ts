import { useMutation, useQuery } from "@tanstack/react-query";

import { postProduct, getProductList } from "@/api/product";

import { type PostProductRequest } from "@/types/product";

// Products 조회 useQuery hook
const useProductList = () => {
  return useQuery({
    queryKey: ["productList"],
    queryFn: getProductList
  });
};

const usePostProduct = () => {
  return useMutation({
    mutationFn: (product: PostProductRequest) => postProduct(product)
  });
};

export { usePostProduct, useProductList };
