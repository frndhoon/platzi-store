import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { type AxiosError } from "axios";

import { getCategoryList } from "@/api/category.api";
import { type GetCategoryListResponse } from "@/types/category.types";

// category list 조회 useQuery hook
const useGetCategoryList = (): UseQueryResult<
  GetCategoryListResponse,
  AxiosError
> => {
  return useQuery({
    queryKey: ["categoryList"],
    queryFn: getCategoryList
  });
};

export { useGetCategoryList };
