import { useQuery } from "@tanstack/react-query";

import { getProductList } from "@/api/product";

// Products 조회 useQuery hook
export const useProductList = () => {
  return useQuery({
    queryKey: ["productList"],
    queryFn: getProductList
  });
};
