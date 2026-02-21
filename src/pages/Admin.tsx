import { useState } from 'react';
import { useAllTracks } from '@/hooks/useTracks';
import { useAllCourses } from '@/hooks/useCourse';
import { useAdminTracks, useAdminCourses, useAdminModules, useAdminLessons, useAdminBlocks } from '@/hooks/useAdmin';
import { supabase } from '@/lib/supabase';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, Save, X } from 'lucide-react';

// ====== Generic inline form helper ======
const InlineForm = ({ fields, onSave, onCancel, initial }: {
  fields: { name: string; label: string; type?: string }[];
  onSave: (data: Record<string, any>) => void;
  onCancel: () => void;
  initial?: Record<string, any>;
}) => {
  const [values, setValues] = useState<Record<string, any>>(initial || {});
  return (
    <div className="space-y-3 rounded-lg border border-primary/30 bg-card p-4">
      {fields.map(f => (
        <div key={f.name} className="space-y-1">
          <Label className="text-xs">{f.label}</Label>
          {f.type === 'textarea' ? (
            <textarea className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" rows={3}
              value={values[f.name] || ''} onChange={e => setValues({ ...values, [f.name]: e.target.value })} />
          ) : f.type === 'checkbox' ? (
            <input type="checkbox" checked={!!values[f.name]} onChange={e => setValues({ ...values, [f.name]: e.target.checked })} />
          ) : (
            <Input type={f.type || 'text'} value={values[f.name] || ''} onChange={e => setValues({ ...values, [f.name]: f.type === 'number' ? Number(e.target.value) : e.target.value })} />
          )}
        </div>
      ))}
      <div className="flex gap-2">
        <Button size="sm" onClick={() => onSave(values)}><Save className="mr-1 h-3 w-3" /> Save</Button>
        <Button size="sm" variant="ghost" onClick={onCancel}><X className="mr-1 h-3 w-3" /> Cancel</Button>
      </div>
    </div>
  );
};

// ====== Tracks Tab ======
const TracksAdmin = () => {
  const { data: tracks } = useAllTracks();
  const { create, update, remove } = useAdminTracks();
  const [editing, setEditing] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);

  const trackFields = [
    { name: 'title', label: 'Title' },
    { name: 'description', label: 'Description', type: 'textarea' as const },
    { name: 'order_index', label: 'Order', type: 'number' as const },
    { name: 'published', label: 'Published', type: 'checkbox' as const },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Tracks</h2>
        <Button size="sm" onClick={() => setAdding(true)}><Plus className="mr-1 h-3 w-3" /> Add Track</Button>
      </div>
      {adding && <InlineForm fields={trackFields} onCancel={() => setAdding(false)} onSave={async d => { await create.mutateAsync(d as any); setAdding(false); toast.success('Track created'); }} />}
      {tracks?.map(t => editing === t.id ? (
        <InlineForm key={t.id} fields={trackFields} initial={t} onCancel={() => setEditing(null)} onSave={async d => { await update.mutateAsync({ id: t.id, ...d } as any); setEditing(null); toast.success('Updated'); }} />
      ) : (
        <div key={t.id} className="flex items-center justify-between rounded-lg border border-border bg-card p-4">
          <div>
            <span className="font-medium">{t.title}</span>
            {t.published ? <Badge className="ml-2 bg-primary/20 text-primary text-xs">Published</Badge> : <Badge variant="secondary" className="ml-2 text-xs">Draft</Badge>}
          </div>
          <div className="flex gap-1">
            <Button size="icon" variant="ghost" onClick={() => setEditing(t.id)}><Pencil className="h-4 w-4" /></Button>
            <Button size="icon" variant="ghost" onClick={async () => { await remove.mutateAsync(t.id); toast.success('Deleted'); }}><Trash2 className="h-4 w-4 text-destructive" /></Button>
          </div>
        </div>
      ))}
    </div>
  );
};

