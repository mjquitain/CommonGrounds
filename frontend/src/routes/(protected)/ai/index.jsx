import AIPage from '@/pages/ai';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/(protected)/ai/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <AIPage />;
}
