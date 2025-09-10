// 070/009 와 같은 건 각 70, 9로 만들기
// 999에서 아무숫자를 입력하면 1000이 되기(최댓값 1000)
const limitNumber = (
  input: string,
  min: number,
  max: number
): number | string => {
  // 문자열을 숫자로 변환 (앞의 0은 자동으로 제거됨)
  const num = parseInt(input.trim(), 10);

  // NaN인 경우 빈 문자열로 처리
  if (isNaN(num)) {
    return "";
  }

  if (num < min) {
    return min;
  }

  // max보다 크거나 같으면 max로 설정
  if (num >= max) {
    return max;
  }

  return num;
};

export { limitNumber };
