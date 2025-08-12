# Guía de Despliegue - Mariano García CV

## 🚀 Despliegue Completo en Producción

### Prerrequisitos

1. **Cuenta de Supabase** (gratis)
2. **Cuenta de Vercel/Netlify** (gratis)
3. **Node.js 18+** instalado localmente

---

## Paso 1: Configurar Supabase (Backend)

### 1.1 Crear Proyecto Supabase

```bash
# 1. Ve a https://supabase.com y crea una cuenta
# 2. Crea un nuevo proyecto
# 3. Anota tu URL y Anon Key
```

### 1.2 Configurar Base de Datos

```sql
-- En Supabase SQL Editor, ejecuta este script:
-- (Contenido del archivo supabase/migrations/20231027120000_initial_schema.sql)

-- Crear tablas
CREATE TABLE cv_profile (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name varchar(100) NOT NULL,
  last_name varchar(100) NOT NULL,
  title text NOT NULL,
  title_en text NOT NULL,
  summary text NOT NULL,
  summary_en text NOT NULL,
  email varchar(255) NOT NULL,
  phone varchar(20) NOT NULL,
  location varchar(255),
  website varchar(255),
  avatar text,
  linkedin_url varchar(255),
  github_url varchar(255),
  social_media jsonb DEFAULT '[]',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Insertar datos de ejemplo
INSERT INTO cv_profile (
  first_name, last_name, title, title_en, summary, summary_en,
  email, phone, location, website, linkedin_url, github_url
) VALUES (
  'Mariano', 'García Mortigliengo',
  'BI Developer especializado en Power BI',
  'BI Developer specialized in Power BI',
  'Profesional especializado en Business Intelligence con más de 5 años de experiencia en análisis de datos y desarrollo de dashboards interactivos con Power BI.',
  'Business Intelligence professional with over 5 years of experience in data analysis and interactive dashboard development with Power BI.',
  'mariano.garcia@email.com',
  '+54 11 1234 5678',
  'Buenos Aires, Argentina',
  'https://mariano-garcia-cv.vercel.app',
  'https://linkedin.com/in/mariano-garcia',
  'https://github.com/mariano-garcia'
);

-- Ejecutar todos los scripts de supabase/migrations/
```

### 1.3 Configurar Autenticación

```sql
-- Crear usuario administrador
INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, recovery_sent_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token, email_change, email_change_token_new, recovery_token)
VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'admin@ejemplo.com',
  crypt('tu_contraseña_segura', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{}',
  '{}',
  now(),
  now(),
  '',
  '',
  '',
  ''
);
```

### 1.4 Desplegar Edge Functions (Opcional)

```bash
# Instalar Supabase CLI
npm install -g supabase

# Login a Supabase
supabase login

# Enlazar proyecto
supabase link --project-ref TU_PROJECT_REF

# Desplegar funciones
supabase functions deploy get-cv-data
supabase functions deploy analyze-colors
supabase functions deploy generate-background
```

---

## Paso 2: Desplegar Frontend

### Opción A: Vercel (Recomendado)

#### 2.1 Preparar el Proyecto

```bash
# Instalar Vercel CLI
npm install -g vercel

# En la carpeta frontend/
cd frontend

# Construir el proyecto
npm run build
```

#### 2.2 Desplegar

```bash
# Iniciar despliegue
vercel

# Seguir las instrucciones:
# 1. Confirmar configuración
# 2. Seleccionar equipo (opcional)
# 3. Confirmar nombre del proyecto
```

#### 2.3 Configurar Variables de Entorno en Vercel

```bash
# Desde la dashboard de Vercel:
# 1. Ve a tu proyecto
# 2. Settings > Environment Variables
# 3. Agregar:

VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key-aqui
VITE_APP_NAME=Mariano García CV
VITE_APP_VERSION=1.0.0
```

#### 2.4 Re-desplegar con Variables

```bash
# Desde la terminal
vercel --prod
```

### Opción B: Netlify

