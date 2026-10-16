'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

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
      <p className="text-gray-500 text-sm text-center py-8">
        Aún no tienes servicios. Agrega el primero →
      </p>
    )
  }

  return (
    <ul className="space-y-2">
      {services.map((service) => (
        <li
          key={service.id}
          className="flex items-center justify-between p-3 border border-gray-200 rounded-md hover:bg-gray-50"
        >
          <div className="flex items-center gap-3">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: service.color }}
            />
            <div>
              <p className="font-medium text-sm">{service.name}</p>
              <p className="text-xs text-gray-500">
                {service.duration_minutes} min · ${service.price}
              </p>
            </div>
          </div>
          <button
            onClick={() => handleDelete(service.id)}
            disabled={deleting === service.id}
            className="text-red-600 hover:text-red-800 text-sm disabled:opacity-50"
          >
            {deleting === service.id ? '...' : 'Eliminar'}
          </button>
        </li>
      ))}
    </ul>
  )
}