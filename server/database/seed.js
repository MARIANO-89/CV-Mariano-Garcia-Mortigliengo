const { pool } = require('./connection');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const seedData = async () => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    console.log('🌱 Insertando datos semilla...');
    
    // Check if profile already exists
    const existingProfile = await client.query('SELECT id FROM cv_profiles WHERE email = $1', ['nano_carp@hotmail.com']);
    
    let profileId;
    
    if (existingProfile.rows.length === 0) {
      // Insert CV Profile for Mariano García Mortigliengo
      const profileResult = await client.query(`
        INSERT INTO cv_profiles (
          name, position, email, phone, location, linkedin, 
          bio_es, bio_en, is_active
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING id;
      `, [
        'Mariano García Mortigliengo',
        'Developer BI',
        'nano_carp@hotmail.com',
        '+34 675 688 410',
        'Santander, Cantabria',
        'marianogarciam',
        'Desarrollador especializado en Business Intelligence con amplia experiencia en análisis de datos, reporting financiero y desarrollo de dashboards. Experto en herramientas como Power BI, Looker Studio, Excel y sistemas ERP Oracle JD Edwards.',
        'Business Intelligence Developer with extensive experience in data analysis, financial reporting and dashboard development. Expert in tools like Power BI, Looker Studio, Excel and Oracle JD Edwards ERP systems.',
        true
      ]);
      
      profileId = profileResult.rows[0].id;
      
      // Insert Experience data
      await client.query(`
        INSERT INTO cv_experiences (
          profile_id, company_name, position, start_date, end_date, 
          description_es, description_en, is_current, order_index
        ) VALUES 
        ($1, $2, $3, $4, $5, $6, $7, $8, $9),
        ($1, $10, $11, $12, $13, $14, $15, $16, $17)
      `, [
        profileId, 'Datua SA', 'Developer BI', '2022-01-01', null,
        'Desarrollo y mantenimiento de soluciones de Business Intelligence, creación de dashboards interactivos, análisis de datos empresariales y optimización de procesos de reporting.',
        'Development and maintenance of Business Intelligence solutions, creation of interactive dashboards, business data analysis and optimization of reporting processes.',
        true, 1,
        'Decathlon SA', 'Reporting Financiero', '2020-01-01', '2022-01-01',
        'Responsable del reporting financiero de la compañía, análisis de KPIs, creación de informes ejecutivos y soporte en la toma de decisiones estratégicas basadas en datos.',
        'Responsible for company financial reporting, KPI analysis, creation of executive reports and support in strategic decision making based on data.',
        false, 2
      ]);
      
      // Insert Education data
      await client.query(`
        INSERT INTO cv_education (
          profile_id, institution, degree, field_of_study, 
          description_es, description_en, order_index
        ) VALUES 
        ($1, $2, $3, $4, $5, $6, $7),
        ($1, $8, $9, $10, $11, $12, $13)
      `, [
        profileId, 'Universidad', 'Grado ADE', 'Especialización en Finanzas',
        'Formación integral en administración y dirección de empresas con especialización en finanzas corporativas, análisis financiero y gestión de riesgos.',
        'Comprehensive training in business administration and management with specialization in corporate finance, financial analysis and risk management.',
        1,
        'Centro de Formación Profesional', 'FPII', 'Comercio Internacional',
        'Formación profesional especializada en comercio internacional, logística, gestión aduanera y operaciones de importación/exportación.',
        'Professional training specialized in international trade, logistics, customs management and import/export operations.',
        2
      ]);
      
      // Insert Certifications
      await client.query(`
        INSERT INTO cv_certifications (
          profile_id, name, issuer, 
          description_es, description_en, order_index
        ) VALUES 
        ($1, $2, $3, $4, $5, $6),
        ($1, $7, $8, $9, $10, $11)
      `, [
        profileId, 'Power BI Data Analyst', 'Microsoft (Examen PL-300)',
        'Certificación oficial de Microsoft que valida las competencias en análisis de datos, modelado de datos, visualización y creación de dashboards con Power BI.',
        'Official Microsoft certification that validates competencies in data analysis, data modeling, visualization and dashboard creation with Power BI.',
        1,
        'Data Analyst', 'CoderHouse',
        'Certificación en análisis de datos que incluye técnicas de manipulación de datos, estadística aplicada, visualización de datos y herramientas de business intelligence.',
        'Data analysis certification including data manipulation techniques, applied statistics, data visualization and business intelligence tools.',
        2
      ]);
      
      // Insert Languages
      await client.query(`
        INSERT INTO cv_languages (
          profile_id, language, proficiency, order_index
        ) VALUES 
        ($1, $2, $3, $4),
        ($1, $5, $6, $7)
      `, [
        profileId, 'Español', 'Nativo', 1,
        'Inglés', 'B2', 2
      ]);
      
      // Insert Skills
      await client.query(`
        INSERT INTO cv_skills (
          profile_id, skill_name, category, proficiency_level, 
          description_es, description_en, order_index
        ) VALUES 
        ($1, $2, $3, $4, $5, $6, $7),
        ($1, $8, $9, $10, $11, $12, $13),
        ($1, $14, $15, $16, $17, $18, $19),
        ($1, $20, $21, $22, $23, $24, $25),
        ($1, $26, $27, $28, $29, $30, $31),
        ($1, $32, $33, $34, $35, $36, $37)
      `, [
        profileId, 'Power BI', 'Business Intelligence', 'Experto',
        'Desarrollo de dashboards interactivos, modelado de datos, DAX, Power Query y administración de servicios Power BI.',
        'Development of interactive dashboards, data modeling, DAX, Power Query and Power BI services administration.',
        1,
        'Looker Studio', 'Business Intelligence', 'Avanzado',
        'Creación de reportes y dashboards con Google Looker Studio, conectores de datos y visualizaciones interactivas.',
        'Creation of reports and dashboards with Google Looker Studio, data connectors and interactive visualizations.',
        2,
        'Excel', 'Análisis de Datos', 'Experto',
        'Análisis avanzado de datos, tablas dinámicas, macros VBA, funciones avanzadas y automatización de procesos.',
        'Advanced data analysis, pivot tables, VBA macros, advanced functions and process automation.',
        3,
        'Google Sheets', 'Análisis de Datos', 'Avanzado',
        'Análisis de datos colaborativo, fórmulas avanzadas, Apps Script y integración con APIs.',
        'Collaborative data analysis, advanced formulas, Apps Script and API integration.',
        4,
        'JD Edwards (Oracle)', 'ERP', 'Intermedio',
        'Manejo del sistema ERP Oracle JD Edwards para gestión empresarial y reporting financiero.',
        'Oracle JD Edwards ERP system management for business management and financial reporting.',
        5,
        'Qlik View', 'Business Intelligence', 'Básico',
        'Experiencia con repositorio Qlik View para consultas y análisis de datos empresariales.',
        'Experience with Qlik View repository for business data queries and analysis.',
        6
      ]);
      
      // Insert Projects
      await client.query(`
        INSERT INTO cv_projects (
          profile_id, title, 
          description_es, description_en, 
          technologies_used, is_featured, order_index
        ) VALUES 
        ($1, $2, $3, $4, $5, $6, $7),
        ($1, $8, $9, $10, $11, $12, $13)
      `, [
        profileId, 'Cuadro de Mando Empresa Pública de Vivienda',
        'Desarrollo de un dashboard integral para empresa pública de vivienda con indicadores personalizados para cada área operativa. El proyecto incluyó análisis de KPIs, métricas de gestión y reportes ejecutivos para la toma de decisiones estratégicas.',
        'Development of an integral dashboard for public housing company with customized indicators for each operational area. The project included KPI analysis, management metrics and executive reports for strategic decision making.',
        ['{"Power BI", "Excel", "SQL", "DAX"}'], true, 1,
        'Estudio de Cuota de Mercado y Análisis de Márgenes',
        'Análisis exhaustivo de cuota de mercado, cifras de venta, márgenes de beneficio y identificación de reductores de margen. Implementación de modelos predictivos y dashboards interactivos para el seguimiento de la competencia y optimización de estrategias comerciales.',
        'Comprehensive analysis of market share, sales figures, profit margins and identification of margin reducers. Implementation of predictive models and interactive dashboards for competition tracking and optimization of commercial strategies.',
        ['{"Looker Studio", "Google Sheets", "Power BI", "Python"}'], true, 2
      ]);
      
      console.log('✅ Perfil de Mariano García Mortigliengo creado exitosamente');
    } else {
      profileId = existingProfile.rows[0].id;
      console.log('ℹ️ Perfil de Mariano ya existe, saltando inserción');
    }
    
    // Create default admin user
    const adminEmail = process.env.ADMIN_EMAIL || 'nano_carp@hotmail.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
    
    const existingAdmin = await client.query('SELECT id FROM admin_users WHERE email = $1', [adminEmail]);
    
    if (existingAdmin.rows.length === 0) {
      const hashedPassword = await bcrypt.hash(adminPassword, 12);
      
      await client.query(`
        INSERT INTO admin_users (
          user_id, email, password_hash, is_admin, is_active
        ) VALUES ($1, $2, $3, $4, $5)
      `, [profileId, adminEmail, hashedPassword, true, true]);
      
      console.log('✅ Usuario administrador creado exitosamente');
      console.log(`📧 Email: ${adminEmail}`);
      console.log(`🔑 Password: ${adminPassword}`);
    } else {
      console.log('ℹ️ Usuario administrador ya existe, saltando creación');
    }
    
    // Insert default background designs
    const existingDesigns = await client.query('SELECT COUNT(*) FROM background_designs');
    
    if (parseInt(existingDesigns.rows[0].count) === 0) {
      await client.query(`
        INSERT INTO background_designs (
          name, description_es, description_en, template_data, is_active, order_index
        ) VALUES 
        ($1, $2, $3, $4, $5, $6),
        ($7, $8, $9, $10, $11, $12),
        ($13, $14, $15, $16, $17, $18)
      `, [
        'Gradiente Azul Profesional',
        'Diseño elegante con gradiente azul perfecto para dashboards corporativos y reportes ejecutivos.',
        'Elegant design with blue gradient perfect for corporate dashboards and executive reports.',
        JSON.stringify({
          type: 'gradient',
          colors: ['#1e3a8a', '#3b82f6', '#60a5fa'],
          direction: 'diagonal',
          opacity: 0.9,
          pattern: 'subtle-grid'
        }),
        true, 1,
        'Patrón Geométrico Moderno',
        'Fondo con patrones geométricos suaves ideal para presentaciones de business intelligence.',
        'Background with soft geometric patterns ideal for business intelligence presentations.',
        JSON.stringify({
          type: 'pattern',
          baseColor: '#f8fafc',
          accentColor: '#0ea5e9',
          pattern: 'hexagon',
          size: 'medium',
          opacity: 0.1
        }),
        true, 2,
        'Malla de Datos Abstracta',
        'Diseño futurista con malla de datos perfecta para dashboards de analytics avanzados.',
        'Futuristic design with data mesh perfect for advanced analytics dashboards.',
        JSON.stringify({
          type: 'mesh',
          colors: ['#0f172a', '#1e293b', '#334155'],
          gridSize: 20,
          glowEffect: true,
          animation: 'subtle'
        }),
        true, 3
      ]);
      
      console.log('✅ Diseños de fondo predeterminados creados');
    } else {
      console.log('ℹ️ Diseños de fondo ya existen, saltando creación');
    }
    
    await client.query('COMMIT');
    console.log('🎉 Datos semilla insertados correctamente');
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Error insertando datos semilla:', error);
    throw error;
  } finally {
    client.release();
  }
};

// Run if called directly
if (require.main === module) {
  seedData().then(() => {
    console.log('✅ Proceso de seeding completado');
    process.exit(0);
  }).catch((error) => {
    console.error('❌ Error en seeding:', error);
    process.exit(1);
  });
}

module.exports = {
  seedData
};