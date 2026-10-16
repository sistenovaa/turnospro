export const instant = false
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import ServiceForm from './service-form'
import ServiceList from './service-list'
import ThemeToggle from '@/components/theme-toggle'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft } from 'lucide-react'

export default async function ServicesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: business } = await supabase
    .from('businesses')
    .select('id, name')
    .eq('owner_id', user.id)
    .maybeSingle()

  if (!business) {
    redirect('/onboarding')
  }

  const { data: services } = await supabase
    .from('services')
    .select('*')
    .eq('business_id', business.id)
    .order('created_at', { ascending: true })

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
  <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
    <Link
      href="/dashboard"
      className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
    >
      <ArrowLeft className="w-4 h-4" />
      Volver al dashboard
    </Link>
    <ThemeToggle />
  </div>
</header>

      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Servicios</h1>
          <p className="text-muted-foreground mt-1">{business.name}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Agregar servicio</CardTitle>
              <CardDescription>
                Define cortes, precios y duraciones
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ServiceForm businessId={business.id} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tus servicios ({services?.length || 0})</CardTitle>
              <CardDescription>
                Los que tus clientes podrán reservar
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ServiceList services={services || []} />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}