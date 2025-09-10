import type { AxiosError } from "axios";

import { ERROR_MESSAGES } from "@/constants/error.constant";
import type { ActionType, ErrorType } from "@/types/error.types";

// AxiosError를 ErrorType으로 분류
const getErrorType = (error: AxiosError): ErrorType => {
  // 네트워크 에러 체크
  switch (error.code) {
    case "ERR_NAME_NOT_RESOLVED":
    case "ERR_NETWORK":
      return "NETWORK_ERROR";
    default:
      // 서버 응답이 없는 경우 (일반적인 네트워크 에러)
      if (!error.response) {
        return "NETWORK_ERROR";
      }
      break;
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

// ErrorType에 따른 적절한 액션 타입 반환
const getActionType = (errorType: ErrorType): ActionType => {
  switch (errorType) {
    case "NETWORK_ERROR":
    case "TIMEOUT_ERROR":
    case "SERVER_ERROR":
    case "UNKNOWN_ERROR":
      return "RETRY"; // 다시 시도
    case "NOT_FOUND":
    case "CLIENT_ERROR":
    default:
      return "NAVIGATE_BACK"; // 뒤로 가기
  }
};

// AxiosError를 직접 받는 오버로드
const getActionTypeFromError = (error: AxiosError): ActionType => {
  const errorType = getErrorType(error);
  return getActionType(errorType);
};

export { getActionType, getActionTypeFromError, getErrorMessage };
