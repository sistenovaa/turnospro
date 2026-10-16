export const instant = false
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Scissors, MapPin, Phone, Clock } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default async function PublicBusinessPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: business } = await supabase
    .from('businesses')
    .select('*')
    .eq('slug', slug)
    .maybeSingle()

  if (!business) {
    notFound()
  }

  const { data: services } = await supabase
    .from('services')
    .select('*')
    .eq('business_id', business.id)
    .eq('active', true)
    .order('created_at', { ascending: true })

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="max-w-3xl mx-auto px-6 py-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center font-bold text-2xl mx-auto mb-4 shadow-lg shadow-primary/20">
            {business.name.charAt(0).toUpperCase()}
          </div>
          <h1 className="text-2xl font-bold tracking-tight">
            {business.name}
          </h1>
          <p className="text-sm text-muted-foreground mt-2">
            Reserva tu turno online en segundos
          </p>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-10">
        {/* Info del negocio */}
        <div className="flex flex-wrap justify-center gap-4 mb-8 text-sm text-muted-foreground">
          {business.address && (
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              {business.address}
            </div>
          )}
          {business.phone && (
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              {business.phone}
            </div>
          )}
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Lun-Sáb · 9:00 a 18:00
          </div>
        </div>

        {/* Servicios */}
        <h2 className="text-lg font-semibold mb-4">Nuestros servicios</h2>

        {!services || services.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-sm text-muted-foreground">
                Próximamente agregaremos servicios disponibles
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {services.map((service) => (
              <Card
                key={service.id}
                className="transition-all hover:shadow-md hover:border-primary/30"
              >
                <CardContent className="p-5 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div
                      className="w-1 h-12 rounded-full"
                      style={{ backgroundColor: service.color }}
                    />
                    <div>
                      <h3 className="font-semibold">{service.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {service.duration_minutes} min
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="font-semibold">${service.price}</p>
                    <Link href={`/b/${slug}/reservar?servicio=${service.id}`}>
                      <Button size="sm">
                        Reservar
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="mt-16 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <Scissors className="w-3 h-3" />
            Creado con TurnosPro
          </Link>
        </div>
      </main>
    </div>
  )
}