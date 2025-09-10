import type { AxiosError } from "axios";

import { ERROR_MESSAGES } from "@/constants/error.constant";
import type { ErrorType } from "@/types/error.types";

// AxiosError를 ErrorType으로 분류
const getErrorType = (error: AxiosError): ErrorType => {
  // 네트워크 에러 체크
  if (error.code === "ERR_NAME_NOT_RESOLVED") {
    return "NETWORK_ERROR";
  }

  if (error.code === "ERR_NETWORK") {
    return "NETWORK_ERROR";
  }

  // 서버 응답이 없는 경우 (일반적인 네트워크 에러)
  if (!error.response) {
    return "NETWORK_ERROR";
  }

  // HTTP 상태 코드별 분류
  const status = error.response.status;

  if (status === 404) {
    return "NOT_FOUND";
  }

  if (status >= 500) {
    return "SERVER_ERROR";
  }

  if (status >= 400) {
    return "CLIENT_ERROR";
  }

  return "UNKNOWN_ERROR";
};

// AxiosError를 바로 사용자 메시지로 변환
const getErrorMessage = (error: AxiosError): string => {
  const errorType = getErrorType(error);
  return ERROR_MESSAGES[errorType];
};

export { getErrorMessage };
