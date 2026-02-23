import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useTracks } from '@/hooks/useTracks';
import { Code2, BookOpen, TrendingUp, Zap, Terminal, Users, ArrowRight, CheckCircle2, Globe, Layers, Rocket } from 'lucide-react';

const Index = () => {
  const { user } = useAuth();
  const { data: tracks } = useTracks();

  return (
    <div className="min-h-[calc(100vh-4rem)]">
      {/* Hero */}
      <section className="relative overflow-hidden px-4 py-24 md:py-36">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(var(--primary)/0.08),transparent_60%)]" />
        <div className="container relative mx-auto text-center">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
            <Zap className="h-4 w-4" /> 100% Free — No credit card required
          </div>
          <h1 className="mt-6 text-4xl font-bold leading-tight tracking-tight md:text-6xl lg:text-7xl">
            Learn to Code,<br />
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Build Your Future</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl">
            Structured learning tracks that take you from zero to full-stack developer.
            Real projects, hands-on practice, completely free.
          </p>
          <div className="mt-10 flex items-center justify-center gap-4">
            <Button size="lg" asChild className="gap-2">
              <Link to={user ? '/dashboard' : '/signup'}>
                {user ? 'Go to Dashboard' : 'Start Learning Free'} <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link to="/tracks">Browse Tracks</Link>
            </Button>
          </div>

          {/* Terminal preview */}
          <div className="mx-auto mt-16 max-w-2xl overflow-hidden rounded-xl border border-border bg-card shadow-2xl shadow-primary/5">
            <div className="flex items-center gap-2 border-b border-border bg-muted/50 px-4 py-3">
              <div className="h-3 w-3 rounded-full bg-destructive/60" />
              <div className="h-3 w-3 rounded-full bg-yellow-500/60" />
              <div className="h-3 w-3 rounded-full bg-primary/60" />
              <span className="ml-2 font-mono text-xs text-muted-foreground">~/codepath-free</span>
            </div>
            <div className="p-6 text-left font-mono text-sm">
              <p className="text-muted-foreground"><span className="text-primary">$</span> npx create-your-career</p>
              <p className="mt-2 text-muted-foreground"><span className="text-primary">✓</span> HTML & CSS fundamentals... <span className="text-primary">done</span></p>
              <p className="text-muted-foreground"><span className="text-primary">✓</span> JavaScript mastery... <span className="text-primary">done</span></p>
              <p className="text-muted-foreground"><span className="text-primary">✓</span> Git & version control... <span className="text-primary">done</span></p>
              <p className="text-muted-foreground"><span className="text-accent">▸</span> Full-stack projects... <span className="animate-pulse text-accent">in progress</span></p>
              <p className="mt-2 text-primary">🚀 Ready to launch your dev career!</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-border px-4 py-20">
        <div className="container mx-auto">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold md:text-4xl">Everything you need to <span className="text-primary">succeed</span></h2>
            <p className="mt-4 text-muted-foreground">No fluff, no paywalls — just a clear path to becoming a developer.</p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: BookOpen, title: 'Structured Curriculum', desc: 'Follow a clear path from fundamentals to advanced topics with hands-on lessons.' },
              { icon: Code2, title: 'Real Code Examples', desc: 'Every lesson includes working code blocks you can study and reference.' },
              { icon: TrendingUp, title: 'Track Your Progress', desc: 'Mark lessons complete, see your overall progress, and pick up where you left off.' },
              { icon: Terminal, title: 'Hands-On Practice', desc: 'Build real projects as you learn — not just theory, but actual coding experience.' },
              { icon: Globe, title: 'Learn Anywhere', desc: 'Access your courses from any device. Your progress syncs across all platforms.' },
              { icon: Layers, title: 'Modular Learning', desc: 'Each track is broken into bite-sized modules so you can learn at your own pace.' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="group rounded-xl border border-border bg-card p-8 transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
                <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-3 transition-colors group-hover:bg-primary/20">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">{title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Available Tracks */}
      {tracks && tracks.length > 0 && (
        <section className="border-t border-border px-4 py-20">
          <div className="container mx-auto">
            <div className="mb-12 text-center">
              <h2 className="text-3xl font-bold md:text-4xl">Available <span className="text-primary">Tracks</span></h2>
              <p className="mt-4 text-muted-foreground">Start your journey with one of our curated learning paths.</p>
            </div>
            <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2">
              {tracks.map((track) => (
                <Link
                  key={track.id}
                  to="/tracks"
                  className="group rounded-xl border border-border bg-card p-8 transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
                >
                  <div className="mb-3 inline-flex rounded-lg bg-accent/10 p-3">
                    <Rocket className="h-6 w-6 text-accent" />
                  </div>
                  <h3 className="mb-2 text-xl font-semibold group-hover:text-primary transition-colors">{track.title}</h3>
                  <p className="text-sm text-muted-foreground">{track.description}</p>
                  <div className="mt-4 flex items-center gap-1 text-sm font-medium text-primary">
                    Explore track <ArrowRight className="h-4 w-4" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* How it Works */}
      <section className="border-t border-border px-4 py-20">
        <div className="container mx-auto">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold md:text-4xl">How it <span className="text-primary">works</span></h2>
            <p className="mt-4 text-muted-foreground">Three simple steps to start your coding journey.</p>
          </div>
          <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-3">
            {[
              { step: '01', title: 'Sign Up Free', desc: 'Create your account in seconds. No credit card, no hidden fees.' },
              { step: '02', title: 'Choose a Track', desc: 'Pick a learning path that matches your goals — from web basics to full-stack.' },
              { step: '03', title: 'Learn & Build', desc: 'Work through lessons, write real code, and build projects you can show off.' },
            ].map(({ step, title, desc }) => (
              <div key={step} className="text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border-2 border-primary bg-primary/10 font-mono text-lg font-bold text-primary">
                  {step}
                </div>
                <h3 className="mb-2 text-lg font-semibold">{title}</h3>
                <p className="text-sm text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Free */}
      <section className="border-t border-border px-4 py-20">
        <div className="container mx-auto">
          <div className="mx-auto max-w-3xl rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 via-card to-accent/5 p-10 text-center md:p-16">
            <Users className="mx-auto mb-4 h-10 w-10 text-primary" />
            <h2 className="text-3xl font-bold md:text-4xl">Why is it free?</h2>
            <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
              We believe quality coding education should be accessible to everyone.
              No paywalls, no premium tiers — every lesson, every track, completely free forever.
            </p>
            <div className="mt-8 grid gap-4 text-left sm:grid-cols-2">
              {[
                'No hidden costs or upsells',
                'Full access to all tracks',
                'Community-driven content',
                'Open to all skill levels',
              ].map((item) => (
                <div key={item} className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border px-4 py-24">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold md:text-4xl">Ready to start <span className="text-primary">coding</span>?</h2>
          <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
            Join thousands of learners building their developer careers — no experience required.
          </p>
          <div className="mt-8 flex items-center justify-center gap-4">
            <Button size="lg" asChild className="gap-2">
              <Link to={user ? '/dashboard' : '/signup'}>
                {user ? 'Continue Learning' : 'Get Started Free'} <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border px-4 py-10">
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Code2 className="h-5 w-5 text-primary" />
            <span className="font-semibold text-foreground">CodePath Free</span> — Learn to code, for free.
          </div>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <Link to="/tracks" className="transition hover:text-foreground">Tracks</Link>
            <Link to="/signup" className="transition hover:text-foreground">Sign Up</Link>
            <Link to="/login" className="transition hover:text-foreground">Log In</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
