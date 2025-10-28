import { createFileRoute } from '@tanstack/react-router'
import FocusPage from '@/pages/focus'

export const Route = createFileRoute('/(protected)/focus/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <FocusPage/>
}
