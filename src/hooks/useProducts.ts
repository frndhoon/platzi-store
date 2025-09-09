import { useMutation, useQuery } from "@tanstack/react-query";

import { postProduct, getProductList } from "@/api/product";

import { type PostProductRequest } from "@/types/product";
import { toast } from "sonner";
import { useNavigate } from "react-router";

const navigate = useNavigate();

// Products 조회 useQuery hook
const useProductList = () => {
  return useQuery({
    queryKey: ["productList"],
    queryFn: getProductList
  });
};

// Product 생성 useMutation hook
const usePostProduct = () => {
  return useMutation({
    mutationFn: (product: PostProductRequest) => postProduct(product),
    onSuccess: () => {
      toast.success("상품이 성공적으로 등록되었습니다.");
      navigate("/product");
    }
  });
};

export { usePostProduct, useProductList };
