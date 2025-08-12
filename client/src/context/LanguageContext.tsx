import React, { createContext, useContext, useEffect, useState } from 'react'

type Language = 'es' | 'en'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

// Translations
const translations = {
  es: {
    // Navigation
    'nav.home': 'Inicio',
    'nav.cv': 'CV',
    'nav.colorAnalysis': 'Análisis de Colores',
    'nav.backgroundDesign': 'Diseño de Fondos',
    'nav.admin': 'Administración',
    'nav.login': 'Iniciar Sesión',
    'nav.logout': 'Cerrar Sesión',
    
    // CV Section
    'cv.title': 'CV Profesional',
    'cv.contact': 'Contacto',
    'cv.experience': 'Experiencia',
    'cv.education': 'Educación',
    'cv.certifications': 'Certificaciones',
    'cv.languages': 'Idiomas',
    'cv.skills': 'Habilidades',
    'cv.projects': 'Proyectos',
    'cv.current': 'Actual',
    'cv.present': 'Presente',
    
    // Color Analysis
    'colorAnalysis.title': 'Analizador de Colores y Fuentes',
    'colorAnalysis.description': 'Analiza colores y fuentes de imágenes, PDFs y URLs para generar temas personalizados de Power BI',
    'colorAnalysis.uploadImage': 'Subir Imagen',
    'colorAnalysis.analyzeUrl': 'Analizar URL',
    'colorAnalysis.uploadPdf': 'Subir PDF',
    'colorAnalysis.analyze': 'Analizar',
    'colorAnalysis.results': 'Resultados del Análisis',
    'colorAnalysis.colors': 'Colores Detectados',
    'colorAnalysis.fonts': 'Fuentes Detectadas',
    'colorAnalysis.downloadTxt': 'Descargar TXT',
    'colorAnalysis.downloadJson': 'Descargar JSON Power BI',
    
    // Background Designer
    'backgroundDesigner.title': 'Diseñador de Fondos Power BI',
    'backgroundDesigner.description': 'Crea fondos personalizados para tus dashboards de Power BI',
    'backgroundDesigner.templates': 'Plantillas Predefinidas',
    'backgroundDesigner.customize': 'Personalizar',
    'backgroundDesigner.preview': 'Vista Previa',
    'backgroundDesigner.download': 'Descargar',
    'backgroundDesigner.format': 'Formato',
    'backgroundDesigner.resolution': 'Resolución',
    
    // Admin Panel
    'admin.title': 'Panel de Administración',
    'admin.dashboard': 'Dashboard',
    'admin.analytics': 'Analíticas',
    'admin.cvManagement': 'Gestión de CV',
    'admin.designsManagement': 'Gestión de Diseños',
    'admin.settings': 'Configuración',
    
    // Common
    'common.loading': 'Cargando...',
    'common.error': 'Error',
    'common.success': 'Éxito',
    'common.save': 'Guardar',
    'common.cancel': 'Cancelar',
    'common.edit': 'Editar',
    'common.delete': 'Eliminar',
    'common.add': 'Agregar',
    'common.update': 'Actualizar',
    'common.create': 'Crear',
    'common.back': 'Volver',
    'common.next': 'Siguiente',
    'common.previous': 'Anterior',
    'common.download': 'Descargar',
    'common.upload': 'Subir'
  },
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.cv': 'CV',
    'nav.colorAnalysis': 'Color Analysis',
    'nav.backgroundDesign': 'Background Design',
    'nav.admin': 'Administration',
    'nav.login': 'Login',
    'nav.logout': 'Logout',
    
    // CV Section
    'cv.title': 'Professional CV',
    'cv.contact': 'Contact',
    'cv.experience': 'Experience',
    'cv.education': 'Education',
    'cv.certifications': 'Certifications',
    'cv.languages': 'Languages',
    'cv.skills': 'Skills',
    'cv.projects': 'Projects',
    'cv.current': 'Current',
    'cv.present': 'Present',
    
    // Color Analysis
    'colorAnalysis.title': 'Color and Font Analyzer',
    'colorAnalysis.description': 'Analyze colors and fonts from images, PDFs and URLs to generate custom Power BI themes',
    'colorAnalysis.uploadImage': 'Upload Image',
    'colorAnalysis.analyzeUrl': 'Analyze URL',
    'colorAnalysis.uploadPdf': 'Upload PDF',
    'colorAnalysis.analyze': 'Analyze',
    'colorAnalysis.results': 'Analysis Results',
    'colorAnalysis.colors': 'Detected Colors',
    'colorAnalysis.fonts': 'Detected Fonts',
    'colorAnalysis.downloadTxt': 'Download TXT',
    'colorAnalysis.downloadJson': 'Download Power BI JSON',
    
    // Background Designer
    'backgroundDesigner.title': 'Power BI Background Designer',
    'backgroundDesigner.description': 'Create custom backgrounds for your Power BI dashboards',
    'backgroundDesigner.templates': 'Predefined Templates',
    'backgroundDesigner.customize': 'Customize',
    'backgroundDesigner.preview': 'Preview',
    'backgroundDesigner.download': 'Download',
    'backgroundDesigner.format': 'Format',
    'backgroundDesigner.resolution': 'Resolution',
    
    // Admin Panel
    'admin.title': 'Administration Panel',
    'admin.dashboard': 'Dashboard',
    'admin.analytics': 'Analytics',
    'admin.cvManagement': 'CV Management',
    'admin.designsManagement': 'Designs Management',
    'admin.settings': 'Settings',
    
    // Common
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.edit': 'Edit',
    'common.delete': 'Delete',
    'common.add': 'Add',
    'common.update': 'Update',
    'common.create': 'Create',
    'common.back': 'Back',
    'common.next': 'Next',
    'common.previous': 'Previous',
    'common.download': 'Download',
    'common.upload': 'Upload'
  }
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('es')

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language
    if (savedLanguage && (savedLanguage === 'es' || savedLanguage === 'en')) {
      setLanguage(savedLanguage)
    }
  }, [])

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang)
    localStorage.setItem('language', lang)
  }

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations.es] || key
  }

  return (
    <LanguageContext.Provider value={{
      language,
      setLanguage: handleSetLanguage,
      t
    }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}