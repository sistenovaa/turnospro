import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import LogoutButton from './logout-button'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <LogoutButton />
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-2">¡Bienvenido! 🎉</h2>
          <p className="text-gray-600">
            Has iniciado sesión como: <strong>{user.email}</strong>
          </p>
          <p className="text-gray-600 mt-2">
            Aquí construiremos el panel de gestión de tu barbería.
          </p>
        </div>
      </div>
    </div>
  )
}