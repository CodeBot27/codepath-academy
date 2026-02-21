import { useParams, Link } from 'react-router-dom';
import { useCourse } from '@/hooks/useCourse';
import { useLessonProgress } from '@/hooks/useLessonProgress';
import { useAuth } from '@/contexts/AuthContext';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BookOpen, CheckCircle2, Clock, Play } from 'lucide-react';

const CoursePage = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const { data: course, isLoading } = useCourse(courseId);
  const { user } = useAuth();
  const { data: progressData } = useLessonProgress(user?.id);

  if (isLoading) return <div className="flex min-h-[50vh] items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" /></div>;
  if (!course) return <div className="p-8 text-center text-muted-foreground">Course not found.</div>;

  const allLessons = course.modules.flatMap(m => m.lessons);
  const completedIds = new Set(progressData?.filter(p => p.status === 'completed').map(p => p.lesson_id) ?? []);
  const totalLessons = allLessons.length;
  const completedCount = allLessons.filter(l => completedIds.has(l.id)).length;
  const pct = totalLessons ? Math.round((completedCount / totalLessons) * 100) : 0;

  const firstIncomplete = allLessons.find(l => !completedIds.has(l.id));

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-wrap items-center gap-2">
          {course.level && <Badge variant="secondary" className="capitalize">{course.level}</Badge>}
          <span className="flex items-center gap-1 text-sm text-muted-foreground"><Clock className="h-4 w-4" />{course.estimated_hours} hours</span>
        </div>
        <h1 className="mt-3 text-3xl font-bold">{course.title}</h1>
        <p className="mt-2 text-muted-foreground">{course.description}</p>

        {user && (
          <div className="mt-6 max-w-md">
            <div className="mb-2 flex justify-between text-sm">
              <span>{completedCount}/{totalLessons} lessons</span>
              <span className="font-semibold text-primary">{pct}%</span>
            </div>
            <Progress value={pct} className="h-2" />
            {firstIncomplete && (
              <Button asChild className="mt-4" size="sm">
                <Link to={`/learn/${firstIncomplete.id}`}><Play className="mr-1 h-4 w-4" /> {completedCount > 0 ? 'Continue Learning' : 'Start Course'}</Link>
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Modules */}
      <div className="space-y-6">
        {course.modules.map((mod, mi) => (
          <div key={mod.id} className="rounded-lg border border-border bg-card">
            <div className="flex items-center gap-3 border-b border-border p-4">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">{mi + 1}</span>
              <h2 className="font-semibold">{mod.title}</h2>
              <span className="ml-auto text-xs text-muted-foreground">{mod.lessons.length} lessons</span>
            </div>
            <div className="divide-y divide-border">
              {mod.lessons.map(lesson => {
                const done = completedIds.has(lesson.id);
                return (
                  <Link key={lesson.id} to={user ? `/learn/${lesson.id}` : '/login'} className="flex items-center gap-3 px-4 py-3 transition hover:bg-muted/50">
                    {done ? (
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                    ) : (
                      <BookOpen className="h-5 w-5 text-muted-foreground" />
                    )}
                    <span className={done ? 'text-muted-foreground' : ''}>{lesson.title}</span>
                    <span className="ml-auto text-xs text-muted-foreground">{lesson.estimated_minutes} min</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CoursePage;
