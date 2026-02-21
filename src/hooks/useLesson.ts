import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Lesson, LessonBlock } from '@/types/database';

export const useLesson = (lessonId: string | undefined) =>
  useQuery<{ lesson: Lesson; blocks: LessonBlock[] }>({
    queryKey: ['lesson', lessonId],
    enabled: !!lessonId,
    queryFn: async () => {
      const { data: lesson, error: lErr } = await supabase
        .from('lessons')
        .select('*')
        .eq('id', lessonId!)
        .single();
      if (lErr) throw lErr;

      const { data: blocks, error: bErr } = await supabase
        .from('lesson_blocks')
        .select('*')
        .eq('lesson_id', lessonId!)
        .order('order_index');
      if (bErr) throw bErr;

      return { lesson, blocks };
    },
  });
