import { motion } from 'framer-motion'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from '@/lib/theme'

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const isLight = theme === 'light'

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isLight ? 'Switch to dark mode' : 'Switch to light mode'}
      className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-line bg-panel text-dim transition-colors hover:text-accent"
    >
      <motion.span
        key={theme}
        initial={{ y: 14, opacity: 0, rotate: -40 }}
        animate={{ y: 0, opacity: 1, rotate: 0 }}
        exit={{ y: -14, opacity: 0, rotate: 40 }}
        transition={{ duration: 0.35 }}
        className="flex"
      >
        {isLight ? <Moon size={16} /> : <Sun size={16} />}
      </motion.span>
    </button>
  )
}