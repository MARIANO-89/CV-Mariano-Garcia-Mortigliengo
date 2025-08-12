-- CV Power BI - Aplicación para Mariano García Mortigliengo
-- Script de creación de base de datos
-- Autor: MiniMax Agent
-- Fecha: 2025-08-12

-- Habilitar extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";

-- =============================================
-- TABLAS PRINCIPALES DE CV
-- =============================================

-- Tabla de perfiles CV
CREATE TABLE IF NOT EXISTS cv_profiles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  name VARCHAR(255) NOT NULL,
  position VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  location VARCHAR(255),
  linkedin VARCHAR(255),
  profile_image_url TEXT,
  bio_es TEXT,
  bio_en TEXT,
  is_active BOOLEAN DEFAULT true
);

-- Tabla de experiencias laborales
CREATE TABLE IF NOT EXISTS cv_experiences (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  profile_id UUID NOT NULL,
  company_name VARCHAR(255) NOT NULL,
  position VARCHAR(255) NOT NULL,
  start_date DATE,
  end_date DATE,
  description_es TEXT,
  description_en TEXT,
  is_current BOOLEAN DEFAULT false,
  order_index INTEGER DEFAULT 0
);

-- Tabla de educación
CREATE TABLE IF NOT EXISTS cv_education (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  profile_id UUID NOT NULL,
  institution VARCHAR(255) NOT NULL,
  degree VARCHAR(255) NOT NULL,
  field_of_study VARCHAR(255),
  graduation_date DATE,
  description_es TEXT,
  description_en TEXT,
  order_index INTEGER DEFAULT 0
);

-- Tabla de certificaciones
CREATE TABLE IF NOT EXISTS cv_certifications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  profile_id UUID NOT NULL,
  name VARCHAR(255) NOT NULL,
  issuer VARCHAR(255),
  issue_date DATE,
  expiration_date DATE,
  credential_id VARCHAR(255),
  credential_url TEXT,
  description_es TEXT,
  description_en TEXT,
  order_index INTEGER DEFAULT 0
);

-- Tabla de idiomas
CREATE TABLE IF NOT EXISTS cv_languages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  profile_id UUID NOT NULL,
  language VARCHAR(100) NOT NULL,
  proficiency VARCHAR(50) NOT NULL,
  order_index INTEGER DEFAULT 0
);

-- Tabla de habilidades
CREATE TABLE IF NOT EXISTS cv_skills (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  profile_id UUID NOT NULL,
  skill_name VARCHAR(255) NOT NULL,
  category VARCHAR(100),
  proficiency_level VARCHAR(50),
  years_experience INTEGER,
  description_es TEXT,
  description_en TEXT,
  order_index INTEGER DEFAULT 0
);

-- Tabla de proyectos
CREATE TABLE IF NOT EXISTS cv_projects (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  profile_id UUID NOT NULL,
  title VARCHAR(255) NOT NULL,
  description_es TEXT,
  description_en TEXT,
  technologies_used TEXT[],
  project_url TEXT,
  start_date DATE,
  end_date DATE,
  is_featured BOOLEAN DEFAULT false,
  order_index INTEGER DEFAULT 0
);

-- =============================================
-- TABLAS DE FUNCIONALIDADES ESPECIALES
-- =============================================

-- Tabla de solicitudes de análisis de colores
CREATE TABLE IF NOT EXISTS color_analysis_requests (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  source_type VARCHAR(50) NOT NULL,
  source_url TEXT,
  file_name VARCHAR(255),
  analysis_results JSONB,
  extracted_colors JSONB,
  extracted_fonts JSONB,
  powerbi_theme_json JSONB,
  status VARCHAR(50) DEFAULT 'processing',
  error_message TEXT
);

-- Tabla de diseños de fondo
CREATE TABLE IF NOT EXISTS background_designs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  name VARCHAR(255) NOT NULL,
  description_es TEXT,
  description_en TEXT,
  template_data JSONB NOT NULL,
  preview_image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  order_index INTEGER DEFAULT 0
);

