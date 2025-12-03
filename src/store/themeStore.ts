import { create } from 'zustand'
import { supabase } from '../lib/supabase'

type ThemeMode = 'light' | 'dark' | 'system'

interface ThemeState {
  mode: ThemeMode
  setMode: (mode: ThemeMode) => void
  initializeTheme: () => void
}

export const useThemeStore = create<ThemeState>((set) => ({
  mode: 'system',

  initializeTheme: () => {
    const savedMode = localStorage.getItem('fluxo-theme') as ThemeMode
    if (savedMode) {
      set({ mode: savedMode })
    }
  },

  setMode: async (mode: ThemeMode) => {
    set({ mode })
    localStorage.setItem('fluxo-theme', mode)

    const { data: { session } } = await supabase.auth.getSession()
    if (session?.user) {
      await supabase
        .from('profiles')
        .update({ theme_preference: mode })
        .eq('id', session.user.id)
    }
  }
}))