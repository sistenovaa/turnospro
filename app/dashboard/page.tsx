export const instant = false
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import LogoutButton from './logout-button'
import Link from 'next/link'

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

        <div className="grid md:grid-cols-2 gap-4 mb-6">
  <Link
    href="/dashboard/services"
    className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition block"
  >
    <h3 className="text-lg font-semibold mb-1">✂️ Servicios</h3>
    <p className="text-gray-500 text-sm">
      Agrega cortes, barba, cejas y sus precios
    </p>
  </Link>

  <div className="bg-white rounded-lg shadow p-6 opacity-50">
    <h3 className="text-lg font-semibold mb-1">👥 Profesionales</h3>
    <p className="text-gray-500 text-sm">Próximamente</p>
  </div>

  <div className="bg-white rounded-lg shadow p-6 opacity-50">
    <h3 className="text-lg font-semibold mb-1">📅 Horarios</h3>
    <p className="text-gray-500 text-sm">Próximamente</p>
  </div>

  <div className="bg-white rounded-lg shadow p-6 opacity-50">
    <h3 className="text-lg font-semibold mb-1">🔗 Página pública</h3>
    <p className="text-gray-500 text-sm">Próximamente</p>
  </div>
</div>
      </div>
    </div>
  )
}