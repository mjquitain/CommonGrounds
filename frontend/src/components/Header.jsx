import { Link, useNavigate } from '@tanstack/react-router'
import { CalendarDays, Home, ListChecks, LogOut, Menu, Target, X } from 'lucide-react'
import { useState } from 'react'

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()

  const handleLogout = () => {
    const confirmed = window.confirm('Are you sure you want to log out?')
    if (confirmed) {
      setIsOpen(false)
      navigate({ to: '/login' })
    }
  }

  return (
    <>
      <header className="p-4 flex items-center bg-gradient-to-br from-[#6366f1] via-[#7c3aed] to-[#8b5cf6] text-white shadow-lg">
        <button
          onClick={() => setIsOpen(true)}
          className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>
      </header>

      <aside
        className={`fixed top-0 left-0 h-full w-80 bg-gradient-to-br from-[#6366f1] via-[#7c3aed] to-[#8b5cf6] text-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${isOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-violet-300">
          <div>
            <h1 className="text-2xl font-bold">CommonGrounds</h1>
            <h2 className="text-s italic"> Focus. Plan. Achieve.</h2>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-violet-300 hover:text-black rounded-lg transition-colors"
            aria-label="Close menu"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 p-4 overflow-y-auto">
          <Link
            to="/dashboard"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-violet-300 hover:text-black transition-colors mb-3"
            activeProps={{
              className:
                'flex items-center gap-3 p-3 rounded-lg bg-violet-400 transition-colors mb-2',
            }}
          >
            <Home size={20} />
            <span className="font-medium">Dashboard</span>
          </Link>

          <Link
            to="/learninghub"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-violet-300 hover:text-black transition-colors mb-2"
            activeProps={{
              className:
                'flex items-center gap-3 p-3 rounded-lg bg-violet-400 transition-colors mb-2',
            }}
          >
            <ListChecks size={20} />
            <span className="font-medium">Learning Hub</span>
          </Link>

          <Link
            to="/calendar"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-violet-300 hover:text-black transition-colors mb-2"
            activeProps={{
              className:
                'flex items-center gap-3 p-3 rounded-lg bg-violet-400 transition-colors mb-2',
            }}
          >
            <CalendarDays size={20} />
            <span className="font-medium">Calendar</span>
          </Link>

          <Link
            to="/focus"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-violet-300 hover:text-black transition-colors mb-2"
            activeProps={{
              className:
                'flex items-center gap-3 p-3 rounded-lg bg-violet-400 transition-colors mb-2',
            }}
          >
            <Target size={20} />
            <span className="font-medium">Focus Mode</span>
          </Link>
        </nav>

        <div className="p-4 border-t border-violet-300">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-violet-300 hover:text-black transition-colors w-full text-left"
          >
            <LogOut size={20} />
            <span className="font-medium">Log Out</span>
          </button>
        </div>
      </aside>
    </>
  )
}
