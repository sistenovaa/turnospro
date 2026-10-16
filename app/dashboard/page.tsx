import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import LogoutButton from './logout-button'
import ThemeToggle from '@/components/theme-toggle'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Scissors, Users, Calendar, Link2, ArrowRight, Sparkles } from 'lucide-react'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: business } = await supabase
    .from('businesses')
    .select('*')
    .eq('owner_id', user.id)
    .maybeSingle()

  if (!business) {
    redirect('/onboarding')
  }

  const modules = [
    {
      icon: Scissors,
      title: 'Servicios',
      description: 'Agrega cortes, barba, cejas y sus precios',
      href: '/dashboard/services',
      active: true,
    },
    {
      icon: Users,
      title: 'Profesionales',
      description: 'Gestiona a tu equipo de trabajo',
      href: '#',
      active: false,
    },
    {
      icon: Calendar,
      title: 'Horarios',
      description: 'Configura cuándo atiende cada uno',
      href: '#',
      active: false,
    },
    {
      icon: Link2,
      title: 'Página pública',
      description: 'Comparte tu enlace de reservas',
      href: '#',
      active: false,
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
              {business.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="font-semibold leading-none">{business.name}</h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                {user.email}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <LogoutButton />
          </div>
        </div>
      </header>

      {/* Contenido */}
      <main className="max-w-6xl mx-auto px-6 py-10">
        {/* Hero section */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-3">
            <Sparkles className="w-3 h-3" />
            Panel de control
          </div>
          <h2 className="text-3xl font-bold tracking-tight">
            Bienvenido 👋
          </h2>
          <p className="text-muted-foreground mt-2">
            Gestiona tu negocio desde un solo lugar
          </p>
        </div>

        {/* Info del negocio */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Información del negocio</CardTitle>
            <CardDescription>
              Datos públicos de tu barbería
            </CardDescription>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <dt className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                  URL de reservas
                </dt>
                <dd className="text-sm font-mono bg-secondary px-2 py-1 rounded inline-block">
                  /{business.slug}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                  Plan
                </dt>
                <dd className="text-sm font-medium capitalize">
                  {business.plan}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                  Teléfono
                </dt>
                <dd className="text-sm">{business.phone || '—'}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                  Dirección
                </dt>
                <dd className="text-sm">{business.address || '—'}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        {/* Módulos */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold">Módulos</h3>
          <p className="text-sm text-muted-foreground">
            Configura tu negocio paso a paso
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {modules.map((module) => {
            const Icon = module.icon
            const Wrapper = module.active ? Link : 'div'

            return (
              <Wrapper
                key={module.title}
                href={module.active ? module.href : '#'}
                className={
                  module.active
                    ? 'group block'
                    : 'opacity-50 cursor-not-allowed block'
                }
              >
                <Card
                  className={
                    module.active
                      ? 'transition-all hover:shadow-md hover:border-primary/50 hover:-translate-y-0.5 h-full'
                      : 'h-full'
                  }
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div
                        className={
                          module.active
                            ? 'w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center'
                            : 'w-11 h-11 rounded-xl bg-muted text-muted-foreground flex items-center justify-center'
                        }
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      {module.active ? (
                        <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                      ) : (
                        <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                          Próximamente
                        </span>
                      )}
                    </div>
                    <h4 className="font-semibold mb-1">{module.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {module.description}
                    </p>
                  </CardContent>
                </Card>
              </Wrapper>
            )
          })}
        </div>
      </main>
    </div>
  )
}