import { Navigate, Route, Routes } from "react-router";

import { MainLayout } from "@/components/layout/main-layout";
import ProductCreatePage from "@/pages/ProductCreatePage";
import ProductEditPage from "@/pages/ProductEditPage";
import ProductListPage from "@/pages/ProductListPage";

// 라우팅 기능 담당
// https://reactrouter.com/start/declarative/routing
// Nested Routes 예시 적용

const Router = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        {/* 최초 접속 시 product 페이지로 리다이렉션 */}
        <Route index element={<Navigate to="product" replace />} />

        <Route path="product">
          <Route index element={<ProductListPage />} />
          <Route path="create" element={<ProductCreatePage />} />
          <Route path=":id/edit" element={<ProductEditPage />} />
        </Route>
      </Route>
    </Routes>
  );
};

export { Router };
