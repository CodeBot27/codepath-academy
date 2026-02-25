import { Link } from 'react-router-dom';
import { useTracks } from '@/hooks/useTracks';
import { useCoursesByTrack } from '@/hooks/useCourse';
import { BookOpen, Clock, ArrowRight, Lock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const COMING_SOON_TRACKS = ['Backend Development'];

const TrackCourses = ({ trackId }: { trackId: string }) => {
  const { data: courses } = useCoursesByTrack(trackId);
  if (!courses?.length) return <p className="text-sm text-muted-foreground">No courses yet.</p>;

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {courses.map(c => (
        <Link key={c.id} to={`/courses/${c.id}`} className="group rounded-lg border border-border bg-card p-5 transition hover:border-primary/50">
          <div className="mb-3 flex items-center gap-2">
            {c.level && <Badge variant="secondary" className="text-xs capitalize">{c.level}</Badge>}
            <span className="flex items-center gap-1 text-xs text-muted-foreground"><Clock className="h-3 w-3" />{c.estimated_hours}h</span>
          </div>
          <h3 className="font-semibold group-hover:text-primary">{c.title}</h3>
          <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{c.description}</p>
          <div className="mt-3 flex items-center gap-1 text-xs text-primary">
            View Course <ArrowRight className="h-3 w-3" />
          </div>
        </Link>
      ))}
    </div>
  );
};

const Tracks = () => {
  const { data: tracks, isLoading } = useTracks();

  if (isLoading) return <div className="flex min-h-[50vh] items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" /></div>;

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold">Learning Tracks</h1>
        <p className="mt-2 text-muted-foreground">Choose a career track and follow the structured path.</p>
      </div>

      {tracks?.map(track => {
        const isComingSoon = COMING_SOON_TRACKS.includes(track.title);
        return (
          <section key={track.id} className="mb-12">
            <div className="mb-4 flex items-center gap-3">
              <BookOpen className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">{track.title}</h2>
              {isComingSoon && (
                <Badge className="bg-accent text-accent-foreground">
                  <Lock className="mr-1 h-3 w-3" /> Coming Soon
                </Badge>
              )}
            </div>
            {track.description && <p className="mb-4 text-sm text-muted-foreground">{track.description}</p>}
            {isComingSoon ? (
              <div className="rounded-lg border border-dashed border-border bg-muted/30 p-8 text-center">
                <Lock className="mx-auto mb-3 h-8 w-8 text-muted-foreground/50" />
                <p className="font-medium text-muted-foreground">This track is under development</p>
                <p className="mt-1 text-sm text-muted-foreground/70">Check back soon for courses on server-side programming, APIs, and databases.</p>
              </div>
            ) : (
              <TrackCourses trackId={track.id} />
            )}
          </section>
        );
      })}

      {!tracks?.length && <p className="text-muted-foreground">No tracks available yet.</p>}
    </div>
  );
};

export default Tracks;
