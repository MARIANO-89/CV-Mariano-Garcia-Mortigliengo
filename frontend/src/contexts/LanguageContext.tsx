import React, { createContext, useContext, useState, useEffect } from 'react';

interface LanguageContextType {
  currentLanguage: 'es' | 'en';
  setLanguage: (language: 'es' | 'en') => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translation keys
const translations = {
  es: {
    // Common
    'common.loading': 'Cargando...',
    'common.error': 'Error',
    'common.retry': 'Reintentar',
    'common.save': 'Guardar',
    'common.cancel': 'Cancelar',
    'common.delete': 'Eliminar',
    'common.edit': 'Editar',
    'common.add': 'Añadir',
    'common.close': 'Cerrar',
    'common.search': 'Buscar',
    'common.filter': 'Filtrar',
    'common.sort': 'Ordenar',
    'common.downloadCV': 'Descargar CV',
    'common.downloadPortfolio': 'Descargar Portfolio',
    'common.viewAll': 'Ver todo',
    'common.showMore': 'Ver más',
    'common.showLess': 'Ver menos',
    'common.languages': 'Idiomas',
    'common.spanish': 'Español',
    'common.english': 'Inglés',
    
    // Navigation
    'nav.home': 'Inicio',
    'nav.about': 'Acerca de',
    'nav.experience': 'Experiencia',
    'nav.projects': 'Proyectos',
    'nav.tools': 'Herramientas',
    'nav.contact': 'Contacto',
    'nav.admin': 'Administración',
    'nav.colorAnalyzer': 'Analizador de Colores',
    'nav.backgroundDesigner': 'Diseñador de Fondos',
    
    // Sections
    'sections.contact': 'Información de Contacto',
    'sections.experience': 'Experiencia Profesional',
    'sections.education': 'Educación',
    'sections.skills': 'Habilidades Técnicas',
    'sections.projects': 'Proyectos Destacados',
    'sections.certifications': 'Certificaciones',
    'sections.languages': 'Idiomas',
    'sections.profile': 'Perfil Profesional',
    
    // Projects
    'projects.total': 'proyectos',
    'projects.viewAll': 'Ver todos los proyectos',
    'projects.more': 'más',
    'projects.completed': 'Completado',
    'projects.inProgress': 'En Progreso',
    'projects.planned': 'Planeado',
    'projects.onHold': 'Pausado',
    
    // Skills
    'skills.beginner': 'Principiante',
    'skills.intermediate': 'Intermedio',
    'skills.advanced': 'Avanzado',
    'skills.expert': 'Experto',
    'skills.years': 'años de experiencia',
    'skills.year': 'año de experiencia',
    
    // Languages
    'languages.native': 'Nativo',
    'languages.fluent': 'Fluido',
    'languages.advanced': 'Avanzado',
    'languages.intermediate': 'Intermedio',
    'languages.beginner': 'Principiante',
    'languages.speaking': 'Oral',
    'languages.writing': 'Escrito',
    'languages.reading': 'Lectura',
    'languages.listening': 'Comprensión',
    
    // Certifications
    'certifications.valid': 'Vigente',
    'certifications.expired': 'Vencida',
    'certifications.expiringSoon': 'Próxima a vencer',
    'certifications.noExpiration': 'Sin vencimiento',
    'certifications.issued': 'Emitida',
    'certifications.expires': 'Vence',
    'certifications.expiredDate': 'Venció',
    'certifications.credentialId': 'ID de Credencial',
    'certifications.skillsValidated': 'Habilidades validadas',
    'certifications.requirementsCompleted': 'Requisitos completados',
    
    // Tools
    'tools.colorAnalyzer.title': 'Analizador de Colores y Fuentes',
    'tools.colorAnalyzer.description': 'Extrae paletas de colores y fuentes de URLs, imágenes o PDFs',
    'tools.backgroundDesigner.title': 'Diseñador de Fondos Power BI',
    'tools.backgroundDesigner.description': 'Crea fondos personalizados para tus dashboards',
    
    // Admin
    'admin.dashboard': 'Panel de Administración',
    'admin.profile': 'Perfil',
    'admin.experience': 'Experiencia',
    'admin.education': 'Educación',
    'admin.skills': 'Habilidades',
    'admin.projects': 'Proyectos',
    'admin.certifications': 'Certificaciones',
    'admin.languages': 'Idiomas',
    'admin.login': 'Iniciar Sesión',
    'admin.logout': 'Cerrar Sesión',
    
    // Errors
    'error.loadingData': 'Error al cargar los datos',
    'error.noProfile': 'No se encontró información de perfil',
    'error.networkError': 'Error de conexión',
    'error.unauthorized': 'No autorizado',
    'error.notFound': 'No encontrado',
    'error.serverError': 'Error del servidor',
    
    // Footer
    'footer.copyright': 'Todos los derechos reservados',
    'footer.developedWith': 'Desarrollado con',
    'footer.version': 'Versión'
  },
  en: {
    // Common
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.retry': 'Retry',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.add': 'Add',
    'common.close': 'Close',
    'common.search': 'Search',
    'common.filter': 'Filter',
    'common.sort': 'Sort',
    'common.downloadCV': 'Download CV',
    'common.downloadPortfolio': 'Download Portfolio',
    'common.viewAll': 'View All',
    'common.showMore': 'Show More',
    'common.showLess': 'Show Less',
    'common.languages': 'Languages',
    'common.spanish': 'Spanish',
    'common.english': 'English',
    
    // Navigation
    'nav.home': 'Home',
    'nav.about': 'About',
    'nav.experience': 'Experience',
    'nav.projects': 'Projects',
    'nav.tools': 'Tools',
    'nav.contact': 'Contact',
    'nav.admin': 'Admin',
    'nav.colorAnalyzer': 'Color Analyzer',
    'nav.backgroundDesigner': 'Background Designer',
    
    // Sections
    'sections.contact': 'Contact Information',
    'sections.experience': 'Professional Experience',
    'sections.education': 'Education',
    'sections.skills': 'Technical Skills',
    'sections.projects': 'Featured Projects',
    'sections.certifications': 'Certifications',
    'sections.languages': 'Languages',
    'sections.profile': 'Professional Profile',
    
    // Projects
    'projects.total': 'projects',
    'projects.viewAll': 'View all projects',
    'projects.more': 'more',
    'projects.completed': 'Completed',
    'projects.inProgress': 'In Progress',
    'projects.planned': 'Planned',
    'projects.onHold': 'On Hold',
    
    // Skills
    'skills.beginner': 'Beginner',
    'skills.intermediate': 'Intermediate',
    'skills.advanced': 'Advanced',
    'skills.expert': 'Expert',
    'skills.years': 'years of experience',
    'skills.year': 'year of experience',
    
    // Languages
    'languages.native': 'Native',
    'languages.fluent': 'Fluent',
    'languages.advanced': 'Advanced',
    'languages.intermediate': 'Intermediate',
    'languages.beginner': 'Beginner',
    'languages.speaking': 'Speaking',
    'languages.writing': 'Writing',
    'languages.reading': 'Reading',
    'languages.listening': 'Listening',
    
    // Certifications
    'certifications.valid': 'Valid',
    'certifications.expired': 'Expired',
    'certifications.expiringSoon': 'Expiring Soon',
    'certifications.noExpiration': 'No Expiration',
    'certifications.issued': 'Issued',
    'certifications.expires': 'Expires',
    'certifications.expiredDate': 'Expired',
    'certifications.credentialId': 'Credential ID',
    'certifications.skillsValidated': 'Skills Validated',
    'certifications.requirementsCompleted': 'Requirements Completed',
    
    // Tools
    'tools.colorAnalyzer.title': 'Color and Font Analyzer',
    'tools.colorAnalyzer.description': 'Extract color palettes and fonts from URLs, images or PDFs',
    'tools.backgroundDesigner.title': 'Power BI Background Designer',
    'tools.backgroundDesigner.description': 'Create custom backgrounds for your dashboards',
    
    // Admin
    'admin.dashboard': 'Admin Dashboard',
    'admin.profile': 'Profile',
    'admin.experience': 'Experience',
    'admin.education': 'Education',
    'admin.skills': 'Skills',
    'admin.projects': 'Projects',
    'admin.certifications': 'Certifications',
    'admin.languages': 'Languages',
    'admin.login': 'Sign In',
    'admin.logout': 'Sign Out',
    
    // Errors
    'error.loadingData': 'Error loading data',
    'error.noProfile': 'Profile information not found',
    'error.networkError': 'Network error',
    'error.unauthorized': 'Unauthorized',
    'error.notFound': 'Not found',
    'error.serverError': 'Server error',
    
    // Footer
    'footer.copyright': 'All rights reserved',
    'footer.developedWith': 'Developed with',
    'footer.version': 'Version'
  }
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState<'es' | 'en'>('es');

  // Load language from localStorage on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as 'es' | 'en';
    if (savedLanguage && (savedLanguage === 'es' || savedLanguage === 'en')) {
      setCurrentLanguage(savedLanguage);
    }
  }, []);

  const setLanguage = (language: 'es' | 'en') => {
    setCurrentLanguage(language);
    localStorage.setItem('language', language);
  };

  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = translations[currentLanguage];
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        // Fallback to Spanish if key not found in current language
        value = translations.es;
        for (const fallbackK of keys) {
          if (value && typeof value === 'object' && fallbackK in value) {
            value = value[fallbackK];
          } else {
            return key; // Return the key itself if not found
          }
        }
        break;
      }
    }
    
    return typeof value === 'string' ? value : key;
  };

  return (
    <LanguageContext.Provider value={{ currentLanguage, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};