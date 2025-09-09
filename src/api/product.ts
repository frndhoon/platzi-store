import {
  type CreatedProductRequest,
  type CreatedProductResponse,
  type GetProductListResponse
} from "@/types/product";

import { axiosInstance } from "./instance";

// Products 조회 api 호출
const getProductList = async (): Promise<GetProductListResponse> => {
  const response = await axiosInstance.get("products");
  return response.data;
};

const createProduct = async (
  product: CreatedProductRequest
): Promise<CreatedProductResponse | void> => {
  try {
    const response = await axiosInstance.post("products", product);
    return response.data;
  } catch (error) {
    // TODO: 에러 처리 필요 (window.alert)
    console.log(error);
  }
};

export { createProduct, getProductList };
