export type ErrorType =
  | "NETWORK_ERROR"
  | "TIMEOUT_ERROR"
  | "SERVER_ERROR"
  | "NOT_FOUND"
  | "CLIENT_ERROR"
  | "UNKNOWN_ERROR";

export type ActionType =
  | "RETRY" // 다시 시도
  | "NAVIGATE_BACK"; // 뒤로 가기
