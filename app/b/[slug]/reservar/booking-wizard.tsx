'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input, Label } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import {
  ArrowLeft,
  Check,
  ChevronRight,
  Clock,
} from 'lucide-react'
import Link from 'next/link'

type Business = {
  id: string
  name: string
  slug: string
  phone: string | null
  address: string | null
}

type Service = {
  id: string
  name: string
  duration_minutes: number
  price: number
  color: string
}

function generateAvailableSlots(): { date: Date; slots: Date[] }[] {
  const days: { date: Date; slots: Date[] }[] = []
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  for (let d = 0; d < 14; d++) {
    const date = new Date(today)
    date.setDate(date.getDate() + d)
    const dayOfWeek = date.getDay()

    if (dayOfWeek === 0) continue

    const slots: Date[] = []
    for (let hour = 9; hour < 18; hour++) {
      for (let min = 0; min < 60; min += 30) {
        const slot = new Date(date)
        slot.setHours(hour, min, 0, 0)
        if (slot > new Date()) {
          slots.push(slot)
        }
      }
    }
    days.push({ date, slots })
  }
  return days
}

export default function BookingWizard({
  business,
  services,
  preselectedServiceId,
}: {
  business: Business
  services: Service[]
  preselectedServiceId?: string
}) {
  const supabase = createClient()

  const [step, setStep] = useState(preselectedServiceId ? 2 : 1)
  const [selectedService, setSelectedService] = useState<Service | null>(
    services.find((s) => s.id === preselectedServiceId) || null
  )
  const [selectedSlot, setSelectedSlot] = useState<Date | null>(null)
  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [customerEmail, setCustomerEmail] = useState('')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const days = generateAvailableSlots()

  function handleSelectService(service: Service) {
    setSelectedService(service)
    setStep(2)
  }

  function handleSelectSlot(slot: Date) {
    setSelectedSlot(slot)
    setStep(3)
  }

  async function handleConfirm(e: React.FormEvent) {
    e.preventDefault()
    if (!selectedService || !selectedSlot) return

    setLoading(true)
    setError(null)

    // 1. Crear o encontrar cliente
    const { data: existingCustomer } = await supabase
      .from('customers')
      .select('id')
      .eq('business_id', business.id)
      .eq('phone', customerPhone)
      .maybeSingle()

    let customerId = existingCustomer?.id

    if (!customerId) {
      const { data: newCustomer, error: customerError } = await supabase
        .from('customers')
        .insert({
          business_id: business.id,
          name: customerName,
          phone: customerPhone,
          email: customerEmail || null,
        })
        .select('id')
        .single()

      if (customerError) {
        setError('Error al crear cliente: ' + customerError.message)
        setLoading(false)
        return
      }
      customerId = newCustomer.id
    }

    // 2. Crear turno
    const startDatetime = selectedSlot.toISOString()
    const endDatetime = new Date(
      selectedSlot.getTime() + selectedService.duration_minutes * 60000
    ).toISOString()

    const { error: appointmentError } = await supabase
      .from('appointments')
      .insert({
        business_id: business.id,
        service_id: selectedService.id,
        customer_id: customerId,
        start_datetime: startDatetime,
        end_datetime: endDatetime,
        price: selectedService.price,
        notes: notes || null,
        status: 'confirmed',
      })

    if (appointmentError) {
      setError('Error al reservar: ' + appointmentError.message)
      setLoading(false)
      return
    }

    setStep(4)
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-6 py-4 flex items-center justify-between">
          {step > 1 && step < 4 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Atrás
            </button>
          ) : (
            <Link
              href={`/b/${business.slug}`}
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              {business.name}
            </Link>
          )}
          <div className="text-xs text-muted-foreground">
            Paso {Math.min(step, 3)} de 3
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-10">
        {/* PASO 1: Elegir servicio */}
        {step === 1 && (
          <div>
            <h1 className="text-2xl font-bold tracking-tight mb-2">
              ¿Qué servicio quieres?
            </h1>
            <p className="text-muted-foreground mb-6">
              Elige el servicio que deseas reservar
            </p>

            <div className="space-y-3">
              {services.map((service) => (
                <Card
                  key={service.id}
                  className="cursor-pointer transition-all hover:shadow-md hover:border-primary/50 hover:-translate-y-0.5"
                  onClick={() => handleSelectService(service)}
                >
                  <CardContent className="p-5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div
                        className="w-1 h-12 rounded-full"
                        style={{ backgroundColor: service.color }}
                      />
                      <div>
                        <h3 className="font-semibold">{service.name}</h3>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {service.duration_minutes} min
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <p className="font-semibold">${service.price}</p>
                      <ChevronRight className="w-5 h-5 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* PASO 2: Elegir fecha y hora */}
        {step === 2 && selectedService && (
          <div>
            <h1 className="text-2xl font-bold tracking-tight mb-2">
              ¿Cuándo quieres venir?
            </h1>
            <p className="text-muted-foreground mb-6">
              {selectedService.name} · {selectedService.duration_minutes} min
            </p>

            <div className="space-y-6">
              {days.slice(0, 7).map(({ date, slots }) => {
                if (slots.length === 0) return null

                const dayName = date.toLocaleDateString('es-ES', {
                  weekday: 'long',
                })
                const dayNumber = date.getDate()
                const monthName = date.toLocaleDateString('es-ES', {
                  month: 'short',
                })

                return (
                  <div key={date.toISOString()}>
                    <h3 className="text-sm font-semibold capitalize mb-3">
                      {dayName} {dayNumber} de {monthName}
                    </h3>
                    <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                      {slots.map((slot) => (
                        <button
                          key={slot.toISOString()}
                          onClick={() => handleSelectSlot(slot)}
                          className="px-3 py-2 text-sm border border-border rounded-lg hover:border-primary hover:bg-primary/5 transition-all"
                        >
                          {slot.toLocaleTimeString('es-ES', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </button>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* PASO 3: Datos del cliente */}
        {step === 3 && selectedService && selectedSlot && (
          <div>
            <h1 className="text-2xl font-bold tracking-tight mb-2">
              Tus datos
            </h1>
            <p className="text-muted-foreground mb-6">
              Solo necesitamos saber quién eres
            </p>

            <Card className="mb-6">
              <CardContent className="p-5 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Servicio</span>
                  <span className="font-medium">{selectedService.name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Fecha</span>
                  <span className="font-medium capitalize">
                    {selectedSlot.toLocaleDateString('es-ES', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long',
                    })}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Hora</span>
                  <span className="font-medium">
                    {selectedSlot.toLocaleTimeString('es-ES', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
                <div className="flex justify-between text-sm pt-2 border-t border-border">
                  <span className="text-muted-foreground">Total</span>
                  <span className="font-semibold">${selectedService.price}</span>
                </div>
              </CardContent>
            </Card>

            <form onSubmit={handleConfirm} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre completo *</Label>
                <Input
                  id="name"
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  required
                  placeholder="Juan Pérez"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Teléfono (WhatsApp) *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  required
                  placeholder="+57 300 123 4567"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email (opcional)</Label>
                <Input
                  id="email"
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="tu@email.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notas (opcional)</Label>
                <Input
                  id="notes"
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Ej: corte degradado"
                />
              </div>

              {error && (
                <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-lg border border-destructive/20">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full"
                size="lg"
              >
                {loading ? 'Reservando...' : 'Confirmar reserva'}
              </Button>
            </form>
          </div>
        )}

        {/* PASO 4: Confirmación */}
        {step === 4 && selectedService && selectedSlot && (
          <div className="text-center py-12">
            <div className="w-20 h-20 rounded-full bg-success/10 text-success flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight mb-2">
              ¡Reserva confirmada!
            </h1>
            <p className="text-muted-foreground mb-8">
              Te esperamos pronto
            </p>

            <Card className="mb-6 text-left">
              <CardContent className="p-5 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Servicio</span>
                  <span className="font-medium">{selectedService.name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Fecha</span>
                  <span className="font-medium capitalize">
                    {selectedSlot.toLocaleDateString('es-ES', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long',
                    })}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Hora</span>
                  <span className="font-medium">
                    {selectedSlot.toLocaleTimeString('es-ES', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
                {business.address && (
                  <div className="flex justify-between text-sm pt-2 border-t border-border">
                    <span className="text-muted-foreground">Dirección</span>
                    <span className="font-medium">{business.address}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            <Link href={`/b/${business.slug}`}>
              <Button variant="outline">Volver al inicio</Button>
            </Link>
          </div>
        )}
      </main>
    </div>
  )
}