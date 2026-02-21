import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { LessonProgress } from '@/types/database';

export const useLessonProgress = (userId: string | undefined) =>
  useQuery<LessonProgress[]>({
    queryKey: ['lesson_progress', userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('lesson_progress')
        .select('*')
        .eq('user_id', userId!);
      if (error) throw error;
      return data;
    },
  });

export const useMarkLessonComplete = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ userId, lessonId }: { userId: string; lessonId: string }) => {
      const { error } = await supabase.from('lesson_progress').upsert(
        { user_id: userId, lesson_id: lessonId, status: 'completed', completed_at: new Date().toISOString() },
        { onConflict: 'user_id,lesson_id' }
      );
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lesson_progress'] });
    },
  });
};
