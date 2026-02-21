import { useParams, useNavigate } from 'react-router-dom';
import { useLesson } from '@/hooks/useLesson';
import { useMarkLessonComplete } from '@/hooks/useLessonProgress';
import { useLessonProgress } from '@/hooks/useLessonProgress';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Clock, ArrowLeft, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const MarkdownBlock = ({ content }: { content: string }) => (
  <div className="prose prose-invert max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-strong:text-foreground prose-code:rounded prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:text-primary prose-a:text-primary">
    <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
  </div>
);

const VideoBlock = ({ url, title }: { url: string; title?: string }) => {
  const videoId = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?]+)/)?.[1];
  if (!videoId) return <p className="text-muted-foreground">Invalid video URL</p>;
  return (
    <div className="aspect-video overflow-hidden rounded-lg border border-border">
      <iframe src={`https://www.youtube.com/embed/${videoId}`} title={title || 'Video'} className="h-full w-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
    </div>
  );
};

const CodeBlock = ({ code, language }: { code: string; language?: string }) => (
  <div className="overflow-hidden rounded-lg border border-border">
    <div className="flex items-center gap-2 bg-muted/50 px-4 py-2 text-xs text-muted-foreground">
      <span className="font-mono">{language || 'code'}</span>
    </div>
    <pre className="overflow-x-auto bg-muted/30 p-4 font-mono text-sm leading-relaxed">
      <code>{code}</code>
    </pre>
  </div>
);

const ResourcesBlock = ({ links }: { links: { title: string; url: string }[] }) => (
  <div className="rounded-lg border border-border bg-card p-4">
    <h4 className="mb-3 text-sm font-semibold">📚 Resources</h4>
    <ul className="space-y-2">
      {links.map((link, i) => (
        <li key={i}>
          <a href={link.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-primary hover:underline">
            <ExternalLink className="h-3 w-3" /> {link.title}
          </a>
        </li>
      ))}
    </ul>
  </div>
);

const ChecklistBlock = ({ items }: { items: string[] }) => {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <h4 className="mb-3 text-sm font-semibold">✅ Checklist</h4>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
            <input type="checkbox" className="mt-0.5 rounded border-border" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

const LessonPlayer = () => {
  const { lessonId } = useParams<{ lessonId: string }>();
  const { data, isLoading } = useLesson(lessonId);
  const { user } = useAuth();
  const { data: progressData } = useLessonProgress(user?.id);
  const markComplete = useMarkLessonComplete();
  const navigate = useNavigate();

  if (isLoading) return <div className="flex min-h-[50vh] items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" /></div>;
  if (!data) return <div className="p-8 text-center text-muted-foreground">Lesson not found.</div>;

  const { lesson, blocks } = data;
  const isCompleted = progressData?.some(p => p.lesson_id === lessonId && p.status === 'completed');

  const handleComplete = async () => {
    if (!user || !lessonId) return;
    try {
      await markComplete.mutateAsync({ userId: user.id, lessonId });
      toast.success('Lesson marked as complete! 🎉');
    } catch {
      toast.error('Failed to update progress.');
    }
  };

  const renderBlock = (block: any) => {
    const c = block.content_json;
    switch (block.block_type) {
      case 'markdown': return <MarkdownBlock content={c.markdown || c.content || ''} />;
      case 'video': return <VideoBlock url={c.url || ''} title={c.title} />;
      case 'code': return <CodeBlock code={c.code || ''} language={c.language} />;
      case 'resources': return <ResourcesBlock links={c.links || []} />;
      case 'checklist': return <ChecklistBlock items={c.items || []} />;
      default: return <p className="text-muted-foreground">Unknown block type: {block.block_type}</p>;
    }
  };

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      <Button variant="ghost" size="sm" className="mb-6" onClick={() => navigate(-1)}>
        <ArrowLeft className="mr-1 h-4 w-4" /> Back
      </Button>

      <div className="mb-8">
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="capitalize">{lesson.lesson_type}</Badge>
          <span className="flex items-center gap-1 text-xs text-muted-foreground"><Clock className="h-3 w-3" />{lesson.estimated_minutes} min</span>
          {isCompleted && <Badge className="bg-primary/20 text-primary"><CheckCircle2 className="mr-1 h-3 w-3" /> Completed</Badge>}
        </div>
        <h1 className="mt-3 text-3xl font-bold">{lesson.title}</h1>
      </div>

      <div className="space-y-8">
        {blocks.map(block => (
          <div key={block.id}>{renderBlock(block)}</div>
        ))}
      </div>

      <div className="mt-12 border-t border-border pt-6">
        {!isCompleted ? (
          <Button onClick={handleComplete} disabled={markComplete.isPending} className="w-full sm:w-auto">
            <CheckCircle2 className="mr-2 h-4 w-4" />
            {markComplete.isPending ? 'Saving…' : 'Mark as Complete'}
          </Button>
        ) : (
          <div className="flex items-center gap-2 text-primary">
            <CheckCircle2 className="h-5 w-5" />
            <span className="font-medium">You've completed this lesson!</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default LessonPlayer;
