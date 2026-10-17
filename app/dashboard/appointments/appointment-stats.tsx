import { Card, CardContent } from '@/components/ui/card'
import { Calendar, TrendingUp, Clock, DollarSign } from 'lucide-react'

type Appointment = {
  id: string
  start_datetime: string
  status: string
  price: number | null
}

export default function AppointmentStats({
  appointments,
}: {
  appointments: Appointment[]
}) {
  const now = new Date()
  const todayStart = new Date(now)
  todayStart.setHours(0, 0, 0, 0)
  const todayEnd = new Date(now)
  todayEnd.setHours(23, 59, 59, 999)

  const todayAppointments = appointments.filter((a) => {
    const start = new Date(a.start_datetime)
    return start >= todayStart && start <= todayEnd && a.status !== 'cancelled'
  })

  const upcomingAppointments = appointments.filter((a) => {
    const start = new Date(a.start_datetime)
    return start > now && a.status !== 'cancelled'
  })

    // 💰 Solo sumar ingresos de turnos COMPLETADOS
  const todayRevenue = todayAppointments
    .filter((a) => a.status === 'completed')
    .reduce((sum, a) => sum + (a.price || 0), 0)

  const stats = [
    {
      icon: Calendar,
      label: 'Turnos hoy',
      value: todayAppointments.length.toString(),
      color: 'text-primary',
      bg: 'bg-primary/10',
    },
    {
      icon: Clock,
      label: 'Próximos',
      value: upcomingAppointments.length.toString(),
      color: 'text-warning',
      bg: 'bg-warning/10',
    },
    {
      icon: DollarSign,
      label: 'Ingresos hoy',
      value: `$${todayRevenue.toLocaleString()}`,
      color: 'text-success',
      bg: 'bg-success/10',
    },
    {
      icon: TrendingUp,
      label: 'Total histórico',
      value: appointments.length.toString(),
      color: 'text-muted-foreground',
      bg: 'bg-muted',
    },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.label}>
            <CardContent className="p-5">
              <div
                className={`w-10 h-10 rounded-lg ${stat.bg} ${stat.color} flex items-center justify-center mb-3`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <p className="text-2xl font-bold tracking-tight">{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {stat.label}
              </p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}