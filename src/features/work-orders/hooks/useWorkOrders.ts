import { useEffect, useState, useCallback } from 'react'
import { supabase } from '../../../lib/supabase'
import type { Database } from '../../../types/database.types'
import { useAuthStore } from '../../../store/authStore'

export type WorkOrder = Database['public']['Tables']['work_orders']['Row'] & {
  service_templates: { name: string } | null
  profiles: { first_name: string; last_name: string } | null
}

export function useWorkOrders() {
  const { user, profile } = useAuthStore()
  const [orders, setOrders] = useState<WorkOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchOrders = useCallback(async () => {
    if (!user) return

    setLoading(true)
    try {
      let query = supabase
        .from('work_orders')
        .select(`
          *,
          service_templates ( name ),
          profiles ( first_name, last_name )
        `)
        .order('created_at', { ascending: false })

      if (profile?.role === 'technician') {
        query = query.eq('assignee_id', user.id)
      }

      const { data, error: err } = await query

      if (err) throw err
      
      setOrders(data as unknown as WorkOrder[])
    } catch (err: any) {
      console.error(err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [user, profile])

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  return { orders, loading, error, refetch: fetchOrders }
}