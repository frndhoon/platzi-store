// https://stackoverflow.com/questions/62217642/react-and-typescript-which-types-for-an-axios-response
// axios response type 정의
import type { AxiosResponse } from "axios";

import {
  type DeleteProductResponse,
  type GetProductListResponse,
  type GetProductResponse,
  type PostProductRequest,
  type PostProductResponse,
  type PutProductRequest,
  type PutProductResponse
} from "@/types/product.types";

import { axiosInstance } from "./instance";

// Product 조회 API 호출
const getProduct = async (id: number): Promise<GetProductResponse> => {
  const response: AxiosResponse<GetProductResponse> = await axiosInstance.get(
    `products/${id}`
  );
  return response.data;
};

// Product list 조회 API 호출
const getProductList = async (): Promise<GetProductListResponse> => {
  const response: AxiosResponse<GetProductListResponse> =
    await axiosInstance.get("products");
  return response.data;
};

// Product 생성 API 호출
const postProduct = async (
  product: PostProductRequest
): Promise<PostProductResponse> => {
  const response: AxiosResponse<PostProductResponse> = await axiosInstance.post(
    "products",
    product
  );
  return response.data;
};

// Product 삭제 API 호출
const deleteProduct = async (id: number): Promise<DeleteProductResponse> => {
  const response: AxiosResponse<DeleteProductResponse> =
    await axiosInstance.delete(`products/${id}`);
  return response.data;
};

// Product 수정 API 호출
const putProduct = async (
  id: number,
  product: PutProductRequest
): Promise<PutProductResponse> => {
  const response: AxiosResponse<PutProductResponse> = await axiosInstance.put(
    `products/${id}`,
    product
  );
  return response.data;
};

export { deleteProduct, getProduct, getProductList, postProduct, putProduct };
