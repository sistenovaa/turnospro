export const instant = false
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import BookingWizard from './booking-wizard'

export default async function BookingPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ servicio?: string }>
}) {
  const { slug } = await params
  const { servicio } = await searchParams
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
    <BookingWizard
      business={business}
      services={services || []}
      preselectedServiceId={servicio}
    />
  )
}