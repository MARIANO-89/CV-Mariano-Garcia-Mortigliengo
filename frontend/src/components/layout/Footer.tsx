import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Heart, Code, Coffee } from 'lucide-react';

const Footer: React.FC = () => {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Mariano García Mortigliengo</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              BI Developer especializado en Power BI y análisis de datos. 
              Creando soluciones visuales que transforman datos en insights.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('nav.tools')}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a 
                  href="/tools/color-analyzer" 
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  {t('nav.colorAnalyzer')}
                </a>
              </li>
              <li>
                <a 
                  href="/tools/background-designer" 
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  {t('nav.backgroundDesigner')}
                </a>
              </li>
              <li>
                <a 
                  href="/admin" 
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  {t('nav.admin')}
                </a>
              </li>
            </ul>
          </div>

          {/* Contact & Social */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('sections.contact')}</h3>
            <div className="space-y-2 text-sm">
              <p className="text-gray-400">Buenos Aires, Argentina</p>
              <p className="text-gray-400">mariano.garcia@email.com</p>
              <div className="flex space-x-4 mt-4">
                <a 
                  href="https://linkedin.com/in/mariano-garcia" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  LinkedIn
                </a>
                <a 
                  href="https://github.com/mariano-garcia" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  GitHub
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-2 text-sm text-gray-400 mb-4 md:mb-0">
              <span>© {currentYear} Mariano García Mortigliengo.</span>
              <span>{t('footer.copyright')}</span>
            </div>
            
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <span>{t('footer.developedWith')}</span>
              <Heart className="w-4 h-4 text-red-500" />
              <span>React</span>
              <Code className="w-4 h-4" />
              <span>TypeScript</span>
              <Coffee className="w-4 h-4" />
              <span>y Supabase</span>
            </div>
          </div>
          
          <div className="text-center mt-4">
            <p className="text-xs text-gray-500">
              {t('footer.version')} 1.0.0 - Última actualización: Agosto 2025
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;