import type { AxiosError } from "axios";
import { useNavigate } from "react-router";

import { Button } from "@/components/ui/button";
import { getActionTypeFromError, getErrorMessage } from "@/utils/error.utils";

type ErrorDisplayProps = {
  onRefetch: () => void;
  error: AxiosError;
};

// 에러 시 렌더링될 문구 및 적절한 액션 버튼
const ErrorDisplay = ({ onRefetch, error }: ErrorDisplayProps) => {
  const navigate = useNavigate();
  const errorMessage = getErrorMessage(error);
  const actionType = getActionTypeFromError(error);

  const handleAction = () => {
    if (actionType === "RETRY") {
      onRefetch();
    } else {
      navigate(-1);
    }
  };

  const buttonText = actionType === "RETRY" ? "Retry" : "Go Back";

  return (
    <div className="flex flex-col items-center justify-center gap-4 min-h-96 w-full">
      <p className="text-center text-gray-600 dark:text-gray-400 px-4">
        {errorMessage}
      </p>
      <Button onClick={handleAction}>{buttonText}</Button>
    </div>
  );
};

export { ErrorDisplay };
