import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

// 테마 토글 버튼
const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();

  const handleThemeToggle = () => {
    if (theme === "light") {
      setTheme("dark");
    } else {
      setTheme("light");
    }
  };

  const getIcon = () => {
    if (theme === "light") {
      return <Sun className="h-4 w-4" />;
    } else {
      return <Moon className="h-4 w-4" />;
    }
  };

  const getTooltipText = () => {
    if (theme === "light") {
      return "라이트 모드 (다크 모드로 전환)";
    } else {
      return "다크 모드 (라이트 모드로 전환)";
    }
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={handleThemeToggle}
      className="w-9 h-9"
      title={getTooltipText()}
    >
      {getIcon()}
    </Button>
  );
};

export { ThemeToggle };
