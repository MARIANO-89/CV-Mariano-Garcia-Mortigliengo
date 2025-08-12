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
- **LinkedIn**: [linkedin.com/in/mariano-garcia](https://linkedin.com/in/mariano-garcia)
- **GitHub**: [github.com/mariano-garcia](https://github.com/mariano-garcia)

## 📄 Licencia

© 2025 Mariano García Mortigliengo. Todos los derechos reservados.

Este proyecto es de uso personal y profesional para Mariano García Mortigliengo.

---

**Desarrollado con ❤️ usando React, TypeScript y Supabase**