// ====== Courses Tab ======
const CoursesAdmin = () => {
  const { data: courses } = useAllCourses();
  const { data: tracks } = useAllTracks();
  const { create, update, remove } = useAdminCourses();
  const [editing, setEditing] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);

  const courseFields = [
    { name: 'title', label: 'Title' },
    { name: 'description', label: 'Description', type: 'textarea' as const },
    { name: 'track_id', label: 'Track ID' },
    { name: 'level', label: 'Level (beginner/intermediate/advanced)' },
    { name: 'estimated_hours', label: 'Estimated Hours', type: 'number' as const },
    { name: 'order_index', label: 'Order', type: 'number' as const },
    { name: 'published', label: 'Published', type: 'checkbox' as const },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Courses</h2>
        <Button size="sm" onClick={() => setAdding(true)}><Plus className="mr-1 h-3 w-3" /> Add Course</Button>
      </div>
      {adding && <InlineForm fields={courseFields} onCancel={() => setAdding(false)} onSave={async d => { await create.mutateAsync(d as any); setAdding(false); toast.success('Course created'); }} />}
      {courses?.map(c => editing === c.id ? (
        <InlineForm key={c.id} fields={courseFields} initial={c} onCancel={() => setEditing(null)} onSave={async d => { await update.mutateAsync({ id: c.id, ...d } as any); setEditing(null); toast.success('Updated'); }} />
      ) : (
        <div key={c.id} className="flex items-center justify-between rounded-lg border border-border bg-card p-4">
          <div>
            <span className="font-medium">{c.title}</span>
            <span className="ml-2 text-xs text-muted-foreground">({tracks?.find(t => t.id === c.track_id)?.title || 'No track'})</span>
            {c.published ? <Badge className="ml-2 bg-primary/20 text-primary text-xs">Published</Badge> : <Badge variant="secondary" className="ml-2 text-xs">Draft</Badge>}
          </div>
          <div className="flex gap-1">
            <Button size="icon" variant="ghost" onClick={() => setEditing(c.id)}><Pencil className="h-4 w-4" /></Button>
            <Button size="icon" variant="ghost" onClick={async () => { await remove.mutateAsync(c.id); toast.success('Deleted'); }}><Trash2 className="h-4 w-4 text-destructive" /></Button>
          </div>
        </div>
      ))}
    </div>
  );
};

// ====== Modules Tab ======
const ModulesAdmin = () => {
  const queryClient = useQueryClient();
  const { data: courses } = useAllCourses();
  const [selectedCourse, setSelectedCourse] = useState<string>('');
  const { data: modules } = useQuery({
    queryKey: ['admin-modules', selectedCourse],
    enabled: !!selectedCourse,
    queryFn: async () => {
      const { data, error } = await supabase.from('modules').select('*').eq('course_id', selectedCourse).order('order_index');
      if (error) throw error;
      return data;
    },
  });
  const { create, update, remove } = useAdminModules();
  const [editing, setEditing] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);

  const modFields = [
    { name: 'title', label: 'Title' },
    { name: 'order_index', label: 'Order', type: 'number' as const },
    { name: 'published', label: 'Published', type: 'checkbox' as const },
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Modules</h2>
      <div className="space-y-1">
        <Label className="text-xs">Select Course</Label>
        <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={selectedCourse} onChange={e => setSelectedCourse(e.target.value)}>
          <option value="">-- Choose --</option>
          {courses?.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
        </select>
      </div>
      {selectedCourse && <Button size="sm" onClick={() => setAdding(true)}><Plus className="mr-1 h-3 w-3" /> Add Module</Button>}
      {adding && <InlineForm fields={modFields} onCancel={() => setAdding(false)} onSave={async d => { await create.mutateAsync({ ...d, course_id: selectedCourse } as any); setAdding(false); queryClient.invalidateQueries({ queryKey: ['admin-modules'] }); toast.success('Module created'); }} />}
      {modules?.map((m: any) => editing === m.id ? (
        <InlineForm key={m.id} fields={modFields} initial={m} onCancel={() => setEditing(null)} onSave={async d => { await update.mutateAsync({ id: m.id, ...d } as any); setEditing(null); queryClient.invalidateQueries({ queryKey: ['admin-modules'] }); toast.success('Updated'); }} />
      ) : (
        <div key={m.id} className="flex items-center justify-between rounded-lg border border-border bg-card p-3">
          <span className="font-medium">{m.title}</span>
          <div className="flex gap-1">
            <Button size="icon" variant="ghost" onClick={() => setEditing(m.id)}><Pencil className="h-4 w-4" /></Button>
            <Button size="icon" variant="ghost" onClick={async () => { await remove.mutateAsync(m.id); queryClient.invalidateQueries({ queryKey: ['admin-modules'] }); toast.success('Deleted'); }}><Trash2 className="h-4 w-4 text-destructive" /></Button>
          </div>
        </div>
      ))}
    </div>
  );
};

