import { BrowserRouter } from "react-router";

import { Router } from "@/routes/router";

// App 전역 설정
const App = () => {
  return (
    <BrowserRouter>
      <Router />
    </BrowserRouter>
  );
};

export { App };
