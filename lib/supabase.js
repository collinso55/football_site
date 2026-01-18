import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Create a dummy client if credentials are missing to prevent crashes
const createDummyClient = () => ({
    from: () => ({
        select: () => Promise.resolve({ data: [], error: null }),
        upsert: () => Promise.resolve({ data: null, error: new Error('Supabase credentials missing') }),
        insert: () => Promise.resolve({ data: null, error: new Error('Supabase credentials missing') }),
        in: () => ({ select: () => Promise.resolve({ data: [], error: null }) }),
    }),
});

export const supabase = (supabaseUrl && supabaseAnonKey)
    ? createClient(supabaseUrl, supabaseAnonKey)
    : createDummyClient();

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('⚠️ Supabase credentials missing. Predictions will not be available.');
}
