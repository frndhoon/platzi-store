import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";

// 테마 토글 버튼
const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // 하이드레이션 문제 방지
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button variant="outline" size="icon" className="w-9 h-9">
        <Monitor className="h-4 w-4" />
      </Button>
    );
  }

  const handleThemeToggle = () => {
    if (theme === "light") {
      setTheme("dark");
    } else if (theme === "dark") {
      setTheme("system");
    } else {
      setTheme("light");
    }
  };

  const getIcon = () => {
    switch (theme) {
      case "light":
        return <Sun className="h-4 w-4" />;
      case "dark":
        return <Moon className="h-4 w-4" />;
      default:
        return <Monitor className="h-4 w-4" />;
    }
  };

  const getTooltipText = () => {
    switch (theme) {
      case "light":
        return "라이트 모드 (다크 모드로 전환)";
      case "dark":
        return "다크 모드 (시스템 모드로 전환)";
      default:
        return "시스템 모드 (라이트 모드로 전환)";
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
