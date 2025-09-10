import { Outlet } from "react-router";

const ListLayout = () => {
  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-2xl font-bold">Product List</h1>
      <p className="text-sm text-gray-600 dark:text-gray-400">
        You can manage your products here.
      </p>
      <Outlet />
    </div>
  );
};

export { ListLayout };
