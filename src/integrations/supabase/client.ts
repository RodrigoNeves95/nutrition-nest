// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://dhhkdfkymnzbwhyninbq.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRoaGtkZmt5bW56YndoeW5pbmJxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEzNTc0ODIsImV4cCI6MjA1NjkzMzQ4Mn0.JbCUbwgy6OtYkF9c7X5jRSDiks0INJMjGUBRiyePUG8";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);