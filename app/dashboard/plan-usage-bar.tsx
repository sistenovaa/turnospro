'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function PlanUsageBar({ businessId }: { businessId: string }) {
  const [count, setCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function load() {
      const monthStart = new Date()
      monthStart.setDate(1)
      monthStart.setHours(0, 0, 0, 0)

      const { count } = await supabase
        .from('appointments')
        .select('*', { count: 'exact', head: true })
        .eq('business_id', businessId)
        .gte('start_datetime', monthStart.toISOString())
        .neq('status', 'cancelled')

      setCount(count || 0)
      setLoading(false)
    }
    load()
  }, [businessId, supabase])

  if (loading) return null

  const percent = (count / 30) * 100
  const isNearLimit = count >= 25
  const isAtLimit = count >= 30

  return (
    <div className="mt-2">
      <div className="flex justify-between text-xs text-muted-foreground mb-1">
        <span>
          Plan Free · {count}/30 turnos este mes
        </span>
        {isNearLimit && (
          <a href="#" className="text-primary hover:underline">
            Actualizar
          </a>
        )}
      </div>
      <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
        <div
          className={`h-full transition-all ${
            isAtLimit ? 'bg-destructive' : isNearLimit ? 'bg-warning' : 'bg-primary'
          }`}
          style={{ width: `${Math.min(percent, 100)}%` }}
        />
      </div>
    </div>
  )
}