import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://kyumpuaxobbylkqgtblq.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt5dW1wdWF4b2JieWxrcWd0YmxxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgwMTcxMTYsImV4cCI6MjA5MzU5MzExNn0.Ic3pjBJM6805XD8_IyvDh0-mhtJrVP8Haxxuwat7-Kk'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