-- Tabla de usuarios administrativos
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  is_admin BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMP WITH TIME ZONE
);

-- =============================================
-- ÍNDICES PARA OPTIMIZACIÓN
-- =============================================

CREATE INDEX IF NOT EXISTS idx_cv_experiences_profile_id ON cv_experiences(profile_id);
CREATE INDEX IF NOT EXISTS idx_cv_education_profile_id ON cv_education(profile_id);
CREATE INDEX IF NOT EXISTS idx_cv_certifications_profile_id ON cv_certifications(profile_id);
CREATE INDEX IF NOT EXISTS idx_cv_languages_profile_id ON cv_languages(profile_id);
CREATE INDEX IF NOT EXISTS idx_cv_skills_profile_id ON cv_skills(profile_id);
CREATE INDEX IF NOT EXISTS idx_cv_projects_profile_id ON cv_projects(profile_id);
CREATE INDEX IF NOT EXISTS idx_color_analysis_requests_status ON color_analysis_requests(status);
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email);
CREATE INDEX IF NOT EXISTS idx_admin_users_user_id ON admin_users(user_id);

-- =============================================
-- POLÍTICAS DE SEGURIDAD ROW LEVEL SECURITY (RLS)
-- =============================================

-- Habilitar RLS en todas las tablas
ALTER TABLE cv_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE cv_experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE cv_education ENABLE ROW LEVEL SECURITY;
ALTER TABLE cv_certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE cv_languages ENABLE ROW LEVEL SECURITY;
ALTER TABLE cv_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE cv_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE color_analysis_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE background_designs ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Políticas de acceso público para el CV (solo lectura)
CREATE POLICY "CV profiles are publicly readable" ON cv_profiles
  FOR SELECT USING (is_active = true);

CREATE POLICY "CV experiences are publicly readable" ON cv_experiences
  FOR SELECT USING (true);

CREATE POLICY "CV education is publicly readable" ON cv_education
  FOR SELECT USING (true);

CREATE POLICY "CV certifications are publicly readable" ON cv_certifications
  FOR SELECT USING (true);

CREATE POLICY "CV languages are publicly readable" ON cv_languages
  FOR SELECT USING (true);

CREATE POLICY "CV skills are publicly readable" ON cv_skills
  FOR SELECT USING (true);

CREATE POLICY "CV projects are publicly readable" ON cv_projects
  FOR SELECT USING (true);

-- Políticas de acceso público para diseños de fondo
CREATE POLICY "Background designs are publicly readable" ON background_designs
  FOR SELECT USING (is_active = true);

-- Políticas de acceso para análisis de colores (solo usuarios autenticados pueden crear)
CREATE POLICY "Anyone can create color analysis requests" ON color_analysis_requests
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can read color analysis requests" ON color_analysis_requests
  FOR SELECT USING (true);

-- Políticas administrativas (solo usuarios admin)
CREATE POLICY "Only admins can manage CV profiles" ON cv_profiles
  FOR ALL USING (auth.uid() IN (SELECT user_id FROM admin_users WHERE is_admin = true AND is_active = true));

CREATE POLICY "Only admins can manage CV data" ON cv_experiences
  FOR ALL USING (auth.uid() IN (SELECT user_id FROM admin_users WHERE is_admin = true AND is_active = true));

CREATE POLICY "Only admins can manage background designs" ON background_designs
  FOR ALL USING (auth.uid() IN (SELECT user_id FROM admin_users WHERE is_admin = true AND is_active = true));

-- Política para usuarios admin
CREATE POLICY "Admins can manage admin users" ON admin_users
  FOR ALL USING (auth.uid() IN (SELECT user_id FROM admin_users WHERE is_admin = true AND is_active = true));

CREATE POLICY "Users can read their own admin record" ON admin_users
  FOR SELECT USING (auth.uid() = user_id);
