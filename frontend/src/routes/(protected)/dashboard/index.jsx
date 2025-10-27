import DashboardPage from '@/pages/dashboard'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(protected)/dashboard/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <DashboardPage/>
  
}
