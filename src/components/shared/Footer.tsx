import { Link } from 'react-router-dom'
import { Zap, Globe, Users, MessageCircle, Mail } from 'lucide-react'
import { MODULES } from '../../lib/data'

export default function Footer() {
  return (
    <footer className="relative border-t border-riq-border bg-riq-black">
      {/* Gradient line at top */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-riq-cyan/50 to-transparent" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-riq-cyan/20 to-riq-blue/20 border border-riq-cyan/30">
                <Zap className="h-4 w-4 text-riq-cyan" />
              </div>
              <span className="text-lg font-bold tracking-wider">
                <span className="text-gradient-cyan">REACT</span>
                <span className="text-riq-gold">IQ</span>
              </span>
            </Link>
            <p className="text-sm text-riq-text-dim leading-relaxed mb-6">
              AI-Driven Esterification Scale-Up Intelligence Platform. Revolutionizing chemical manufacturing with predictive analytics.
            </p>
            <div className="flex gap-3">
              {[Globe, Users, MessageCircle, Mail].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-riq-surface border border-riq-border hover:border-riq-cyan/40 hover:text-riq-cyan transition-all"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Modules */}
          <div>
            <h4 className="text-sm font-semibold text-riq-text uppercase tracking-wider mb-4">Platform</h4>
            <ul className="space-y-2">
              {MODULES.map(m => (
                <li key={m.id}>
                  <Link to={m.path} className="text-sm text-riq-text-dim hover:text-riq-cyan transition-colors">
                    {m.icon} {m.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-sm font-semibold text-riq-text uppercase tracking-wider mb-4">Resources</h4>
            <ul className="space-y-2">
              {['Documentation', 'API Reference', 'Case Studies', 'White Papers', 'Safety Standards'].map(item => (
                <li key={item}>
                  <a href="#" className="text-sm text-riq-text-dim hover:text-riq-cyan transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-sm font-semibold text-riq-text uppercase tracking-wider mb-4">Stay Updated</h4>
            <p className="text-sm text-riq-text-dim mb-4">Get the latest in AI-driven chemical engineering.</p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 px-3 py-2 rounded-lg text-sm bg-riq-surface border border-riq-border text-riq-text placeholder-riq-text-dim focus:outline-none focus:border-riq-cyan/40 transition-colors"
              />
              <button className="px-4 py-2 rounded-lg text-sm font-medium bg-riq-cyan/20 text-riq-cyan border border-riq-cyan/30 hover:bg-riq-cyan/30 transition-all">
                Join
              </button>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-riq-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-riq-text-dim">
            © 2026 REACTIQ. All rights reserved. Built for the future of chemical manufacturing.
          </p>
          <div className="flex gap-6">
            {['Privacy Policy', 'Terms of Service', 'Contact'].map(item => (
              <a key={item} href="#" className="text-xs text-riq-text-dim hover:text-riq-cyan transition-colors">
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
