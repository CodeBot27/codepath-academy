import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Lesson } from '@/types/database';

interface Neighbors {
  prev?: Lesson;
  next?: Lesson;
}

export const useLessonNeighbors = (lessonId: string | undefined) =>
  useQuery<Neighbors | null>({
    queryKey: ['lesson-neighbors', lessonId],
    enabled: !!lessonId,
    queryFn: async () => {
      if (!lessonId) return null;

      // first fetch the current lesson to know its module and order index
      const { data: current, error: curErr } = await supabase
        .from('lessons')
        .select('id,module_id,order_index')
        .eq('id', lessonId)
        .single();
      if (curErr || !current) throw curErr || new Error('Lesson not found');

      // fetch all lessons in same module ordered by order_index
      const { data: siblings, error: sibErr } = await supabase
        .from('lessons')
        .select('*')
        .eq('module_id', current.module_id)
        .order('order_index');
      if (sibErr) throw sibErr;

      if (!siblings || siblings.length === 0) {
        return { prev: undefined, next: undefined };
      }

      const idx = siblings.findIndex(l => l.id === lessonId);
      if (idx === -1) {
        return { prev: undefined, next: undefined };
      }

      const prev = idx > 0 ? siblings[idx - 1] : undefined;
      const next = idx < siblings.length - 1 ? siblings[idx + 1] : undefined;
      return { prev, next };
    },
  });
