import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://kwlsvdnzpndkwcqaejep.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt3bHN2ZG56cG5ka3djcWFlamVwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY3MzQyNDgsImV4cCI6MjA3MjMxMDI0OH0.P2j0GOBYSRvuF-Og93o3ONGU5C2mPNmyTBMCGldUy-A';

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Supabase URL or anonymous key is not provided.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
