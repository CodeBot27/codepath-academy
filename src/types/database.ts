export interface Profile {
  id: string;
  full_name: string | null;
  role: string;
  created_at: string;
}

export interface Track {
  id: string;
  title: string;
  description: string | null;
  order_index: number;
  published: boolean;
  created_at: string;
}

export interface Course {
  id: string;
  track_id: string;
  title: string;
  description: string | null;
  level: string | null;
  order_index: number;
  estimated_hours: number;
  thumbnail_url: string | null;
  published: boolean;
  created_at: string;
}

export interface Module {
  id: string;
  course_id: string;
  title: string;
  order_index: number;
  published: boolean;
}

export interface Lesson {
  id: string;
  module_id: string;
  title: string;
  lesson_type: string;
  estimated_minutes: number;
  order_index: number;
  published: boolean;
}

export interface LessonBlock {
  id: string;
  lesson_id: string;
  block_type: 'markdown' | 'video' | 'code' | 'checklist' | 'resources';
  content_json: Record<string, any>;
  order_index: number;
}

export interface LessonProgress {
  user_id: string;
  lesson_id: string;
  status: 'not_started' | 'in_progress' | 'completed';
  completed_at: string | null;
}

export interface ModuleWithLessons extends Module {
  lessons: (Lesson & { progress?: LessonProgress })[];
}

export interface CourseWithModules extends Course {
  modules: ModuleWithLessons[];
}
