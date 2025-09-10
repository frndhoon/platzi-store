import { Outlet } from "react-router";
import { Toaster } from "sonner";

import { Header } from "@/components/shared/header";

const MainLayout = () => {
  return (
    <>
      <Header />
      <main className="mx-10">
        <Toaster position="top-center" />
        <Outlet />
      </main>
    </>
  );
};
export { MainLayout };
