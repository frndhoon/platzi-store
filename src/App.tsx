import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router";

import { Router } from "@/routes/router";

// 모든 쿼리 캐시 공유를 위해 tanstack query 전역 설정 필요
const queryClient = new QueryClient();

// App 전역 설정
const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Router />
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export { App };
