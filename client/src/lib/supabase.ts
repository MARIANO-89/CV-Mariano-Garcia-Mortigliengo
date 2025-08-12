import { createClient } from '@supabase/supabase-js'

// Supabase configuration
const supabaseUrl = 'https://tizqwspqahpdtwwjfryx.supabase.co/'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRpenF3c3BxYWhwZHR3d2pmcnl4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ5NTA1MDYsImV4cCI6MjA3MDUyNjUwNn0.RZU2ZPYvV0fnAmQ0-wQVpQj81lDLkfGsR18bHzZvyIs'

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Database types
export interface CVProfile {
  id: string
  created_at: string
  updated_at: string
  name: string
  position: string
  email: string
  phone?: string
  location?: string
  linkedin?: string
  profile_image_url?: string
  bio_es?: string
  bio_en?: string
  is_active: boolean
}

export interface CVExperience {
  id: string
  created_at: string
  updated_at: string
  profile_id: string
  company_name: string
  position: string
  start_date?: string
  end_date?: string
  description_es?: string
  description_en?: string
  is_current: boolean
  order_index: number
}

export interface CVEducation {
  id: string
  created_at: string
  updated_at: string
  profile_id: string
  institution: string
  degree: string
  field_of_study?: string
  graduation_date?: string
  description_es?: string
  description_en?: string
  order_index: number
}

export interface CVCertification {
  id: string
  created_at: string
  updated_at: string
  profile_id: string
  name: string
  issuer?: string
  issue_date?: string
  expiration_date?: string
  credential_id?: string
  credential_url?: string
  description_es?: string
  description_en?: string
  order_index: number
}

export interface CVLanguage {
  id: string
  created_at: string
  updated_at: string
  profile_id: string
  language: string
  proficiency: string
  order_index: number
}

export interface CVSkill {
  id: string
  created_at: string
  updated_at: string
  profile_id: string
  skill_name: string
  category?: string
  proficiency_level?: string
  years_experience?: number
  description_es?: string
  description_en?: string
  order_index: number
}

export interface CVProject {
  id: string
  created_at: string
  updated_at: string
  profile_id: string
  title: string
  description_es?: string
  description_en?: string
  technologies_used?: string[]
  project_url?: string
  start_date?: string
  end_date?: string
  is_featured: boolean
  order_index: number
}

export interface ColorAnalysisRequest {
  id: string
  created_at: string
  source_type: string
  source_url?: string
  file_name?: string
  analysis_results?: any
  extracted_colors?: any
  extracted_fonts?: any
  powerbi_theme_json?: any
  status: string
  error_message?: string
}

export interface BackgroundDesign {
  id: string
  created_at: string
  updated_at: string
  name: string
  description_es?: string
  description_en?: string
  template_data: any
  preview_image_url?: string
  is_active: boolean
  order_index: number
}

export interface AdminUser {
  id: string
  created_at: string
  updated_at: string
  user_id: string
  email: string
  is_admin: boolean
  is_active: boolean
  last_login?: string
}

export interface CompleteProfile extends CVProfile {
  experiences: CVExperience[]
  education: CVEducation[]
  certifications: CVCertification[]
  languages: CVLanguage[]
  skills: CVSkill[]
  projects: CVProject[]
}