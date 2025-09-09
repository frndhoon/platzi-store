import { Outlet } from "react-router";

import { Header } from "../shared/header";

const MainLayout = () => {
  return (
    <main className="mx-auto max-w-7xl">
      <Header />
      <Outlet />
    </main>
  );
};
export { MainLayout };
