'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Trash2 } from 'lucide-react'

type Service = {
  id: string
  name: string
  duration_minutes: number
  price: number
  color: string
}

export default function ServiceList({ services }: { services: Service[] }) {
  const [deleting, setDeleting] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  async function handleDelete(id: string) {
    if (!confirm('¿Eliminar este servicio?')) return
    setDeleting(id)
    await supabase.from('services').delete().eq('id', id)
    setDeleting(null)
    router.refresh()
  }

  if (services.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-sm text-muted-foreground">
          Aún no tienes servicios
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Agrega el primero usando el formulario →
        </p>
      </div>
    )
  }

  return (
    <ul className="space-y-2">
      {services.map((service) => (
        <li
          key={service.id}
          className="group flex items-center justify-between p-3 rounded-lg border border-border hover:border-primary/30 hover:bg-secondary/50 transition-all"
        >
          <div className="flex items-center gap-3">
            <div
              className="w-3 h-3 rounded-full flex-shrink-0"
              style={{ backgroundColor: service.color }}
            />
            <div>
              <p className="font-medium text-sm">{service.name}</p>
              <p className="text-xs text-muted-foreground">
                {service.duration_minutes} min · ${service.price}
              </p>
            </div>
          </div>
          <button
            onClick={() => handleDelete(service.id)}
            disabled={deleting === service.id}
            className="p-2 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors opacity-0 group-hover:opacity-100 disabled:opacity-50"
            aria-label="Eliminar servicio"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </li>
      ))}
    </ul>
  )
}