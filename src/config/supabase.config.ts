import { createClient } from '@supabase/supabase-js';

// Debugging - check if env variables are loaded
console.log('🔍 Checking environment variables:');
console.log('SUPABASE_URL:', process.env.SUPABASE_URL ? '✅ Found' : '❌ Missing');
console.log('SUPABASE_KEY:', process.env.SUPABASE_KEY ? '✅ Found' : '❌ Missing');

if (!process.env.SUPABASE_URL) {
  throw new Error('SUPABASE_URL is not defined in .env file');
}

if (!process.env.SUPABASE_KEY) {
  throw new Error('SUPABASE_KEY is not defined in .env file');
}

export const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);