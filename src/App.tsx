import { BrowserRouter } from 'react-router-dom'
import AppRoutes from './routes/AppRoutes'
import AppTheme from './theme/AppTheme'
import { useEffect } from 'react'
import { useThemeStore } from './store/themeStore'

function App() {
  const { initializeTheme } = useThemeStore()

  useEffect(() => {
    initializeTheme()
  }, [])

  return (
    <AppTheme>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AppTheme>
  )
}

export default App