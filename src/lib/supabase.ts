import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Role = 'admin' | 'guru' | 'siswa';

export interface Profile {
  id: string;
  name: string;
  role: Role;
  class?: string;
  nis?: string;
}
