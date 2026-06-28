import { createBrowserClient } from "@supabase/ssr";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://kxceqlkfjvcsppplflfy.supabase.co";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt4Y2VxbGtmanZjc3NwcHBsZmx5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgzMTc3MzQsImV4cCI6MjA5Mzg5MzczNH0.iOqOebUWxBjiS9NyiDWrgt6EKe6-IxSi8epF91fo4mk";

export function createClient() {
  return createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}
