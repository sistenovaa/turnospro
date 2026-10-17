import Link from 'next/link'
import { Button } from '@/components/ui/button'
import ThemeToggle from '@/components/theme-toggle'
import { Card, CardContent } from '@/components/ui/card'
import {
  Scissors,
  Calendar,
  Bell,
  Users,
  ArrowRight,
  Check,
  Smartphone,
  BarChart3,
} from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header / Nav */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shadow-sm">
              <Scissors className="w-4.5 h-4.5" />
            </div>
            <span className="font-bold text-lg tracking-tight">TurnosPro</span>
          </Link>
          <nav className="flex items-center gap-2">
            <ThemeToggle />
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Iniciar sesión
              </Button>
            </Link>
            <Link href="/signup">
              <Button size="sm">Empezar gratis</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          Nuevo — Reservas online en 5 minutos
        </div>

        <h1 className="text-5xl md:text-6xl font-bold tracking-tight leading-[1.1] max-w-3xl mx-auto">
          Reservas online para tu barbería,{' '}
          <span className="text-primary">sin complicaciones</span>
        </h1>

        <p className="text-lg text-muted-foreground mt-6 max-w-2xl mx-auto">
          Tus clientes reservan solos desde un link. Tú te olvidas del WhatsApp y de
          la agenda de papel. Empieza gratis, sin tarjeta de crédito.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8">
          <Link href="/signup">
            <Button size="lg" className="group">
              Empezar gratis
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <Link href="/login">
            <Button size="lg" variant="outline">
              Ver demo
            </Button>
          </Link>
        </div>

        <p className="text-xs text-muted-foreground mt-4">
          Sin tarjeta · Cancela cuando quieras
        </p>
      </section>

      {/* Preview card */}
      <section className="max-w-5xl mx-auto px-6 pb-20">
        <Card className="overflow-hidden shadow-xl">
          <div className="bg-gradient-to-br from-primary/5 via-background to-primary/10 p-8 md:p-12">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-card rounded-xl p-5 border border-border shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <span className="text-xs text-muted-foreground">Hoy</span>
                </div>
                <p className="text-2xl font-bold">12</p>
                <p className="text-sm text-muted-foreground">Turnos agendados</p>
              </div>

              <div className="bg-card rounded-xl p-5 border border-border shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-lg bg-success/10 text-success flex items-center justify-center">
                    <BarChart3 className="w-5 h-5" />
                  </div>
                  <span className="text-xs text-muted-foreground">Hoy</span>
                </div>
                <p className="text-2xl font-bold">$285k</p>
                <p className="text-sm text-muted-foreground">Ingresos del día</p>
              </div>

              <div className="bg-card rounded-xl p-5 border border-border shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-lg bg-warning/10 text-warning flex items-center justify-center">
                    <Users className="w-5 h-5" />
                  </div>
                  <span className="text-xs text-muted-foreground">Nuevos</span>
                </div>
                <p className="text-2xl font-bold">4</p>
                <p className="text-sm text-muted-foreground">Clientes esta semana</p>
              </div>
            </div>
          </div>
        </Card>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 py-20 border-t border-border">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            Todo lo que necesitas
          </h2>
          <p className="text-muted-foreground mt-3">
            Herramientas simples que funcionan desde el primer día
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <FeatureCard
            icon={Smartphone}
            title="Link de reservas"
            description="Comparte tu link en Instagram o WhatsApp. Tus clientes reservan en 30 segundos, sin descargar apps."
          />
          <FeatureCard
            icon={Bell}
            title="Recordatorios automáticos"
            description="Olvídate de los olvidos. Enviamos recordatorios por WhatsApp 24 horas antes de cada turno."
          />
          <FeatureCard
            icon={Calendar}
            title="Calendario inteligente"
            description="Ve todos tus turnos en un solo lugar. Arrastra, reagenda y evita choques entre profesionales."
          />
          <FeatureCard
            icon={Users}
            title="Multi-profesional"
            description="Agrega a todo tu equipo. Cada uno con su propia agenda, servicios y horarios."
          />
          <FeatureCard
            icon={BarChart3}
            title="Reportes claros"
            description="Descubre qué servicios son más rentables, qué días tienes más demanda y cuánto facturas."
          />
          <FeatureCard
            icon={Scissors}
            title="Personalizable"
            description="Agrega tus servicios, precios, colores y logo. Tu página de reservas con tu identidad."
          />
        </div>
      </section>

      {/* Pricing */}
      <section className="max-w-6xl mx-auto px-6 py-20 border-t border-border">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            Precios simples
          </h2>
          <p className="text-muted-foreground mt-3">
            Empieza gratis. Sube cuando crezcas. Precios en pesos colombianos (COP).
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <PricingCard
            name="Free"
            price="$0"
            description="Para empezar"
            features={[
              '1 profesional',
              '30 turnos por mes',
              'Página de reservas',
              'Soporte por email',
            ]}
          />
          <PricingCard
            name="Pro"
            price="$39.900"
            description="El más popular"
            features={[
              'Hasta 5 profesionales',
              'Turnos ilimitados',
              'Recordatorios WhatsApp',
              'Reportes avanzados',
              'Soporte prioritario',
            ]}
            highlighted
          />
          <PricingCard
            name="Business"
            price="$79.900"
            description="Para cadenas"
            features={[
              'Profesionales ilimitados',
              'Múltiples sucursales',
              'Dominio personalizado',
              'API y webhooks',
              'Soporte 24/7',
            ]}
          />
        </div>
      </section>

      {/* Final CTA */}
      <section className="max-w-4xl mx-auto px-6 py-20 text-center">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
          ¿Listo para llenar tu agenda?
        </h2>
        <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
          Únete a las barberías que ya usan TurnosPro para automatizar sus reservas.
        </p>
        <div className="mt-8">
          <Link href="/signup">
            <Button size="lg" className="group">
              Crear mi cuenta gratis
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-primary text-primary-foreground flex items-center justify-center">
              <Scissors className="w-3.5 h-3.5" />
            </div>
            <span className="font-semibold text-sm">TurnosPro</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2026 TurnosPro. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({
  icon: Icon,
  title,
  description,
}: {
  icon: any
  title: string
  description: string
}) {
  return (
    <Card className="transition-all hover:shadow-md hover:border-primary/30 hover:-translate-y-0.5">
      <CardContent className="p-6">
        <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
          <Icon className="w-5 h-5" />
        </div>
        <h3 className="font-semibold mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {description}
        </p>
      </CardContent>
    </Card>
  )
}

function PricingCard({
  name,
  price,
  description,
  features,
  highlighted = false,
}: {
  name: string
  price: string
  description: string
  features: string[]
  highlighted?: boolean
}) {
  return (
    <Card
      className={
        highlighted
          ? 'border-primary shadow-lg shadow-primary/10 relative'
          : ''
      }
    >
      {highlighted && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-medium">
          Más popular
        </div>
      )}
      <CardContent className="p-6">
        <h3 className="font-semibold">{name}</h3>
        <p className="text-xs text-muted-foreground mt-1">{description}</p>

        <div className="mt-4 flex items-baseline gap-1">
          <span className="text-4xl font-bold tracking-tight">{price}</span>
          {price !== '$0' && (
            <span className="text-sm text-muted-foreground">COP/mes</span>
          )}
        </div>

        <ul className="mt-6 space-y-2.5">
          {features.map((feature) => (
            <li key={feature} className="flex items-start gap-2.5 text-sm">
              <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>

        <Link href="/signup" className="block mt-6">
          <Button
            className="w-full"
            variant={highlighted ? 'default' : 'outline'}
          >
            Empezar
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}