import { Route, Routes } from "react-router";

import { HomePage } from "@/pages/home-page";
import { ProductCreatePage } from "@/pages/product-create-page";
import { ProductEditPage } from "@/pages/product-edit-page";
import { ProductListPage } from "@/pages/product-list-page";

// 라우팅 기능 담당
// https://reactrouter.com/start/declarative/routing
// Nested Routes 예시 적용

const Router = () => {
  return (
    <Routes>
      <Route index element={<HomePage />} />

      <Route path="product">
        <Route index element={<ProductListPage />} />
        <Route path="create" element={<ProductCreatePage />} />
        <Route path="edit" element={<ProductEditPage />} />
      </Route>
    </Routes>
  );
};

export { Router };
