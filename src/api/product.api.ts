import {
  type GetProductListResponse,
  type GetProductResponse,
  type PostProductRequest,
  type PostProductResponse
} from "@/types/product.types";

import { axiosInstance } from "./instance";

// Product 조회 API 호출
const getProduct = async (id: number): Promise<GetProductResponse> => {
  const response = await axiosInstance.get(`products/${id}`);
  return response.data;
};

// Product list 조회 API 호출
const getProductList = async (): Promise<GetProductListResponse> => {
  const response = await axiosInstance.get("products");
  return response.data;
};

// Product 생성 API 호출
const postProduct = async (
  product: PostProductRequest
): Promise<PostProductResponse> => {
  const response = await axiosInstance.post("products", product);
  return response.data;
};

// Product 삭제 API 호출
const deleteProduct = async (id: number): Promise<void> => {
  await axiosInstance.delete(`products/${id}`);
};

export { deleteProduct, getProduct, getProductList, postProduct };
