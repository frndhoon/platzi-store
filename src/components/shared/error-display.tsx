import { Button } from "@/components/ui/button";

type ErrorDisplayProps = {
  onRefetch: () => void;
};

// 에러 시 렌더링될 문구 및 refetch 버튼
// refetch 버튼 클릭 시 데이터 다시 불러오기
const ErrorDisplay = ({ onRefetch }: ErrorDisplayProps) => {
  return (
    <div className="flex flex-col items-center justify-center gap-4 min-h-96 w-full">
      <p>정보를 불러오는데 실패했습니다. 다시 시도해주세요.</p>
      <Button onClick={onRefetch}>다시 시도</Button>
    </div>
  );
};

export { ErrorDisplay };
