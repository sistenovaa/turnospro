export const instant = false

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import AppointmentList from './appointment-list'
import AppointmentStats from './appointment-stats'

export default async function AppointmentsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: business } = await supabase
    .from('businesses')
    .select('id, name, slug')
    .eq('owner_id', user.id)
    .maybeSingle()

  if (!business) {
    redirect('/onboarding')
  }

  // 1. Cargar appointments crudos
  const { data: rawAppointments } = await supabase
    .from('appointments')
    .select('*')
    .eq('business_id', business.id)
    .order('start_datetime', { ascending: true })

  // 2. Extraer IDs únicos
  const serviceIds = [
    ...new Set((rawAppointments || []).map((a) => a.service_id).filter(Boolean)),
  ]
  const customerIds = [
    ...new Set((rawAppointments || []).map((a) => a.customer_id).filter(Boolean)),
  ]

  // 3. Cargar servicios y clientes relacionados
  const { data: servicesData } = serviceIds.length
    ? await supabase
        .from('services')
        .select('id, name, duration_minutes, color')
        .in('id', serviceIds)
    : { data: [] }

  const { data: customersData } = customerIds.length
    ? await supabase
        .from('customers')
        .select('id, name, phone, email')
        .in('id', customerIds)
    : { data: [] }

  // 4. Enriquecer appointments con service y customer
  const appointments = (rawAppointments || []).map((a) => ({
    id: a.id,
    start_datetime: a.start_datetime,
    end_datetime: a.end_datetime,
    status: a.status,
    price: a.price,
    notes: a.notes,
    service: servicesData?.find((s) => s.id === a.service_id) || null,
    customer: customersData?.find((c) => c.id === a.customer_id) || null,
  }))

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
          <p className="text-sm text-muted-foreground">{business.name}</p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Turnos</h1>
          <p className="text-muted-foreground mt-1">
            Todas las reservas de tus clientes
          </p>
        </div>

        <AppointmentStats appointments={appointments} />

        <div className="mt-8">
          <AppointmentList appointments={appointments} />
        </div>
      </main>
    </div>
  )
}