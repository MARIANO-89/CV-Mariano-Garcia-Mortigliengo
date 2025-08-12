# Mariano García Mortigliengo - CV Profesional

Aplicación web completa para mostrar el CV profesional de Mariano García Mortigliengo, BI Developer especializado en Power BI, con herramientas de análisis visual integradas.

## 🚀 Características

### ✨ CV Dashboard
- **Diseño Power BI**: Interfaz inspirada en dashboards de Power BI
- **Bilingüe**: Soporte completo para español e inglés
- **Responsive**: Optimizado para todos los dispositivos
- **Información completa**: Experiencia, educación, habilidades, proyectos, certificaciones e idiomas

### 🎨 Herramientas de Análisis Visual

#### Analizador de Colores y Fuentes
- Extracción de paletas de colores desde URLs, imágenes o PDFs
- Identificación automática de fuentes
- Descarga en formato TXT o JSON para Power BI
- Integración con temas de Power BI

#### Diseñador de Fondos Power BI
- 3 plantillas predefinidas (Moderno, Corporativo, Creativo)
- Personalización de colores en tiempo real
- Vista previa instantánea
- Descarga en PNG/JPG

### 🔐 Panel de Administración
- Autenticación segura con Supabase Auth
- Gestión completa de contenido
- Interfaz intuitiva para actualizaciones
- Control de traducciones

## 🛠️ Stack Tecnológico

### Frontend
- **React 18** con TypeScript
- **Vite** como bundler
- **Tailwind CSS** para estilos
- **Lucide React** para iconos
- **React Router DOM** para navegación

### Backend
- **Supabase** como Backend-as-a-Service
- **PostgreSQL** (Supabase Database)
- **Supabase Auth** para autenticación
- **Supabase Storage** para archivos
- **Edge Functions** para lógica de negocio

## 📁 Estructura del Proyecto

```
.
├── supabase/
│   ├── migrations/           # Scripts SQL de base de datos
│   └── functions/           # Edge Functions de Supabase
│       ├── get-cv-data/
│       ├── analyze-colors/
│       └── generate-background/
└── frontend/
    ├── public/             # Archivos estáticos
    ├── src/
    │   ├── components/     # Componentes React
    │   │   ├── CV/        # Componentes específicos del CV
    │   │   ├── layout/    # Header, Footer
    │   │   ├── ui/        # Componentes de UI
    │   │   └── auth/      # Componentes de autenticación
    │   ├── pages/         # Páginas principales
    │   ├── contexts/      # Contextos de React
    │   ├── hooks/         # Hooks personalizados
    │   ├── services/      # Servicios API
    │   ├── utils/         # Utilidades
    │   ├── types/         # Definiciones TypeScript
    │   └── config/        # Configuración
    └── package.json
```

## 🚀 Instalación y Desarrollo

### Prerrequisitos
- Node.js 18+ 
- npm o yarn
- Cuenta de Supabase (para el backend)

### Configuración del Backend (Supabase)

1. **Crear proyecto en Supabase**:
   - Ve a [supabase.com](https://supabase.com)
   - Crea un nuevo proyecto
   - Obtén tu `SUPABASE_URL` y `SUPABASE_ANON_KEY`

2. **Configurar base de datos**:
   ```bash
   # Instalar Supabase CLI
   npm install -g supabase
   
   # Aplicar migraciones
   supabase db push
   ```

3. **Desplegar Edge Functions**:
   ```bash
   # Desplegar todas las funciones
   supabase functions deploy get-cv-data
   supabase functions deploy analyze-colors  
   supabase functions deploy generate-background
   ```

### Configuración del Frontend

1. **Instalar dependencias**:
   ```bash
   cd frontend
   npm install
   ```

2. **Configurar variables de entorno**:
   ```bash
   # Copiar archivo de ejemplo
   cp .env.example .env
   
   # Editar .env con tus credenciales de Supabase
   VITE_SUPABASE_URL=tu-url-de-supabase
   VITE_SUPABASE_ANON_KEY=tu-anon-key-de-supabase
   ```

3. **Iniciar desarrollo**:
   ```bash
   npm run dev
   ```

4. **Construir para producción**:
   ```bash
   npm run build
   ```

## 🌐 Despliegue

### Opción 1: Vercel (Recomendado para Frontend)

```bash
# Instalar Vercel CLI
npm install -g vercel

# Desplegar
cd frontend
vercel
```

### Opción 2: Netlify

```bash
# Instalar Netlify CLI
npm install -g netlify-cli

# Construir y desplegar
cd frontend
npm run build
netlify deploy --prod --dir=dist
```

### Variables de Entorno en Producción

Configura estas variables en tu plataforma de despliegue:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## 📊 Base de Datos

### Tablas Principales

- `cv_profile` - Información personal y profesional
- `experience` - Experiencia laboral
- `education` - Educación y formación
- `skills` - Habilidades técnicas
- `projects` - Proyectos destacados
- `certifications` - Certificaciones profesionales
- `languages` - Idiomas
- `users` - Usuarios del sistema
- `translations` - Traducciones

### Datos de Ejemplo

La base de datos incluye datos de ejemplo para Mariano García Mortigliengo. Puedes actualizarlos desde el panel de administración.

## 🔐 Autenticación

El sistema utiliza Supabase Auth para la autenticación segura:

- **Login**: `/admin/login`
- **Dashboard**: `/admin`
- **Rutas protegidas** para administración

### Crear Usuario Administrador

```sql
-- En Supabase SQL Editor
INSERT INTO auth.users (email, password) 
VALUES ('admin@ejemplo.com', 'contraseña_segura');
```

## 🎨 Personalización

### Colores y Tema

El sistema usa Tailwind CSS con colores personalizados inspirados en Power BI:

```css
/* Colores principales */
--blue-600: #0078D4;    /* Power BI Blue */
--blue-700: #106EBE;
--yellow-400: #FFB900;  /* Power BI Yellow */
```

### Traduciones

Las traducciones se gestionan en `src/contexts/LanguageContext.tsx`. Para agregar nuevos idiomas:

1. Extender el tipo `Language`
2. Agregar traducciones al objeto `translations`
3. Actualizar la lógica de selección de idioma

## 📝 Scripts SQL

Todos los scripts de creación de base de datos están en `supabase/migrations/`:

- `20231027120000_initial_schema.sql` - Schema inicial
- Scripts adicionales para datos de ejemplo

## 🛠️ Herramientas de Desarrollo

### Linting y Formato

```bash
# Linting
npm run lint

# Tipo checking
npm run type-check
```

### Testing

```bash
# Tests unitarios
npm run test

# Coverage
npm run test:coverage
```

## 📞 Soporte

Para soporte técnico o preguntas:

- **Email**: mariano.garcia@ejemplo.com
- **LinkedIn**: [linkedin.com/in/mariano-garcia](https://linkedin.com/in/mariano-garcia)
- **GitHub**: [github.com/mariano-garcia](https://github.com/mariano-garcia)

## 📄 Licencia

© 2025 Mariano García Mortigliengo. Todos los derechos reservados.

Este proyecto es de uso personal y profesional para Mariano García Mortigliengo.

---

**Desarrollado con ❤️ usando React, TypeScript y Supabase**