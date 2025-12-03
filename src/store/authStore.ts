import { create } from 'zustand'
import type { Session, User } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'

interface AuthState {
  user: User | null
  session: Session | null
  profile: any | null
  isLoading: boolean
  isInitialized: boolean
  initializeAuth: () => Promise<void>
  signOut: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  session: null,
  profile: null,
  isLoading: true,
  isInitialized: false,

  initializeAuth: async () => {
    if (get().isInitialized) return

    try {
      const { data: { session } } = await supabase.auth.getSession()
      
      let profile = null
      if (session?.user) {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()
        profile = data
      }

      set({ 
        session, 
        user: session?.user ?? null, 
        profile, 
        isLoading: false,
        isInitialized: true 
      })

      supabase.auth.onAuthStateChange(async (event, session) => {
        if (event === 'SIGNED_OUT') {
          set({ session: null, user: null, profile: null, isLoading: false })
          return
        }

        if (session?.user) {
          const currentProfile = get().profile
          if (!currentProfile || currentProfile.id !== session.user.id) {
             const { data } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single()
             set({ session, user: session.user, profile: data, isLoading: false })
          } else {
             set({ session, user: session.user, isLoading: false })
          }
        }
      })

    } catch (error) {
      set({ isLoading: false })
    }
  },

  signOut: async () => {
    set({ session: null, user: null, profile: null })
    try {
      await supabase.auth.signOut()
      localStorage.removeItem('sb-fluxo-auth-token')
    } catch (error) {
      // Error handling intentionally suppressed for optimistic UI update
    }
  }
}))