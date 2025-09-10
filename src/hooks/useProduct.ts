import {
  useMutation,
  type UseMutationResult,
  useQuery,
  useQueryClient,
  type UseQueryResult
} from "@tanstack/react-query";
import { type AxiosError } from "axios";

import {
  deleteProduct,
  getProduct,
  getProductList,
  postProduct
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
  const queryClient = useQueryClient();

  // 캐시된 데이터가 있다면, 쿼리 비활성화
  const isCachedData = queryClient.getQueryData(["product", id, "skipRefetch"]);

  return useQuery({
    queryKey: ["product", id],
    queryFn: () => getProduct(id),
    enabled: !isCachedData, // skipRefetch가 true면 쿼리 비활성화
    gcTime: isCachedData ? Infinity : 0
  });
};

// Products 조회 useQuery hook
const useGetProductList = (): UseQueryResult<
  GetProductListResponse,
  AxiosError
> => {
  const queryClient = useQueryClient();

  // 캐시된 데이터가 있다면, 쿼리 비활성화
  const isCachedData = queryClient.getQueryData(["productList", "skipRefetch"]);

  return useQuery({
    queryKey: ["productList"],
    queryFn: getProductList,
    enabled: !isCachedData,
    gcTime: isCachedData ? Infinity : 0
  });
};

// Product 생성 useMutation hook
const usePostProduct = (): UseMutationResult<
  PostProductResponse,
  AxiosError,
  PostProductRequest
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (product: PostProductRequest) => postProduct(product),
    onSuccess: () => {
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
      queryClient.invalidateQueries({ queryKey: ["productList"] }); // 상품 목록 쿼리키 갱신 -> 상품 목록 데이터 갱신
    },
    onError: () => {
      // 각 에러 코드에 대해 처리가 필요하지만, api 문서에 명시되어 있지 않아 일단 전체 에러 처리
      window.alert("상품 삭제에 실패했습니다.");
    }
  });
};

// Product 업데이트 useMutation hook
// (서버 API 500 에러로 인해 서버 API 호출 없이 react-query로 기존 서버의 List, 단일 Product 데이터 상태 관리를 직접 수정(setQueryData))
const usePutProduct = (): UseMutationResult<
  PutProductResponse,
  AxiosError,
  { id: number; product: PutProductRequest }
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, product }) => {
      // 더미 응답 반환 (실제로는 서버 호출하지 않음)
      return { id, ...product } as PutProductResponse;
    },
    // 클라이언트 사이드에서 즉시 데이터 업데이트
    onMutate: async ({ id, product }) => {
      // 우선, 서버에서 최신 데이터 가져오기
      const latestProduct = await queryClient.fetchQuery({
        queryKey: ["product", id],
        queryFn: () => getProduct(id)
      });
      const latestProductList = await queryClient.fetchQuery({
        queryKey: ["productList"],
        queryFn: getProductList
      });

      // 가져온 데이터를 클라이언트에서 수정
      if (latestProduct) {
        const updatedProduct = {
          ...latestProduct, // 기존 모든 필드 유지
          ...product // 새로운 데이터로 수정된 필드만 업데이트(title, price)
        };
        console.log("업데이트된 상품 데이터:", updatedProduct);
        queryClient.setQueryData<GetProductResponse>(
          ["product", id],
          updatedProduct
        );
      }
      if (latestProductList) {
        const updatedProductList = latestProductList.map((item) => {
          if (item.id === id) {
            return { ...item, ...product };
          }
          return item;
        });
        queryClient.setQueryData<GetProductListResponse>(
          ["productList"],
          updatedProductList
        );
      }

      // 수정된 데이터가 캐시되었으므로 skipRefetch 플래그 설정
      if (latestProduct) {
        queryClient.setQueryData(["product", id, "skipRefetch"], true);
      }
      if (latestProductList) {
        queryClient.setQueryData(["productList", "skipRefetch"], true);
      }

      return { latestProduct, latestProductList };
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