#### 2.1 Desplegar via CLI

```bash
# Instalar Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Desde frontend/
cd frontend

# Construir
npm run build

# Desplegar
netlify deploy --prod --dir=dist
```

#### 2.2 Variables de Entorno en Netlify

```bash
# Desde Netlify dashboard:
# 1. Site settings > Environment variables
# 2. Agregar las mismas variables que en Vercel
```

---

## Paso 3: Configuración DNS (Opcional)

### 3.1 Dominio Personalizado

```bash
# En Vercel:
# 1. Project Settings > Domains
# 2. Add Domain: mariano-garcia.com
# 3. Configurar DNS según instrucciones

# En Netlify:
# 1. Site Settings > Domain management
# 2. Add custom domain
# 3. Configurar DNS
```

---

## Paso 4: Verificación y Pruebas

### 4.1 Lista de Verificación

- [ ] Sitio carga correctamente
- [ ] Cambio de idioma funciona (ES/EN)
- [ ] Todas las secciones muestran datos
- [ ] Enlaces externos funcionan
- [ ] Panel de administración accesible en `/admin/login`
- [ ] Login funciona con credenciales creadas
- [ ] Herramientas (Color Analyzer, Background Designer) cargan
- [ ] Responsive en móvil y desktop
- [ ] Performance adecuada (< 3s carga inicial)

### 4.2 Pruebas de Funcionalidad

```bash
# Probar diferentes dispositivos:
# - Desktop (Chrome, Firefox, Safari)
# - Móvil (iOS Safari, Android Chrome)
# - Tablet

# Probar funcionalidades:
# - Navegación
# - Cambio de idioma
# - Panel admin
# - Herramientas visuales
```

---

## Paso 5: Monitoreo y Mantenimiento

### 5.1 Analytics (Opcional)

```html
<!-- Google Analytics en index.html -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_TRACKING_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_TRACKING_ID');
</script>
```

### 5.2 Monitoreo de Errores

```bash
# Opciones:
# - Vercel Analytics (integrado)
# - Sentry para error tracking
# - LogRocket para session recording
```

### 5.3 Backup y Actualizaciones

```bash
# Backup de Supabase:
# 1. Database > Settings > Database
# 2. Download database backup

# Actualizar contenido:
# 1. Login al panel admin
# 2. Actualizar información
# 3. Los cambios se reflejan automáticamente
```

---

## 🛠️ Troubleshooting

### Problemas Comunes

#### Error: "Supabase connection failed"
```bash
# Verificar:
# 1. Variables de entorno correctas
# 2. URLs sin espacios extra
# 3. Anon key válido
# 4. Proyecto Supabase activo
```

#### Error: "Build failed"
```bash
# Ejecutar localmente:
cd frontend
npm install
npm run build

# Si funciona local, revisar variables en plataforma
```

#### Error: "Page not found"
```bash
# Verificar:
# 1. Routing configuration
# 2. Build directory (dist/)
# 3. Base URL configuration
```

### Logs y Debugging

```bash
# Vercel:
vercel logs

# Netlify:
netlify logs

# Supabase:
# Dashboard > Logs
```

---

## 🎉 ¡Listo!

Tu CV profesional ya está en línea. URLs de ejemplo:

- **Producción**: https://mariano-garcia-cv.vercel.app
- **Admin**: https://mariano-garcia-cv.vercel.app/admin
- **Herramientas**: 
  - https://mariano-garcia-cv.vercel.app/tools/color-analyzer
  - https://mariano-garcia-cv.vercel.app/tools/background-designer

### Siguientes Pasos

1. **Personalizar contenido** desde el panel admin
2. **Agregar proyectos** y certificaciones reales
3. **Optimizar SEO** con meta tags específicos
4. **Configurar dominio** personalizado
5. **Agregar analytics** para monitorear visitas

### Soporte

Para soporte técnico:
- **Email**: mariano.garcia@ejemplo.com
- **Documentación**: Ver README.md
- **Issues**: GitHub repository