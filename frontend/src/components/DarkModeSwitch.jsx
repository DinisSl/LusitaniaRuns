import { useState, useEffect } from "react";
import { Switch } from "@/components/ui/switch.jsx";

const DarkModeSwitch = () => {
  const [isDark, setIsDark] = useState(() =>
    localStorage.getItem("theme") === "dark" ||
    document.documentElement.classList.contains("dark")
  );

  useEffect(() => {
    const root = document.documentElement;

    if (isDark) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  return (
    <Switch
      checked={isDark}
      onCheckedChange={setIsDark}
    />
  );
}

export default DarkModeSwitch;