import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import LogoutButton from './logout-button'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Buscar el negocio del usuario
  const { data: business } = await supabase
    .from('businesses')
    .select('*')
    .eq('owner_id', user.id)
    .maybeSingle()

  // Si aún no tiene negocio, ir al onboarding
  if (!business) {
    redirect('/onboarding')
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">{business.name}</h1>
            <p className="text-gray-500 text-sm">
              {user.email}
            </p>
          </div>
          <LogoutButton />
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Información del negocio</h2>
          <dl className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="text-gray-500">URL de reservas</dt>
              <dd className="font-mono">/{business.slug}</dd>
            </div>
            <div>
              <dt className="text-gray-500">Plan</dt>
              <dd className="capitalize">{business.plan}</dd>
            </div>
            <div>
              <dt className="text-gray-500">Teléfono</dt>
              <dd>{business.phone || '—'}</dd>
            </div>
            <div>
              <dt className="text-gray-500">Dirección</dt>
              <dd>{business.address || '—'}</dd>
            </div>
          </dl>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-2">Próximos pasos 🚀</h2>
          <ul className="text-gray-600 space-y-1 text-sm">
            <li>⏳ Agregar servicios (cortes, barba, etc.)</li>
            <li>⏳ Agregar profesionales</li>
            <li>⏳ Configurar horarios</li>
            <li>⏳ Activar página pública de reservas</li>
          </ul>
        </div>
      </div>
    </div>
  )
}