import type { AxiosError } from "axios";

import type { ErrorType } from "@/types/error.types";

// 에러 타입별 사용자 메시지 매핑
const ERROR_MESSAGES: Record<ErrorType, string> = {
  NETWORK_ERROR:
    "네트워크 연결에 문제가 발생했습니다. 잠시 후 다시 시도해주세요.",
  TIMEOUT_ERROR: "요청 시간이 초과되었습니다. 다시 시도해주세요.",
  SERVER_ERROR:
    "서버에 일시적인 문제가 발생했습니다. 잠시 후 다시 시도해주세요.",
  NOT_FOUND: "요청하신 정보를 찾을 수 없습니다.",
  CLIENT_ERROR: "잘못된 요청입니다. 입력 내용을 확인해주세요.",
  UNKNOWN_ERROR: "정보를 불러오는데 실패했습니다. 다시 시도해주세요."
};

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
