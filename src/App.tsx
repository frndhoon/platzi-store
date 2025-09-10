import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { BrowserRouter } from "react-router";

import { ThemeProvider } from "@/components/shared/theme-provider";
import { Router } from "@/routes/router";

// 모든 쿼리 캐시 공유를 위해 tanstack query 전역 설정 필요
const queryClient = new QueryClient();

// App 전역 설정
const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <BrowserRouter>
          <Router />
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export { App };
