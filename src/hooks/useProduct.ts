import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { toast } from "sonner";

import {
  deleteProduct,
  getProduct,
  getProductList,
  postProduct
} from "@/api/product.api";
import { type PostProductRequest } from "@/types/product.types";

// Product 조회 useQuery hook
const useGetProduct = (id: number) => {
  return useQuery({
    queryKey: ["product", id],
    queryFn: () => getProduct(id)
  });
};

// Products 조회 useQuery hook
const useGetProductList = () => {
  return useQuery({
    queryKey: ["productList"],
    queryFn: getProductList
  });
};

// Product 생성 useMutation hook
const usePostProduct = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (product: PostProductRequest) => postProduct(product),
    onSuccess: () => {
      toast.success("상품이 성공적으로 등록되었습니다.");
      navigate("/product");
    }
  });
};

// Product 삭제 useMutation hook
const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteProduct(id),
    onSuccess: () => {
      toast.success("상품이 성공적으로 삭제되었습니다.");
      queryClient.invalidateQueries({ queryKey: ["productList"] }); // 상품 목록 쿼리키 갱신 -> 상품 목록 데이터 갱신
    }
  });
};

export { useDeleteProduct, useGetProduct, useGetProductList, usePostProduct };
