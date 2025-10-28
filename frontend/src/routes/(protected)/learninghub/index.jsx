import LearningHubPage from '@/pages/learninghub'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(protected)/learninghub/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <LearningHubPage/>
}
