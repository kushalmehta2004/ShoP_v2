import { Globe2, Instagram, ShieldCheck, Sparkles } from 'lucide-react'
import Link from 'next/link'

export const metadata = {
  title: 'About | ShoP',
  description: 'Learn more about ShoP and follow the brand on Instagram.',
}

const highlights = [
  {
    icon: Sparkles,
    title: 'Curated selection',
    description: 'Every piece is chosen for craftsmanship, rarity, and visual impact.',
  },
  {
    icon: ShieldCheck,
    title: 'Trusted sourcing',
    description: 'Luxury items are sourced with attention to authenticity and quality.',
  },
  {
    icon: Globe2,
    title: 'Global discovery',
    description: 'Premium products from around the world, presented in one elevated experience.',
  },
]

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background">
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <p className="mb-4 text-xs uppercase tracking-[0.4em] text-muted-foreground">
              About ShoP
            </p>
            <h1 className="font-serif text-4xl leading-tight text-foreground sm:text-5xl lg:text-6xl">
              Luxury shopping, curated with intention.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              ShoP is a luxury shopping concierge focused on premium imports, distinctive finds, and a refined browsing experience. The brand is built for people who value craftsmanship, presentation, and exclusivity.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <a
                href="https://www.instagram.com/shopendswithp/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-3 bg-foreground px-6 py-3 text-sm font-medium text-background transition-colors duration-300 hover:bg-gold"
              >
                <Instagram className="h-4 w-4" />
                Follow on Instagram
              </a>
              <Link
                href="/collection"
                className="inline-flex items-center gap-3 border border-border px-6 py-3 text-sm font-medium text-foreground transition-colors duration-300 hover:border-foreground"
              >
                View Collection
              </Link>
            </div>
          </div>

          <div className="rounded-[2rem] border border-border bg-card p-6 shadow-sm sm:p-8">
            <div className="aspect-square overflow-hidden rounded-[1.5rem] bg-[#0D5B36] p-8">
              <img src="/logo.jpg" alt="ShoP logo" className="h-full w-full object-contain" />
            </div>
          </div>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {highlights.map((item) => {
            const Icon = item.icon

            return (
              <article key={item.title} className="rounded-3xl border border-border bg-card p-6">
                <Icon className="h-5 w-5 text-gold" />
                <h2 className="mt-4 font-serif text-2xl text-foreground">
                  {item.title}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </article>
            )
          })}
        </div>
      </section>
    </main>
  )
}
