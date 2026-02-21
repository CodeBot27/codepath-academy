import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Course, CourseWithModules } from '@/types/database';

export const useCoursesByTrack = (trackId: string | undefined) =>
  useQuery<Course[]>({
    queryKey: ['courses', trackId],
    enabled: !!trackId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('track_id', trackId!)
        .eq('published', true)
        .order('order_index');
      if (error) throw error;
      return data;
    },
  });

export const useAllCourses = () =>
  useQuery<Course[]>({
    queryKey: ['courses', 'all'],
    queryFn: async () => {
      const { data, error } = await supabase.from('courses').select('*').order('order_index');
      if (error) throw error;
      return data;
    },
  });

export const useCourse = (courseId: string | undefined) =>
  useQuery<CourseWithModules>({
    queryKey: ['course', courseId],
    enabled: !!courseId,
    queryFn: async () => {
      const { data: course, error: cErr } = await supabase
        .from('courses')
        .select('*')
        .eq('id', courseId!)
        .single();
      if (cErr) throw cErr;

      const { data: modules, error: mErr } = await supabase
        .from('modules')
        .select('*')
        .eq('course_id', courseId!)
        .order('order_index');
      if (mErr) throw mErr;

      const moduleIds = modules.map((m: any) => m.id);
      const { data: lessons, error: lErr } = await supabase
        .from('lessons')
        .select('*')
        .in('module_id', moduleIds)
        .order('order_index');
      if (lErr) throw lErr;

      return {
        ...course,
        modules: modules.map((m: any) => ({
          ...m,
          lessons: lessons.filter((l: any) => l.module_id === m.id),
        })),
      } as CourseWithModules;
    },
  });
