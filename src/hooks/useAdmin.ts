import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

const useAdminMutation = <T extends Record<string, any>>(table: string, invalidateKey: string) => {
  const queryClient = useQueryClient();

  const create = useMutation({
    mutationFn: async (data: T) => {
      const { error } = await supabase.from(table).insert(data);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [invalidateKey] }),
  });

  const update = useMutation({
    mutationFn: async ({ id, ...data }: T & { id: string }) => {
      const { error } = await supabase.from(table).update(data).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [invalidateKey] }),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from(table).delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [invalidateKey] }),
  });

  return { create, update, remove };
};

export const useAdminTracks = () => useAdminMutation('tracks', 'tracks');
export const useAdminCourses = () => useAdminMutation('courses', 'courses');
export const useAdminModules = () => useAdminMutation('modules', 'course');
export const useAdminLessons = () => useAdminMutation('lessons', 'course');
export const useAdminBlocks = () => useAdminMutation('lesson_blocks', 'lesson');
