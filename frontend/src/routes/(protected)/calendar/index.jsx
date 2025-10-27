import CalendarPage from '@/pages/calendar'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(protected)/calendar/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <CalendarPage/>
}
