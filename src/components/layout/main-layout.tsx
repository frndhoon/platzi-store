import { Outlet } from "react-router";

const MainLayout = () => {
  return (
    <main className="mx-auto max-w-7xl">
      <Outlet />
    </main>
  );
};
export { MainLayout };
