// 070/009 와 같은 건 각 70, 9로 만들기
// 999에서 아무숫자를 입력하면 1000이 되기(최댓값 1000)
const parseAndLimitNumbers = (input: string): (number | string)[] => {
  // "/"로 분리하여 각 부분을 처리
  const parts = input.split("/");

  return parts.map((part) => {
    // 문자열을 숫자로 변환 (앞의 0은 자동으로 제거됨)
    const num = parseInt(part.trim(), 10);

    // NaN인 경우 빈 문자열로 처리
    if (isNaN(num)) {
      return "";
    }

    // 999보다 크거나 같으면 1000으로 설정
    if (num >= 999) {
      return 1000;
    }

    return num;
  });
};

export { parseAndLimitNumbers };
