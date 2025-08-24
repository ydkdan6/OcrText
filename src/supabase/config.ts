import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://wzbyoummsslbttvbtijd.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind6YnlvdW1tc3NsYnR0dmJ0aWpkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI2NTkzMDcsImV4cCI6MjA2ODIzNTMwN30.tlAza9LGDcl5fCMxXNTY-tzOppILZdRX2nHs_OuVQuo';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
