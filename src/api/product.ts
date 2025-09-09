import {
  type CreatedProductRequest,
  type CreatedProductResponse
} from "@/types/product";

import { axiosInstance } from "./instance";

// TODO: 왜 CreatedProductResponse 와 undefined인지?
const createProduct = async (
  product: CreatedProductRequest
): Promise<CreatedProductResponse | void> => {
  try {
    const response = await axiosInstance({
      method: "POST",
      url: "products",
      data: product
    });
    return response.data;
  } catch (error) {
    // TODO: 에러 처리 필요 (window.alert)
    console.log(error);
  }
};

export { createProduct };
