import { Outlet } from "react-router";
import { Toaster } from "sonner";

import { Footer } from "@/components/shared/footer";
import { Header } from "@/components/shared/header";

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="mx-10 flex-1">
        <Toaster position="top-center" />
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
export { MainLayout };
