import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useTracks } from '@/hooks/useTracks';
import { useCoursesByTrack } from '@/hooks/useCourse';
import { useLessonProgress } from '@/hooks/useLessonProgress';
import { useCourse } from '@/hooks/useCourse';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Play, BookOpen } from 'lucide-react';

const CourseProgressCard = ({ courseId, progressData }: { courseId: string; progressData: any[] }) => {
  const { data: course } = useCourse(courseId);
  if (!course) return null;

  const allLessons = course.modules.flatMap(m => m.lessons);
  const completedIds = new Set(progressData?.filter((p: any) => p.status === 'completed').map((p: any) => p.lesson_id) ?? []);
  const pct = allLessons.length ? Math.round((allLessons.filter(l => completedIds.has(l.id)).length / allLessons.length) * 100) : 0;
  const nextLesson = allLessons.find(l => !completedIds.has(l.id));

  return (
    <div className="rounded-lg border border-border bg-card p-5">
      <h3 className="font-semibold">{course.title}</h3>
      <div className="mt-3 flex items-center gap-3">
        <Progress value={pct} className="h-2 flex-1" />
        <span className="text-sm font-semibold text-primary">{pct}%</span>
      </div>
      <div className="mt-3 flex gap-2">
        {nextLesson && (
          <Button size="sm" asChild>
            <Link to={`/learn/${nextLesson.id}`}><Play className="mr-1 h-3 w-3" /> Continue</Link>
          </Button>
        )}
        <Button size="sm" variant="outline" asChild>
          <Link to={`/courses/${courseId}`}><BookOpen className="mr-1 h-3 w-3" /> View Course</Link>
        </Button>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const { user } = useAuth();
  const { data: tracks } = useTracks();
  const { data: progressData } = useLessonProgress(user?.id);

  // Get first track to show its courses
  const firstTrack = tracks?.[0];
  const { data: courses } = useCoursesByTrack(firstTrack?.id);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="mt-1 text-muted-foreground">Pick up where you left off.</p>
      </div>

      <section>
        <h2 className="mb-4 text-xl font-semibold">My Courses</h2>
        {courses?.length ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {courses.map(c => (
              <CourseProgressCard key={c.id} courseId={c.id} progressData={progressData ?? []} />
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-border bg-card p-8 text-center">
            <p className="text-muted-foreground">No courses available yet.</p>
            <Button className="mt-4" asChild><Link to="/tracks">Browse Tracks</Link></Button>
          </div>
        )}
      </section>
    </div>
  );
};

export default Dashboard;
