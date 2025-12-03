import { useMemo } from 'react'
import { createTheme, ThemeProvider, CssBaseline, useMediaQuery } from '@mui/material'
import { useThemeStore } from '../store/themeStore'

export default function AppTheme({ children }: { children: React.ReactNode }) {
  const { mode } = useThemeStore()
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)')

  const theme = useMemo(() => {
    const isDark = mode === 'system' ? prefersDarkMode : mode === 'dark'

    return createTheme({
      palette: {
        mode: isDark ? 'dark' : 'light',
        primary: {
          main: '#2563eb',
        },
        background: {
          default: isDark ? '#0f172a' : '#f1f5f9',
          paper: isDark ? '#1e293b' : '#ffffff',
        },
      },
      typography: {
        fontFamily: 'Roboto, "Helvetica Neue", Arial, sans-serif',
        h1: { fontWeight: 700 },
        h2: { fontWeight: 700 },
        h3: { fontWeight: 600 },
        button: { 
          textTransform: 'none',
          fontWeight: 600 
        },
      },
      components: {
        MuiButton: {
          styleOverrides: {
            root: { borderRadius: 8 },
          },
        },
        MuiPaper: {
          styleOverrides: {
            root: { borderRadius: 12 },
          },
        },
      },
    })
  }, [mode, prefersDarkMode])

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  )
}