import { Link } from "react-router";

import { ThemeToggle } from "@/components/shared/theme-toggle";
import { Button } from "@/components/ui/button";

// navbar 및 테마 변경
const Header = () => {
  return (
    <header className="m-4 flex items-center justify-between">
      <Link to="product" className="cursor-pointer hover:scale-105">
        <img src="/icon.svg" alt="logo" className="w-10 h-10" />
      </Link>
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <Link to="product/create">
          <Button>상품 추가</Button>
        </Link>
      </div>
    </header>
  );
};
export { Header };
