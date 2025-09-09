// 데이터 없을 시 렌더링될 문구
const EmptyDisplay = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-4 min-h-96 w-full">
      <p>등록된 정보가 없습니다.</p>
    </div>
  );
};

export { EmptyDisplay };
