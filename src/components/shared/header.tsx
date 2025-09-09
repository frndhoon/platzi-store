import { Link } from "react-router";

import { Button } from "../ui/button";

const Header = () => {
  return (
    <header className="m-3 flex items-center justify-between">
      <Link to="product" className="cursor-pointer">
        <img src="/icon.svg" alt="logo" className="w-10 h-10" />
      </Link>
      <Link to="product/create">
        <Button>상품 추가</Button>
      </Link>
    </header>
  );
};
export { Header };
