import type { ErrorType } from "@/types/error.types";

// 에러 타입별 사용자 메시지 매핑
const ERROR_MESSAGES: Record<ErrorType, string> = {
  NETWORK_ERROR: "Network connection failed. Please try again later.",
  TIMEOUT_ERROR: "Request timed out. Please try again.",
  SERVER_ERROR: "Server is temporarily unavailable. Please try again later.",
  NOT_FOUND: "The requested information could not be found.",
  CLIENT_ERROR: "Invalid request. Please check your input.",
  UNKNOWN_ERROR: "Failed to load information. Please try again."
};

export { ERROR_MESSAGES };
