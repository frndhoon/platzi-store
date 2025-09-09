import {
  type PostProductRequest,
  type GetProductListResponse,
  type PostProductResponse,
  type GetProductResponse
} from "@/types/product";

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

const postProduct = async (
  product: PostProductRequest
): Promise<PostProductResponse> => {
  const response = await axiosInstance.post("products", product);
  return response.data;
};

export { getProduct, postProduct, getProductList };
