-- Datos semilla para la aplicación CV Power BI de Mariano García Mortigliengo
-- Autor: MiniMax Agent
-- Fecha: 2025-08-12

-- =============================================
-- DATOS DEL PERFIL PRINCIPAL
-- =============================================

-- Insertar el perfil de Mariano García Mortigliengo
INSERT INTO cv_profiles (
  id, name, position, email, phone, location, linkedin, 
  bio_es, bio_en, is_active
) VALUES (
  '11111111-1111-1111-1111-111111111111',
  'Mariano García Mortigliengo',
  'Developer BI',
  'nano_carp@hotmail.com',
  '+34 675 688 410',
  'Santander, Cantabria',
  'marianogarciam',
  'Desarrollador especializado en Business Intelligence con amplia experiencia en análisis de datos, reporting financiero y desarrollo de dashboards. Experto en herramientas como Power BI, Looker Studio, Excel y sistemas ERP Oracle JD Edwards.',
  'Business Intelligence Developer with extensive experience in data analysis, financial reporting and dashboard development. Expert in tools like Power BI, Looker Studio, Excel and Oracle JD Edwards ERP systems.',
  true
) ON CONFLICT (id) DO UPDATE SET
  updated_at = NOW();

-- =============================================
-- EXPERIENCIA LABORAL
-- =============================================

INSERT INTO cv_experiences (
  profile_id, company_name, position, start_date, end_date, 
  description_es, description_en, is_current, order_index
) VALUES 
(
  '11111111-1111-1111-1111-111111111111',
  'Datua SA',
  'Developer BI',
  '2022-01-01',
  NULL,
  'Desarrollo y mantenimiento de soluciones de Business Intelligence, creación de dashboards interactivos, análisis de datos empresariales y optimización de procesos de reporting. Responsable del diseño e implementación de modelos de datos, desarrollo de métricas KPI y automatización de informes ejecutivos.',
  'Development and maintenance of Business Intelligence solutions, creation of interactive dashboards, business data analysis and optimization of reporting processes. Responsible for data model design and implementation, KPI metrics development and executive report automation.',
  true,
  1
),
(
  '11111111-1111-1111-1111-111111111111',
  'Decathlon SA',
  'Reporting Financiero',
  '2020-01-01',
  '2022-01-01',
  'Responsable del reporting financiero de la compañía, análisis de KPIs, creación de informes ejecutivos y soporte en la toma de decisiones estratégicas basadas en datos. Gestión de procesos de consolidación financiera, análisis de rentabilidad y desarrollo de dashboards de control de gestión.',
  'Responsible for company financial reporting, KPI analysis, creation of executive reports and support in strategic decision making based on data. Management of financial consolidation processes, profitability analysis and development of management control dashboards.',
  false,
  2
)
ON CONFLICT DO NOTHING;

-- =============================================
-- EDUCACIÓN
-- =============================================

INSERT INTO cv_education (
  profile_id, institution, degree, field_of_study, 
  description_es, description_en, order_index
) VALUES 
(
  '11111111-1111-1111-1111-111111111111',
  'Universidad',
  'Grado ADE',
  'Especialización en Finanzas',
  'Formación integral en administración y dirección de empresas con especialización en finanzas corporativas, análisis financiero y gestión de riesgos. Conocimientos avanzados en contabilidad, fiscalidad, marketing y recursos humanos.',
  'Comprehensive training in business administration and management with specialization in corporate finance, financial analysis and risk management. Advanced knowledge in accounting, taxation, marketing and human resources.',
  1
),
(
  '11111111-1111-1111-1111-111111111111',
  'Centro de Formación Profesional',
  'FPII',
  'Comercio Internacional',
  'Formación profesional especializada en comercio internacional, logística, gestión aduanera y operaciones de importación/exportación. Conocimientos en documentación comercial, transporte internacional y normativas de comercio exterior.',
  'Professional training specialized in international trade, logistics, customs management and import/export operations. Knowledge in commercial documentation, international transport and foreign trade regulations.',
  2
)
ON CONFLICT DO NOTHING;

-- =============================================
-- CERTIFICACIONES
-- =============================================

INSERT INTO cv_certifications (
  profile_id, name, issuer, 
  description_es, description_en, order_index
) VALUES 
(
  '11111111-1111-1111-1111-111111111111',
  'Power BI Data Analyst',
  'Microsoft (Examen PL-300)',
  'Certificación oficial de Microsoft que valida las competencias en análisis de datos, modelado de datos, visualización y creación de dashboards con Power BI. Incluye dominio de DAX, Power Query, y mejores prácticas de desarrollo.',
  'Official Microsoft certification that validates competencies in data analysis, data modeling, visualization and dashboard creation with Power BI. Includes mastery of DAX, Power Query, and development best practices.',
  1
),
(
  '11111111-1111-1111-1111-111111111111',
  'Data Analyst',
  'CoderHouse',
  'Certificación en análisis de datos que incluye técnicas de manipulación de datos, estadística aplicada, visualización de datos y herramientas de business intelligence. Formación práctica con casos reales de negocio.',
  'Data analysis certification including data manipulation techniques, applied statistics, data visualization and business intelligence tools. Practical training with real business cases.',
  2
)
ON CONFLICT DO NOTHING;

-- =============================================
-- IDIOMAS
-- =============================================

INSERT INTO cv_languages (
  profile_id, language, proficiency, order_index
) VALUES 
(
  '11111111-1111-1111-1111-111111111111',
  'Español',
  'Nativo',
  1
),
(
  '11111111-1111-1111-1111-111111111111',
  'Inglés',
  'B2',
  2
)
ON CONFLICT DO NOTHING;

-- =============================================
-- HABILIDADES TÉCNICAS
-- =============================================

