import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dvebzqsgblhqktskklhy.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR2ZWJ6cXNnYmxocWt0c2trbGh5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE2NzYxNDgsImV4cCI6MjA4NzI1MjE0OH0.H1yFqhyQz0NasmKKfVO_BxUcAtrvpygXFGSCukPet7M';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
