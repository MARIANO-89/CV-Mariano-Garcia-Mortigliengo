const { pool } = require('./connection');
require('dotenv').config();

const createTables = async () => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    console.log('📋 Creando tablas de la base de datos...');
    
    // Enable UUID extension
    await client.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);
    
    // CV Profiles table
    await client.query(`
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
    `);
    
    // CV Experiences table
    await client.query(`
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
    `);
    
    // CV Education table
    await client.query(`
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
    `);
    
    // CV Certifications table
    await client.query(`
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
    `);
    
    // CV Languages table
    await client.query(`
      CREATE TABLE IF NOT EXISTS cv_languages (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        profile_id UUID NOT NULL,
        language VARCHAR(100) NOT NULL,
        proficiency VARCHAR(50) NOT NULL,
        order_index INTEGER DEFAULT 0
      );
    `);
    
    // CV Skills table
    await client.query(`
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
    `);
    
    // CV Projects table
    await client.query(`
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
    `);
    
    // Color Analysis Requests table
    await client.query(`
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
    `);
    
    // Background Designs table
    await client.query(`
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
    `);
    
    // Admin Users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS admin_users (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        user_id UUID NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        is_admin BOOLEAN DEFAULT false,
        is_active BOOLEAN DEFAULT true,
        last_login TIMESTAMP WITH TIME ZONE
      );
    `);
    
    // Create indexes
    console.log('🗿 Creando índices...');
    
    await client.query(`CREATE INDEX IF NOT EXISTS idx_cv_experiences_profile_id ON cv_experiences(profile_id);`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_cv_education_profile_id ON cv_education(profile_id);`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_cv_certifications_profile_id ON cv_certifications(profile_id);`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_cv_languages_profile_id ON cv_languages(profile_id);`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_cv_skills_profile_id ON cv_skills(profile_id);`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_cv_projects_profile_id ON cv_projects(profile_id);`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_color_analysis_requests_status ON color_analysis_requests(status);`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email);`);
    
    await client.query('COMMIT');
    console.log('✅ Tablas creadas exitosamente');
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Error creando tablas:', error);
    throw error;
  } finally {
    client.release();
  }
};

const initializeDatabase = async () => {
  try {
    await createTables();
    console.log('🎉 Base de datos inicializada correctamente');
  } catch (error) {
    console.error('❌ Error inicializando base de datos:', error);
    process.exit(1);
  }
};

// Run if called directly
if (require.main === module) {
  initializeDatabase().then(() => {
    process.exit(0);
  });
}

module.exports = {
  createTables,
  initializeDatabase
};