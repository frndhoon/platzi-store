import { Outlet } from "react-router";

import { Header } from "../shared/header";
import { Toaster } from "sonner";

const MainLayout = () => {
  return (
    <>
      <Header />
      <main className="mx-4">
        <Toaster position="top-center" />
        <Outlet />
      </main>
    </>
  );
};
export { MainLayout };
