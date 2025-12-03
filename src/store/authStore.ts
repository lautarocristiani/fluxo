import { create } from 'zustand'
import type { Session, User } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import { useThemeStore } from './themeStore'
import type { Database } from '../types/database.types'

type Profile = Database['public']['Tables']['profiles']['Row']

interface AuthState {
  user: User | null
  session: Session | null
  profile: Profile | null
  isLoading: boolean
  isInitialized: boolean
  initializeAuth: () => Promise<void>
  refreshProfile: () => Promise<void>
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
      
      let profileData: Profile | null = null

      if (session?.user) {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()
        
        profileData = data as Profile | null

        if (profileData?.theme_preference) {
          useThemeStore.getState().setMode(profileData.theme_preference)
        }
      }

      set({ 
        session, 
        user: session?.user ?? null, 
        profile: profileData, 
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
             
             const newProfile = data as Profile | null

             if (newProfile?.theme_preference) {
               useThemeStore.getState().setMode(newProfile.theme_preference)
             }
             
             set({ session, user: session.user, profile: newProfile, isLoading: false })
          } else {
             set({ session, user: session.user, isLoading: false })
          }
        }
      })

    } catch (error) {
      set({ isLoading: false })
    }
  },

  refreshProfile: async () => {
    try {
      const { session } = get()
      if (!session?.user) return

      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single()
      
      const updatedProfile = data as Profile | null
      
      if (updatedProfile) {
        set({ profile: updatedProfile })
        if (updatedProfile.theme_preference) {
          useThemeStore.getState().setMode(updatedProfile.theme_preference)
        }
      }
    } catch (error) {
      console.error(error)
    }
  },

  signOut: async () => {
    set({ session: null, user: null, profile: null })
    useThemeStore.getState().setMode('system')
    try {
      await supabase.auth.signOut()
      localStorage.removeItem('sb-fluxo-auth-token')
    } catch (error) {
    }
  }
}))