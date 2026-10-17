'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Check, X, Clock, Phone, User } from 'lucide-react'

type Appointment = {
    id: string
    start_datetime: string
    end_datetime: string
    status: string
    price: number | null
    notes: string | null
    service: { id: string; name: string; duration_minutes: number; color: string } | null
    customer: { id: string; name: string; phone: string; email: string | null } | null
}

type Filter = 'upcoming' | 'today' | 'week' | 'all' | 'cancelled'

export default function AppointmentList({
    appointments,
}: {
    appointments: Appointment[]
}) {
    const [filter, setFilter] = useState<Filter>('upcoming')
    const [loadingId, setLoadingId] = useState<string | null>(null)
    const router = useRouter()
    const supabase = createClient()

    const filtered = useMemo(() => {
        const now = new Date()
        const todayStart = new Date(now)
        todayStart.setHours(0, 0, 0, 0)
        const todayEnd = new Date(now)
        todayEnd.setHours(23, 59, 59, 999)
        const weekEnd = new Date(now)
        weekEnd.setDate(weekEnd.getDate() + 7)

        return appointments.filter((a) => {
            const start = new Date(a.start_datetime)

            switch (filter) {
                case 'upcoming':
                    return start >= now && a.status !== 'cancelled'
                case 'today':
                    return start >= todayStart && start <= todayEnd
                case 'week':
                    return start >= now && start <= weekEnd && a.status !== 'cancelled'
                case 'cancelled':
                    return a.status === 'cancelled'
                case 'all':
                default:
                    return true
            }
        })
    }, [appointments, filter])

    async function updateStatus(id: string, status: string) {
        setLoadingId(id)
        await supabase.from('appointments').update({ status }).eq('id', id)
        setLoadingId(null)
        router.refresh()
    }

    function formatDate(dateStr: string) {
        const date = new Date(dateStr)
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        const tomorrow = new Date(today)
        tomorrow.setDate(tomorrow.getDate() + 1)

        const dayStart = new Date(date)
        dayStart.setHours(0, 0, 0, 0)

        if (dayStart.getTime() === today.getTime()) return 'Hoy'
        if (dayStart.getTime() === tomorrow.getTime()) return 'Mañana'

        return date.toLocaleDateString('es-ES', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
        })
    }

    function formatTime(dateStr: string) {
        return new Date(dateStr).toLocaleTimeString('es-ES', {
            hour: '2-digit',
            minute: '2-digit',
        })
    }

    const filters: { value: Filter; label: string }[] = [
        { value: 'upcoming', label: 'Próximos' },
        { value: 'today', label: 'Hoy' },
        { value: 'week', label: 'Esta semana' },
        { value: 'all', label: 'Todos' },
        { value: 'cancelled', label: 'Cancelados' },
    ]

    return (
        <div>
            {/* Filtros */}
            <div className="flex flex-wrap gap-2 mb-6">
                {filters.map((f) => (
                    <button
                        key={f.value}
                        onClick={() => setFilter(f.value)}
                        className={
                            filter === f.value
                                ? 'px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium transition-colors'
                                : 'px-3 py-1.5 rounded-lg bg-secondary text-secondary-foreground text-sm font-medium hover:bg-secondary/80 transition-colors'
                        }
                    >
                        {f.label}
                    </button>
                ))}
            </div>

            {/* Lista */}
            {filtered.length === 0 ? (
                <Card>
                    <CardContent className="p-12 text-center">
                        <p className="text-sm text-muted-foreground">
                            No hay turnos en este filtro
                        </p>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-3">
                    {filtered.map((appointment) => {
                       const service = appointment.service
                       const customer = appointment.customer

                        return (
                            <Card
                                key={appointment.id}
                                className={
                                    appointment.status === 'cancelled'
                                        ? 'opacity-60'
                                        : 'transition-all hover:shadow-md'
                                }
                            >
                                <CardContent className="p-5">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        <div className="flex items-start gap-4 flex-1">
                                            <div
                                                className="w-1 self-stretch rounded-full flex-shrink-0"
                                                style={{
                                                    backgroundColor: service?.color || '#3b82f6',
                                                }}
                                            />
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1 flex-wrap">
                                                    <span className="font-semibold text-sm">
                                                        {formatDate(appointment.start_datetime)}
                                                    </span>
                                                    <span className="text-sm text-muted-foreground">
                                                        · {formatTime(appointment.start_datetime)}
                                                    </span>
                                                    <StatusBadge status={appointment.status} />
                                                </div>

                                                <p className="font-medium">
                                                    {service?.name || 'Servicio eliminado'}
                                                </p>

                                                <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-muted-foreground">
                                                    <span className="flex items-center gap-1.5">
                                                        <User className="w-3.5 h-3.5" />
                                                        {customer?.name || 'Cliente'}
                                                    </span>
                                                    {customer?.phone && (
                                                        <span className="flex items-center gap-1.5">
                                                            <Phone className="w-3.5 h-3.5" />
                                                            {customer.phone}
                                                        </span>
                                                    )}
                                                    <span className="flex items-center gap-1.5">
                                                        <Clock className="w-3.5 h-3.5" />
                                                        {service?.duration_minutes || 0} min
                                                    </span>
                                                    {appointment.price !== null && (
                                                        <span className="font-medium text-foreground">
                                                            ${appointment.price}
                                                        </span>
                                                    )}
                                                </div>

                                                {appointment.notes && (
                                                    <p className="text-xs text-muted-foreground mt-2 italic">
                                                        &ldquo;{appointment.notes}&rdquo;
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Acciones */}
                                        {appointment.status !== 'cancelled' &&
                                            appointment.status !== 'completed' && (
                                                <div className="flex gap-2">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() =>
                                                            updateStatus(appointment.id, 'completed')
                                                        }
                                                        disabled={loadingId === appointment.id}
                                                    >
                                                        <Check className="w-4 h-4" />
                                                        Completar
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        onClick={() =>
                                                            updateStatus(appointment.id, 'cancelled')
                                                        }
                                                        disabled={loadingId === appointment.id}
                                                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                                    >
                                                        <X className="w-4 h-4" />
                                                        Cancelar
                                                    </Button>
                                                </div>
                                            )}
                                    </div>
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>
            )}
        </div>
    )
}

function StatusBadge({ status }: { status: string }) {
    const styles: Record<string, string> = {
        confirmed: 'bg-primary/10 text-primary',
        completed: 'bg-success/10 text-success',
        cancelled: 'bg-destructive/10 text-destructive',
        pending: 'bg-warning/10 text-warning',
        no_show: 'bg-muted text-muted-foreground',
    }

    const labels: Record<string, string> = {
        confirmed: 'Confirmado',
        completed: 'Completado',
        cancelled: 'Cancelado',
        pending: 'Pendiente',
        no_show: 'No asistió',
    }

    return (
        <span
            className={`px-2 py-0.5 rounded text-xs font-medium ${styles[status] || styles.pending
                }`}
        >
            {labels[status] || status}
        </span>
    )
}