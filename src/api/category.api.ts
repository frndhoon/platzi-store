import type { AxiosResponse } from "axios";

import { type GetCategoryListResponse } from "@/types/category.types";

import { axiosInstance } from "./instance";

// category list 조회 api
const getCategoryList = async (): Promise<GetCategoryListResponse> => {
  const response: AxiosResponse<GetCategoryListResponse> =
    await axiosInstance.get("categories");
  return response.data;
};

export { getCategoryList };
