import { Moon, Sun } from "lucide-react"
import { useTheme } from "./providers/theme-provider"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <button
      className="inline-flex items-center justify-center rounded-md w-9 h-9 relative hover:bg-white/10 transition-colors duration-200"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      type="button"
      aria-label="Toggle theme"
    >
      <Sun className="h-[1.2rem] w-[1.2rem] text-white rotate-0 scale-100 transition-transform duration-200 dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] text-white rotate-90 scale-0 transition-transform duration-200 dark:rotate-0 dark:scale-100" />
    </button>
  )
}