import { Route, Routes } from "react-router";

import { HomePage } from "@/pages/home-page";

// 라우팅 기능 담당
const Router = () => {
  return (
    <Routes>
      <Route index element={<HomePage />} />
    </Routes>
  );
};

export { Router };
