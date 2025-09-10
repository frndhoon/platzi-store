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
  id: number,
  options?: { skipRefetch?: boolean }
): UseQueryResult<GetProductResponse, AxiosError> => {
  const queryClient = useQueryClient();

  // usePutProduct에서 설정한 skipRefetch 플래그 확인
  const shouldSkipRefetch =
    options?.skipRefetch ||
    queryClient.getQueryData(["product", id, "skipRefetch"]);

  return useQuery({
    queryKey: ["product", id],
    queryFn: () => getProduct(id),
    enabled: !shouldSkipRefetch // skipRefetch가 true면 쿼리 비활성화
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
      // 진행 중인 쿼리들을 취소하여 업데이트가 실제 서버 데이터가 클라이언트 query 데이터에 덮어쓰이지 않도록 함
      await queryClient.cancelQueries({ queryKey: ["product", id] });
      await queryClient.cancelQueries({ queryKey: ["productList"] });

      // 현재 데이터를 백업 (롤백용)
      const previousProduct = queryClient.getQueryData<GetProductResponse>([
        "product",
        id
      ]);
      const previousProductList =
        queryClient.getQueryData<GetProductListResponse>(["productList"]);

      // 클라이언트 사이드에서 query 데이터 직접 업데이트
      if (previousProduct) {
        queryClient.setQueryData<GetProductResponse>(["product", id], {
          // 해당 query키를 가진 클라이언트에서의 서버 데이터 직접 업데이트
          ...previousProduct, // 이전 데이터 유지
          ...product, // 새 데이터 업데이트
          updatedAt: new Date().toISOString() // 현재 날짜로 업데이트
        });
      }

      // 상품 목록도 업데이트
      if (previousProductList) {
        const updatedProductList = previousProductList.map((item) => {
          if (item.id === id) {
            return { ...item, ...product, updatedAt: new Date().toISOString() };
          }
          return item;
        });
        queryClient.setQueryData<GetProductListResponse>(
          ["productList"], // 해당 query키를 가진 클라이언트에서의 서버 데이터 직접 업데이트
          updatedProductList
        );
      }

      // 업데이트 후 해당 쿼리의 재요청을 막기 위해 플래그 설정
      queryClient.setQueryData(["product", id, "skipRefetch"], true);

      // 롤백을 위해 이전 데이터 반환
      return { previousProduct, previousProductList };
    },
    // 클라이언트 사이드 처리이므로 에러가 발생할 가능성은 낮지만, 안전장치로 유지
    onError: (_error, { id }, context) => {
      if (context?.previousProduct) {
        queryClient.setQueryData(["product", id], context.previousProduct);
      }
      if (context?.previousProductList) {
        queryClient.setQueryData(["productList"], context.previousProductList);
      }
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
