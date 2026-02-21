import type { Metadata } from 'next'
import Link from 'next/link'
import {
  MessageCircle,
  Bot,
  CheckCircle,
  Brain,
  Search,
  ThumbsUp,
  Bell,
  LayoutDashboard,
  Clock,
  Building2,
} from 'lucide-react'
import LandingNav from '@/components/LandingNav'
import FadeIn from '@/components/FadeIn'

export const metadata: Metadata = {
  title: 'PropMind — AI Property Manager',
  description:
    'Fire your property manager. Keep the service. AI-powered maintenance coordination for small landlords.',
  openGraph: {
    title: 'PropMind — AI Property Manager',
    description:
      'Fire your property manager. Keep the service. AI-powered maintenance coordination for small landlords.',
    type: 'website',
    images: [{ url: '/images/og-image.jpg', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PropMind — AI Property Manager',
    description:
      'Fire your property manager. Keep the service. AI-powered maintenance coordination for small landlords.',
    images: ['/images/og-image.jpg'],
  },
}

const HOW_IT_WORKS = [
  {
    icon: MessageCircle,
    title: 'Tenant Reports',
    description:
      'Your tenant texts or chats about a maintenance issue — any time, day or night.',
  },
  {
    icon: Bot,
    title: 'AI Triages',
    description:
      'PropMind classifies urgency, finds vendors, and proposes a repair schedule instantly.',
  },
  {
    icon: CheckCircle,
    title: 'You Approve',
    description:
      'One click to approve. The tenant and vendor are notified automatically.',
  },
]

const FEATURES = [
  {
    icon: Brain,
    title: 'AI Triage',
    description:
      'Automatically classify issues by urgency and category using conversational AI.',
    color: 'bg-primary/10 text-primary',
  },
  {
    icon: Search,
    title: 'Vendor Search',
    description:
      'Instantly find rated, available vendors near your property for any repair type.',
    color: 'bg-secondary/10 text-secondary',
  },
  {
    icon: ThumbsUp,
    title: 'One-Click Approval',
    description:
      'Review AI recommendations and approve vendor bookings with a single tap.',
    color: 'bg-accent/10 text-accent-foreground',
  },
  {
    icon: Bell,
    title: 'Real-time Updates',
    description:
      'Tenants and landlords stay informed at every step — no phone tag required.',
    color: 'bg-info/10 text-info',
  },
  {
    icon: LayoutDashboard,
    title: 'Multi-Property Dashboard',
    description:
      'Manage all your properties and tickets from one clean, organized view.',
    color: 'bg-success/10 text-success',
  },
  {
    icon: Clock,
    title: '24/7 Availability',
    description:
      'Your AI property manager never sleeps. Tenants get help any time they need it.',
    color: 'bg-warning/10 text-warning',
  },
]

const STATS = [
  { value: '90%', label: 'Faster Response' },
  { value: '24/7', label: 'Always Available' },
  { value: '$0', label: 'Management Fees' },
]

export default function LandingPage() {
  return (
    <>
      <LandingNav />

      {/* ── Section A: Hero ── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Video background */}
        <video
          autoPlay
          muted
          loop
          playsInline
          poster="/images/hero-fallback.jpg"
          className="absolute inset-0 w-full h-full object-cover hidden md:block"
        >
          <source src="/images/hero-video.mp4" type="video/mp4" />
        </video>

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70" />

        {/* Fallback bg for mobile / no video */}
        <div className="absolute inset-0 bg-primary md:hidden" />

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <FadeIn>
            <h1 className="font-[var(--font-display)] text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white leading-tight tracking-tight">
              Fire your property manager.
              <br />
              <span className="text-accent">Keep the service.</span>
            </h1>
          </FadeIn>

          <FadeIn delay={200}>
            <p className="mt-6 text-lg sm:text-xl text-white/80 max-w-2xl mx-auto">
              AI-powered maintenance coordination for small landlords. Tenant
              reports an issue, AI triages and finds vendors, you approve with
              one click.
            </p>
          </FadeIn>

          <FadeIn delay={400}>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/login"
                className="inline-flex items-center justify-center rounded-full bg-accent px-8 py-3 text-base font-semibold text-white shadow-lg hover:bg-accent/90 transition-colors"
              >
                Get Started
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center justify-center rounded-full border-2 border-white/30 px-8 py-3 text-base font-semibold text-white hover:bg-white/10 transition-colors"
              >
                Report an Issue
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── Section B: How It Works ── */}
      <section className="py-24 px-6 bg-background">
        <div className="max-w-6xl mx-auto">
          <FadeIn>
            <h2 className="font-[var(--font-display)] text-3xl sm:text-4xl font-bold text-center mb-4">
              How It Works
            </h2>
            <p className="text-center text-muted-foreground max-w-xl mx-auto mb-16">
              From tenant report to resolved ticket in three simple steps.
            </p>
          </FadeIn>

          <div className="relative grid md:grid-cols-3 gap-8 md:gap-12">
            {/* Connecting line (desktop only) */}
            <div className="hidden md:block absolute top-12 left-[16.6%] right-[16.6%] h-0.5 bg-border" />

            {HOW_IT_WORKS.map((step, i) => (
              <FadeIn key={step.title} delay={i * 80}>
                <div className="relative text-center">
                  <div className="relative z-10 mx-auto w-24 h-24 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                    <step.icon className="h-10 w-10 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section C: Features Grid ── */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <FadeIn>
            <h2 className="font-[var(--font-display)] text-3xl sm:text-4xl font-bold text-center mb-4">
              Everything You Need
            </h2>
            <p className="text-center text-muted-foreground max-w-xl mx-auto mb-16">
              Built for landlords who manage 2–10 properties and want
              professional-grade maintenance coordination without the cost.
            </p>
          </FadeIn>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((feature, i) => (
              <FadeIn key={feature.title} delay={i * 60}>
                <div className="bg-card rounded-2xl p-6 shadow-sm border hover:-translate-y-0.5 hover:shadow-md transition-all duration-200">
                  <div
                    className={`w-12 h-12 rounded-xl ${feature.color} flex items-center justify-center mb-4`}
                  >
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-base font-bold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section D: Stats Bar ── */}
      <section className="py-16 px-6 bg-muted">
        <div className="max-w-4xl mx-auto">
          <FadeIn>
            <div className="grid grid-cols-3 gap-8 text-center">
              {STATS.map((stat) => (
                <div key={stat.label}>
                  <p className="font-[var(--font-display)] text-3xl sm:text-4xl md:text-5xl font-bold text-primary">
                    {stat.value}
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── Section E: Final CTA ── */}
      <section className="py-24 px-6 bg-background">
        <div className="max-w-3xl mx-auto text-center">
          <FadeIn>
            <h2 className="font-[var(--font-display)] text-3xl sm:text-4xl font-bold mb-6">
              Ready to fire your property manager?
            </h2>
            <p className="text-muted-foreground mb-10 max-w-xl mx-auto">
              Join landlords who save time and money with AI-powered maintenance
              coordination. No credit card required.
            </p>
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-full bg-primary px-10 py-4 text-lg font-semibold text-white shadow-lg hover:bg-primary/90 transition-colors"
            >
              Get Started Free
            </Link>
          </FadeIn>
        </div>
      </section>

      {/* ── Section F: Footer ── */}
      <footer className="py-12 px-6 border-t bg-card">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <Building2 className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight">PropMind</span>
          </div>

          <nav className="flex items-center gap-6 text-sm text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="hover:text-foreground transition-colors">
              How It Works
            </a>
            <Link href="/login" className="hover:text-foreground transition-colors">
              Sign In
            </Link>
          </nav>

          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} PropMind. All rights reserved.
          </p>
        </div>
      </footer>
    </>
  )
}