// ====== Lessons Tab ======
const LessonsAdmin = () => {
  const queryClient = useQueryClient();
  const { data: courses } = useAllCourses();
  const [selectedCourse, setSelectedCourse] = useState<string>('');
  const [selectedModule, setSelectedModule] = useState<string>('');

  const { data: modules } = useQuery({
    queryKey: ['admin-modules', selectedCourse],
    enabled: !!selectedCourse,
    queryFn: async () => {
      const { data, error } = await supabase.from('modules').select('*').eq('course_id', selectedCourse).order('order_index');
      if (error) throw error;
      return data;
    },
  });

  const { data: lessons } = useQuery({
    queryKey: ['admin-lessons', selectedModule],
    enabled: !!selectedModule,
    queryFn: async () => {
      const { data, error } = await supabase.from('lessons').select('*').eq('module_id', selectedModule).order('order_index');
      if (error) throw error;
      return data;
    },
  });

  const { create, update, remove } = useAdminLessons();
  const [editing, setEditing] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);

  const lessonFields = [
    { name: 'title', label: 'Title' },
    { name: 'estimated_minutes', label: 'Est. Minutes', type: 'number' as const },
    { name: 'order_index', label: 'Order', type: 'number' as const },
    { name: 'published', label: 'Published', type: 'checkbox' as const },
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Lessons</h2>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1">
          <Label className="text-xs">Course</Label>
          <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={selectedCourse} onChange={e => { setSelectedCourse(e.target.value); setSelectedModule(''); }}>
            <option value="">-- Choose --</option>
            {courses?.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
          </select>
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Module</Label>
          <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={selectedModule} onChange={e => setSelectedModule(e.target.value)}>
            <option value="">-- Choose --</option>
            {modules?.map((m: any) => <option key={m.id} value={m.id}>{m.title}</option>)}
          </select>
        </div>
      </div>
      {selectedModule && <Button size="sm" onClick={() => setAdding(true)}><Plus className="mr-1 h-3 w-3" /> Add Lesson</Button>}
      {adding && <InlineForm fields={lessonFields} onCancel={() => setAdding(false)} onSave={async d => { await create.mutateAsync({ ...d, module_id: selectedModule } as any); setAdding(false); queryClient.invalidateQueries({ queryKey: ['admin-lessons'] }); toast.success('Lesson created'); }} />}
      {lessons?.map((l: any) => editing === l.id ? (
        <InlineForm key={l.id} fields={lessonFields} initial={l} onCancel={() => setEditing(null)} onSave={async d => { await update.mutateAsync({ id: l.id, ...d } as any); setEditing(null); queryClient.invalidateQueries({ queryKey: ['admin-lessons'] }); toast.success('Updated'); }} />
      ) : (
        <div key={l.id} className="flex items-center justify-between rounded-lg border border-border bg-card p-3">
          <span className="font-medium">{l.title}</span>
          <div className="flex gap-1">
            <Button size="icon" variant="ghost" onClick={() => setEditing(l.id)}><Pencil className="h-4 w-4" /></Button>
            <Button size="icon" variant="ghost" onClick={async () => { await remove.mutateAsync(l.id); queryClient.invalidateQueries({ queryKey: ['admin-lessons'] }); toast.success('Deleted'); }}><Trash2 className="h-4 w-4 text-destructive" /></Button>
          </div>
        </div>
      ))}
    </div>
  );
};

