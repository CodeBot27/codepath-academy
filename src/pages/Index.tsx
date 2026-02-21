import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Code2, BookOpen, TrendingUp, Zap } from 'lucide-react';

const Index = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-[calc(100vh-4rem)]">
      {/* Hero */}
      <section className="relative overflow-hidden px-4 py-24 md:py-36">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />
        <div className="container relative mx-auto text-center">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
            <Zap className="h-4 w-4" /> 100% Free — No credit card required
          </div>
          <h1 className="mt-6 text-4xl font-bold leading-tight tracking-tight md:text-6xl">
            Learn to Code,<br />
            <span className="text-primary">Build Your Future</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            Structured learning tracks that take you from zero to full-stack developer.
            Real projects, hands-on practice, completely free.
          </p>
          <div className="mt-10 flex items-center justify-center gap-4">
            <Button size="lg" asChild>
              <Link to={user ? '/dashboard' : '/signup'}>
                {user ? 'Go to Dashboard' : 'Start Learning Free'}
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link to="/tracks">Browse Tracks</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-border px-4 py-20">
        <div className="container mx-auto grid gap-8 md:grid-cols-3">
          {[
            { icon: BookOpen, title: 'Structured Curriculum', desc: 'Follow a clear path from fundamentals to advanced topics with hands-on lessons.' },
            { icon: Code2, title: 'Real Code Examples', desc: 'Every lesson includes working code blocks you can study and reference.' },
            { icon: TrendingUp, title: 'Track Your Progress', desc: 'Mark lessons complete, see your overall progress, and pick up where you left off.' },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="rounded-lg border border-border bg-card p-8">
              <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-3">
                <Icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">{title}</h3>
              <p className="text-sm text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Index;
