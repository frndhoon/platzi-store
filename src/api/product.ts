import {
  type PostProductRequest,
  type GetProductListResponse,
  type PostProductResponse
} from "@/types/product";

import { axiosInstance } from "./instance";

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

export { postProduct, getProductList };