// ====== Blocks Tab ======
const BlocksAdmin = () => {
  const queryClient = useQueryClient();
  const [lessonIdInput, setLessonIdInput] = useState('');
  const [lessonId, setLessonId] = useState('');

  const { data: blocks } = useQuery({
    queryKey: ['admin-blocks', lessonId],
    enabled: !!lessonId,
    queryFn: async () => {
      const { data, error } = await supabase.from('lesson_blocks').select('*').eq('lesson_id', lessonId).order('order_index');
      if (error) throw error;
      return data;
    },
  });

  const { create, update, remove } = useAdminBlocks();
  const [editing, setEditing] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);

  const blockFields = [
    { name: 'block_type', label: 'Type (markdown/video/code/resources/checklist)' },
    { name: 'content_json_str', label: 'Content JSON', type: 'textarea' as const },
    { name: 'order_index', label: 'Order', type: 'number' as const },
  ];

  const parseJson = (str: string) => {
    try { return JSON.parse(str); } catch { return null; }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Lesson Blocks</h2>
      <div className="flex gap-2">
        <Input placeholder="Paste lesson ID…" value={lessonIdInput} onChange={e => setLessonIdInput(e.target.value)} />
        <Button size="sm" onClick={() => setLessonId(lessonIdInput)}>Load</Button>
      </div>
      {lessonId && <Button size="sm" onClick={() => setAdding(true)}><Plus className="mr-1 h-3 w-3" /> Add Block</Button>}
      {adding && <InlineForm fields={blockFields} onCancel={() => setAdding(false)} onSave={async d => {
        const json = parseJson(d.content_json_str);
        if (!json) { toast.error('Invalid JSON'); return; }
        await create.mutateAsync({ block_type: d.block_type, content_json: json, order_index: d.order_index || 0, lesson_id: lessonId } as any);
        setAdding(false); queryClient.invalidateQueries({ queryKey: ['admin-blocks'] }); toast.success('Block created');
      }} />}
      {blocks?.map((b: any) => editing === b.id ? (
        <InlineForm key={b.id} fields={blockFields} initial={{ ...b, content_json_str: JSON.stringify(b.content_json, null, 2) }} onCancel={() => setEditing(null)} onSave={async d => {
          const json = parseJson(d.content_json_str);
          if (!json) { toast.error('Invalid JSON'); return; }
          await update.mutateAsync({ id: b.id, block_type: d.block_type, content_json: json, order_index: d.order_index } as any);
          setEditing(null); queryClient.invalidateQueries({ queryKey: ['admin-blocks'] }); toast.success('Updated');
        }} />
      ) : (
        <div key={b.id} className="rounded-lg border border-border bg-card p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">{b.block_type}</Badge>
              <span className="text-xs text-muted-foreground">order: {b.order_index}</span>
            </div>
            <div className="flex gap-1">
              <Button size="icon" variant="ghost" onClick={() => setEditing(b.id)}><Pencil className="h-4 w-4" /></Button>
              <Button size="icon" variant="ghost" onClick={async () => { await remove.mutateAsync(b.id); queryClient.invalidateQueries({ queryKey: ['admin-blocks'] }); toast.success('Deleted'); }}><Trash2 className="h-4 w-4 text-destructive" /></Button>
            </div>
          </div>
          <pre className="mt-2 max-h-32 overflow-auto rounded bg-muted/30 p-2 font-mono text-xs">{JSON.stringify(b.content_json, null, 2)}</pre>
        </div>
      ))}
    </div>
  );
};

// ====== Main Admin Page ======
const Admin = () => (
  <div className="container mx-auto px-4 py-12">
    <h1 className="mb-8 text-3xl font-bold">Admin Panel</h1>
    <Tabs defaultValue="tracks">
      <TabsList className="mb-6">
        <TabsTrigger value="tracks">Tracks</TabsTrigger>
        <TabsTrigger value="courses">Courses</TabsTrigger>
        <TabsTrigger value="modules">Modules</TabsTrigger>
        <TabsTrigger value="lessons">Lessons</TabsTrigger>
        <TabsTrigger value="blocks">Blocks</TabsTrigger>
      </TabsList>
      <TabsContent value="tracks"><TracksAdmin /></TabsContent>
      <TabsContent value="courses"><CoursesAdmin /></TabsContent>
      <TabsContent value="modules"><ModulesAdmin /></TabsContent>
      <TabsContent value="lessons"><LessonsAdmin /></TabsContent>
      <TabsContent value="blocks"><BlocksAdmin /></TabsContent>
    </Tabs>
  </div>
);

export default Admin;
