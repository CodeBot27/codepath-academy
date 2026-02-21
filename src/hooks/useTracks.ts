import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Track } from '@/types/database';

export const useTracks = () =>
  useQuery<Track[]>({
    queryKey: ['tracks'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tracks')
        .select('*')
        .eq('published', true)
        .order('order_index');
      if (error) throw error;
      return data;
    },
  });

export const useAllTracks = () =>
  useQuery<Track[]>({
    queryKey: ['tracks', 'all'],
    queryFn: async () => {
      const { data, error } = await supabase.from('tracks').select('*').order('order_index');
      if (error) throw error;
      return data;
    },
  });
