// src/supabaseClient.js
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://gjuzeizuftkczdgnbmtx.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdqdXplaXp1ZnRrY3pkZ25ibXR4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQyNjkwOTAsImV4cCI6MjA3OTg0NTA5MH0.oZxxCe7evZcYHtSwptTpmAkHZLzSBzcf4j5pqU7TOls";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
