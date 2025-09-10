import {
  useMutation,
  type UseMutationResult,
  useQuery,
  useQueryClient,
  type UseQueryResult
} from "@tanstack/react-query";
import { type AxiosError } from "axios";
import { useNavigate } from "react-router";
import { toast } from "sonner";

import {
  deleteProduct,
  getProduct,
  getProductList,
  postProduct,
  putProduct
} from "@/api/product.api";
import {
  type DeleteProductResponse,
  type GetProductListResponse,
  type GetProductResponse,
  type PostProductRequest,
  type PostProductResponse,
  type PutProductRequest,
  type PutProductResponse
} from "@/types/product.types";

// Product 조회 useQuery hook
const useGetProduct = (
  id: number
): UseQueryResult<GetProductResponse, AxiosError> => {
  return useQuery({
    queryKey: ["product", id],
    queryFn: () => getProduct(id)
  });
};

// Products 조회 useQuery hook
const useGetProductList = (): UseQueryResult<
  GetProductListResponse,
  AxiosError
> => {
  return useQuery({
    queryKey: ["productList"],
    queryFn: getProductList
  });
};

// Product 생성 useMutation hook
const usePostProduct = (): UseMutationResult<
  PostProductResponse,
  AxiosError,
  PostProductRequest
> => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (product: PostProductRequest) => postProduct(product),
    onSuccess: () => {
      toast.success("상품이 성공적으로 등록되었습니다.");
      navigate("/product");
      queryClient.invalidateQueries({ queryKey: ["productList"] });
    },
    onError: () => {
      // 각 에러 코드에 대해 처리가 필요하지만, api 문서에 명시되어 있지 않아 일단 전체 에러 처리
      window.alert("상품 등록에 실패했습니다.");
    }
  });
};

// Product 삭제 useMutation hook
const useDeleteProduct = (): UseMutationResult<
  DeleteProductResponse,
  AxiosError,
  number
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteProduct(id),
    onSuccess: () => {
      toast.success("상품이 성공적으로 삭제되었습니다.");
      queryClient.invalidateQueries({ queryKey: ["productList"] }); // 상품 목록 쿼리키 갱신 -> 상품 목록 데이터 갱신
    },
    onError: () => {
      // 각 에러 코드에 대해 처리가 필요하지만, api 문서에 명시되어 있지 않아 일단 전체 에러 처리
      window.alert("상품 삭제에 실패했습니다.");
    }
  });
};

// Product 업데이트 useMutation hook
const usePutProduct = (): UseMutationResult<
  PutProductResponse,
  AxiosError,
  { id: number; product: PutProductRequest }
> => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, product }) => putProduct(id, product),
    onSuccess: ({ id }) => {
      toast.success("상품이 성공적으로 업데이트되었습니다.");
      queryClient.invalidateQueries({ queryKey: ["product", id] });
      queryClient.invalidateQueries({ queryKey: ["productList"] });
      navigate(`/product/${id}`);
    },
    // TODO: 현재 500 에러 발생
    // fake api 사용 중이기 때문에 서버에서 어떤 문제가 발생했는지 정확하게 파악이 어려움
    // 다른 쪽으로 어떻게 해야할지 생각해보기
    onError: () => {
      toast.error("상품 업데이트에 실패했습니다.");
    }
  });
};

export {
  useDeleteProduct,
  useGetProduct,
  useGetProductList,
  usePostProduct,
  usePutProduct
};
