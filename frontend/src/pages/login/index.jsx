import { useNavigate } from '@tanstack/react-router'
import { useState } from 'react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Login attempt:', { email, password })
    navigate({ to: '/dashboard' })
  }

  return (
    <div className="flex min-h-screen">
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#6366f1] via-[#7c3aed] to-[#8b5cf6] items-center justify-center p-12">
        <div className="text-white text-center max-w-md">
          <h1 className="text-5xl font-bold mb-6">CommonGrounds</h1>
          <p className="text-xl text-white/90">
            Welcome to CommonGrounds, your personal study buddy. Organize your tasks, plan your studies, and stay on track.
          </p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back!</h2>
            <p className="text-gray-600">Focus. Plan. Achieve.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6366f1] focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6366f1] focus:border-transparent transition-all"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#6366f1] text-white py-3 rounded-lg font-medium hover:bg-[#5558e3] transition-colors shadow-md hover:shadow-lg"
            >
              Log In
            </button>
          </form>

          <div className="mt-6 text-center space-y-3">
            <a
              href="#"
              className="block text-sm text-[#6366f1] hover:text-[#5558e3] transition-colors"
            >
              Forgot Password?
            </a>
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <a
                href="#"
                className="text-[#6366f1] hover:text-[#5558e3] font-medium transition-colors"
              >
                Sign up here
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
