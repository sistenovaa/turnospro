export const instant = false
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import OnboardingForm from './onboarding-form'
import { Card, CardContent } from '@/components/ui/card'
import { Scissors } from 'lucide-react'

export default async function OnboardingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: business } = await supabase
    .from('businesses')
    .select('id')
    .eq('owner_id', user.id)
    .maybeSingle()

  if (business) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center mb-4 shadow-lg shadow-primary/20">
            <Scissors className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Configura tu negocio</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Solo toma 30 segundos
          </p>
        </div>

        <Card>
          <CardContent className="pt-6">
            <OnboardingForm />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}