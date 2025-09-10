import type { AxiosError } from "axios";

import { Button } from "@/components/ui/button";
import { getErrorMessage } from "@/utils/error.utils";

type ErrorDisplayProps = {
  onRefetch: () => void;
  error: AxiosError;
};

// 에러 시 렌더링될 문구 및 refetch 버튼
const ErrorDisplay = ({ onRefetch, error }: ErrorDisplayProps) => {
  const errorMessage = getErrorMessage(error);

  return (
    <div className="flex flex-col items-center justify-center gap-4 min-h-96 w-full">
      <p className="text-center text-gray-600 dark:text-gray-400 px-4">
        {errorMessage}
      </p>
      <Button onClick={onRefetch}>다시 시도</Button>
    </div>
  );
};

export { ErrorDisplay };
