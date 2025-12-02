import { useEffect, useState } from 'react'
import { supabase } from '../../../lib/supabase'

interface Option {
  id: string
  label: string
}

export function useOrderOptions() {
  const [templates, setTemplates] = useState<Option[]>([])
  const [technicians, setTechnicians] = useState<Option[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: templatesData } = await supabase
          .from('service_templates')
          .select('id, name')
        
        const { data: techsData } = await supabase
          .from('profiles')
          .select('id, first_name, last_name')
          .eq('role', 'technician')

        if (templatesData) {
          const formattedTemplates = templatesData.map((t: any) => ({
            id: t.id,
            label: t.name
          }))
          setTemplates(formattedTemplates)
        }

        if (techsData) {
          const formattedTechs = techsData.map((t: any) => ({
            id: t.id,
            label: `${t.first_name || ''} ${t.last_name || ''}`.trim() || 'Unknown Tech'
          }))
          setTechnicians(formattedTechs)
        }
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return { templates, technicians, loading }
}