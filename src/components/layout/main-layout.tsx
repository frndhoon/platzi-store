import { Outlet } from "react-router";

import { Header } from "../shared/header";

const MainLayout = () => {
  return (
    <>
      <Header />
      <main className="mx-4">
        <Outlet />
      </main>
    </>
  );
};
export { MainLayout };