INSERT INTO cv_skills (
  profile_id, skill_name, category, proficiency_level, 
  description_es, description_en, order_index
) VALUES 
(
  '11111111-1111-1111-1111-111111111111',
  'Power BI',
  'Business Intelligence',
  'Experto',
  'Desarrollo de dashboards interactivos, modelado de datos, DAX, Power Query y administración de servicios Power BI.',
  'Development of interactive dashboards, data modeling, DAX, Power Query and Power BI services administration.',
  1
),
(
  '11111111-1111-1111-1111-111111111111',
  'Looker Studio',
  'Business Intelligence',
  'Avanzado',
  'Creación de reportes y dashboards con Google Looker Studio, conectores de datos y visualizaciones interactivas.',
  'Creation of reports and dashboards with Google Looker Studio, data connectors and interactive visualizations.',
  2
),
(
  '11111111-1111-1111-1111-111111111111',
  'Excel',
  'Análisis de Datos',
  'Experto',
  'Análisis avanzado de datos, tablas dinámicas, macros VBA, funciones avanzadas y automatización de procesos.',
  'Advanced data analysis, pivot tables, VBA macros, advanced functions and process automation.',
  3
),
(
  '11111111-1111-1111-1111-111111111111',
  'Google Sheets',
  'Análisis de Datos',
  'Avanzado',
  'Análisis de datos colaborativo, fórmulas avanzadas, Apps Script y integración con APIs.',
  'Collaborative data analysis, advanced formulas, Apps Script and API integration.',
  4
),
(
  '11111111-1111-1111-1111-111111111111',
  'JD Edwards (Oracle)',
  'ERP',
  'Intermedio',
  'Manejo del sistema ERP Oracle JD Edwards para gestión empresarial y reporting financiero.',
  'Oracle JD Edwards ERP system management for business management and financial reporting.',
  5
),
(
  '11111111-1111-1111-1111-111111111111',
  'Qlik View',
  'Business Intelligence',
  'Básico',
  'Experiencia con repositorio Qlik View para consultas y análisis de datos empresariales.',
  'Experience with Qlik View repository for business data queries and analysis.',
  6
)
ON CONFLICT DO NOTHING;

-- =============================================
-- PROYECTOS DESTACADOS
-- =============================================

INSERT INTO cv_projects (
  profile_id, title, 
  description_es, description_en, 
  technologies_used, is_featured, order_index
) VALUES 
(
  '11111111-1111-1111-1111-111111111111',
  'Cuadro de Mando Empresa Pública de Vivienda',
  'Desarrollo de un dashboard integral para empresa pública de vivienda con indicadores personalizados para cada área operativa. El proyecto incluyó análisis de KPIs, métricas de gestión y reportes ejecutivos para la toma de decisiones estratégicas.',
  'Development of an integral dashboard for public housing company with customized indicators for each operational area. The project included KPI analysis, management metrics and executive reports for strategic decision making.',
  ARRAY['Power BI', 'Excel', 'SQL', 'DAX'],
  true,
  1
),
(
  '11111111-1111-1111-1111-111111111111',
  'Estudio de Cuota de Mercado y Análisis de Márgenes',
  'Análisis exhaustivo de cuota de mercado, cifras de venta, márgenes de beneficio y identificación de reductores de margen. Implementación de modelos predictivos y dashboards interactivos para el seguimiento de la competencia y optimización de estrategias comerciales.',
  'Comprehensive analysis of market share, sales figures, profit margins and identification of margin reducers. Implementation of predictive models and interactive dashboards for competition tracking and optimization of commercial strategies.',
  ARRAY['Looker Studio', 'Google Sheets', 'Power BI', 'Python'],
  true,
  2
)
ON CONFLICT DO NOTHING;

-- =============================================
-- DISEÑOS DE FONDO PREDEFINIDOS
-- =============================================

INSERT INTO background_designs (
  name, description_es, description_en, template_data, is_active, order_index
) VALUES 
(
  'Gradiente Azul Profesional',
  'Diseño elegante con gradiente azul perfecto para dashboards corporativos y reportes ejecutivos.',
  'Elegant design with blue gradient perfect for corporate dashboards and executive reports.',
  '{
    "type": "gradient",
    "colors": ["#1e3a8a", "#3b82f6", "#60a5fa"],
    "direction": "diagonal",
    "opacity": 0.9,
    "pattern": "subtle-grid",
    "overlay": {
      "enabled": true,
      "color": "#ffffff",
      "opacity": 0.1
    }
  }',
  true,
  1
),
(
  'Patrón Geométrico Moderno',
  'Fondo con patrones geométricos suaves ideal para presentaciones de business intelligence.',
  'Background with soft geometric patterns ideal for business intelligence presentations.',
  '{
    "type": "pattern",
    "baseColor": "#f8fafc",
    "accentColor": "#0ea5e9",
    "pattern": "hexagon",
    "size": "medium",
    "opacity": 0.1,
    "spacing": 40
  }',
  true,
  2
),
(
  'Malla de Datos Abstracta',
  'Diseño futurista con malla de datos perfecta para dashboards de analytics avanzados.',
  'Futuristic design with data mesh perfect for advanced analytics dashboards.',
  '{
    "type": "mesh",
    "colors": ["#0f172a", "#1e293b", "#334155"],
    "gridSize": 20,
    "glowEffect": true,
    "animation": "subtle",
    "nodes": {
      "enabled": true,
      "color": "#06b6d4",
      "size": 2
    }
  }',
  true,
  3
)
ON CONFLICT DO NOTHING;

-- =============================================
-- USUARIO ADMINISTRADOR PREDETERMINADO
-- =============================================

-- Nota: El user_id debe corresponder a un usuario autenticado en Supabase Auth
-- Este será configurado después de crear el primer usuario en la aplicación

COMMIT;
