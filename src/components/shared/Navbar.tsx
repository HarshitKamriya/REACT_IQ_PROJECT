import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Zap } from 'lucide-react'
import { MODULES } from '../../lib/data'

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setIsMobileOpen(false)
  }, [location])

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled ? 'glass-strong shadow-2xl shadow-black/50' : 'bg-transparent'
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-riq-cyan/20 to-riq-blue/20 border border-riq-cyan/30 group-hover:border-riq-cyan/60 transition-all">
              <Zap className="h-5 w-5 text-riq-cyan" />
              <div className="absolute inset-0 rounded-lg bg-riq-cyan/10 blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <span className="text-xl font-bold tracking-wider">
              <span className="text-gradient-cyan">REACT</span>
              <span className="text-riq-gold">IQ</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            <NavLink to="/" current={location.pathname}>Home</NavLink>
            {MODULES.map(m => (
              <NavLink key={m.id} to={m.path} current={location.pathname}>
                {m.title}
              </NavLink>
            ))}
          </div>

          {/* CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              to="/kinetic-modeling"
              className="px-4 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-riq-cyan/20 to-riq-blue/20 border border-riq-cyan/30 text-riq-cyan hover:border-riq-cyan/60 hover:shadow-lg hover:shadow-riq-cyan/10 transition-all"
            >
              Launch Platform
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="lg:hidden p-2 text-riq-gray-light hover:text-riq-cyan transition-colors"
          >
            {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden glass-strong border-t border-riq-border overflow-hidden"
          >
            <div className="px-4 py-4 space-y-1">
              <MobileNavLink to="/" current={location.pathname}>Home</MobileNavLink>
              {MODULES.map(m => (
                <MobileNavLink key={m.id} to={m.path} current={location.pathname}>
                  <span className="mr-2">{m.icon}</span>{m.title}
                </MobileNavLink>
              ))}
              <div className="pt-3 border-t border-riq-border">
                <Link
                  to="/kinetic-modeling"
                  className="block w-full text-center px-4 py-2.5 rounded-lg text-sm font-medium bg-gradient-to-r from-riq-cyan/20 to-riq-blue/20 border border-riq-cyan/30 text-riq-cyan"
                >
                  Launch Platform
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}

function NavLink({ to, current, children }: { to: string; current: string; children: React.ReactNode }) {
  const isActive = current === to
  return (
    <Link
      to={to}
      className={`relative px-3 py-2 rounded-lg text-sm font-medium transition-all ${
        isActive
          ? 'text-riq-cyan bg-riq-cyan/10'
          : 'text-riq-gray-light hover:text-riq-text hover:bg-white/5'
      }`}
    >
      {children}
      {isActive && (
        <motion.div
          layoutId="navbar-indicator"
          className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 w-6 bg-riq-cyan rounded-full"
        />
      )}
    </Link>
  )
}

function MobileNavLink({ to, current, children }: { to: string; current: string; children: React.ReactNode }) {
  const isActive = current === to
  return (
    <Link
      to={to}
      className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
        isActive
          ? 'text-riq-cyan bg-riq-cyan/10 border-l-2 border-riq-cyan'
          : 'text-riq-gray-light hover:text-riq-text hover:bg-white/5'
      }`}
    >
      {children}
    </Link>
  )
}
