import { motion } from 'framer-motion';
import { Heart, Target, Users, Sparkles, Code2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import aboutBanner from '@/assets/about-banner.jpg';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const About = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-[calc(100vh-4rem)]">
      {/* Hero Banner */}
      <section className="relative overflow-hidden">
        <div className="h-64 sm:h-80 md:h-[420px] w-full relative">
          <img
            src={aboutBanner}
            alt="Students happily coding together in a modern workspace"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        </div>
        <motion.div
          className="container mx-auto px-6 relative -mt-20 sm:-mt-28 text-center"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.h1
            variants={fadeUp}
            transition={{ duration: 0.6 }}
            className="text-4xl font-bold md:text-5xl lg:text-6xl"
          >
            About <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">CodePath Free</span>
          </motion.h1>
          <motion.p
            variants={fadeUp}
            transition={{ duration: 0.6 }}
            className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground"
          >
            Empowering the next generation of developers through free, high-quality coding education.
          </motion.p>
        </motion.div>
      </section>

      {/* Our Story */}
      <section className="px-6 py-20">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeUp} transition={{ duration: 0.5 }} className="mb-6 flex items-center gap-2">
              <Heart className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-bold md:text-3xl">Our Story</h2>
            </motion.div>
            <motion.div variants={fadeUp} transition={{ duration: 0.5 }} className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                CodePath Free was founded by <a href="https://mogamatsm.netlify.app/" target="_blank" rel="noopener noreferrer" className="font-semibold text-primary hover:underline">Mogamat Smith</a>, a passionate developer who believes that quality coding education should never be locked behind a paywall.
              </p>
              <p>
                After seeing how many aspiring developers struggled to find structured, beginner-friendly resources without paying hundreds or thousands of dollars, Mogamat set out to build something different — a platform that gives everyone the same opportunity to learn, grow, and launch their careers in tech.
              </p>
              <p>
                What started as a personal project has grown into a comprehensive learning platform with curated tracks covering everything from HTML & CSS fundamentals to full-stack development with modern frameworks.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="border-t border-border px-6 py-20">
        <div className="container mx-auto max-w-5xl">
          <motion.div
            className="mb-12 text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={fadeUp}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold md:text-4xl">What drives <span className="text-primary">us</span></h2>
            <p className="mt-4 text-muted-foreground">The core values behind everything we build.</p>
          </motion.div>

          <motion.div
            className="grid gap-6 md:grid-cols-2"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={staggerContainer}
          >
            {[
              {
                icon: Target,
                title: 'Accessibility First',
                desc: 'Every lesson, every track, every resource — completely free, forever. No premium tiers, no upsells, no strings attached.',
              },
              {
                icon: Users,
                title: 'Community Driven',
                desc: 'We grow with our learners. Feedback from students directly shapes new tracks, improved lessons, and better learning experiences.',
              },
              {
                icon: Sparkles,
                title: 'Quality Over Quantity',
                desc: 'We don\'t churn out content for the sake of it. Every lesson is carefully crafted with real-world examples and practical exercises.',
              },
              {
                icon: Code2,
                title: 'Learn by Building',
                desc: 'Theory is important, but nothing beats hands-on experience. Our curriculum is built around real projects you can be proud of.',
              },
            ].map(({ icon: Icon, title, desc }) => (
              <motion.div
                key={title}
                variants={fadeUp}
                transition={{ duration: 0.5 }}
                className="group rounded-xl border border-border bg-card p-8 transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
              >
                <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-3 transition-colors group-hover:bg-primary/20">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">{title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border px-6 py-24">
        <motion.div
          className="container mx-auto text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={fadeUp}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold md:text-4xl">Ready to join the <span className="text-primary">journey</span>?</h2>
          <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
            Start learning today and become part of a growing community of self-taught developers.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <Button size="lg" asChild className="gap-2">
              <Link to={user ? '/dashboard' : '/signup'}>
                {user ? 'Go to Dashboard' : 'Get Started Free'} <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link to="/tracks">Browse Tracks</Link>
            </Button>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default About;
