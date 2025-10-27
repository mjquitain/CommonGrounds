import { createFileRoute, redirect } from '@tanstack/react-router'
import logo from '../logo.svg'

export const Route = createFileRoute('/')({
  component: App,

  beforeLoad: async () => {
    throw redirect({to: '/login'})
  }
})

function App() {
  return
}