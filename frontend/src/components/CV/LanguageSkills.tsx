import React from 'react';
import { cn } from '../../utils/cn';
import { Globe, MessageCircle, FileText } from 'lucide-react';
import { Language } from '../../types';

interface LanguageSkillsProps {
  languages: Language[];
  className?: string;
  variant?: 'default' | 'compact' | 'detailed';
  showFlags?: boolean;
}

const LanguageSkills: React.FC<LanguageSkillsProps> = ({
  languages,
  className,
  variant = 'default',
  showFlags = true
}) => {
  const getProficiencyPercentage = (level: string): number => {
    const levelMap: Record<string, number> = {
      'a1': 20,
      'a2': 30,
      'b1': 50,
      'b2': 70,
      'c1': 85,
      'c2': 95,
      'native': 100,
      'nativo': 100,
      'beginner': 20,
      'principiante': 20,
      'elementary': 30,
      'elemental': 30,
      'intermediate': 50,
      'intermedio': 50,
      'upper_intermediate': 70,
      'intermedio_alto': 70,
      'advanced': 85,
      'avanzado': 85,
      'fluent': 95,
      'fluido': 95,
      'proficient': 90,
      'competente': 90
    };
    
    return levelMap[level.toLowerCase()] || 50;
  };

  const getProficiencyColor = (level: string): string => {
    const percentage = getProficiencyPercentage(level);
    if (percentage >= 95) return 'bg-green-500';
    if (percentage >= 80) return 'bg-blue-500';
    if (percentage >= 60) return 'bg-yellow-500';
    if (percentage >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getProficiencyText = (level: string): string => {
    const lowerLevel = level.toLowerCase();
    if (lowerLevel.includes('native') || lowerLevel.includes('nativo') || lowerLevel === 'c2') {
      return 'Nativo';
    }
    if (lowerLevel === 'c1' || lowerLevel.includes('fluent') || lowerLevel.includes('fluido')) {
      return 'Fluido';
    }
    if (lowerLevel === 'b2' || lowerLevel.includes('upper') || lowerLevel.includes('alto')) {
      return 'Avanzado';
    }
    if (lowerLevel === 'b1' || lowerLevel.includes('intermediate') || lowerLevel.includes('intermedio')) {
      return 'Intermedio';
    }
    if (lowerLevel === 'a2' || lowerLevel.includes('elementary') || lowerLevel.includes('elemental')) {
      return 'Elemental';
    }
    return 'Básico';
  };

  const getFlagEmoji = (language: string): string => {
    const flagMap: Record<string, string> = {
      'spanish': '🇪🇸',
      'español': '🇪🇸',
      'english': '🇺🇸',
      'inglés': '🇺🇸',
      'french': '🇫🇷',
      'francés': '🇫🇷',
      'german': '🇩🇪',
      'alemán': '🇩🇪',
      'italian': '🇮🇹',
      'italiano': '🇮🇹',
      'portuguese': '🇵🇹',
      'portugués': '🇵🇹',
      'chinese': '🇨🇳',
      'chino': '🇨🇳',
      'japanese': '🇯🇵',
      'japonés': '🇯🇵',
      'korean': '🇰🇷',
      'coreano': '🇰🇷',
      'arabic': '🇸🇦',
      'árabe': '🇸🇦',
      'russian': '🇷🇺',
      'ruso': '🇷🇺'
    };
    
    return flagMap[language.toLowerCase()] || '🌍';
  };

  if (variant === 'compact') {
    return (
      <div className={cn('flex flex-wrap gap-3', className)}>
        {languages.map((language) => (
          <div
            key={language.id}
            className="inline-flex items-center space-x-2 bg-white border border-gray-200 rounded-full px-4 py-2 hover:shadow-md transition-shadow"
          >
            {showFlags && (
              <span className="text-lg">{getFlagEmoji(language.name)}</span>
            )}
            <span className="font-medium text-gray-900">{language.name}</span>
            <span className="text-sm text-gray-600">({getProficiencyText(language.proficiency)})</span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={cn('grid gap-4', className)}>
      {languages.map((language) => (
        <div
          key={language.id}
          className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              {showFlags && (
                <span className="text-2xl">{getFlagEmoji(language.name)}</span>
              )}
              <div>
                <h4 className="text-lg font-semibold text-gray-900">{language.name}</h4>
                <p className="text-sm text-gray-600">
                  {getProficiencyText(language.proficiency)} ({language.proficiency.toUpperCase()})
                </p>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-sm font-medium text-gray-900">
                {getProficiencyPercentage(language.proficiency)}%
              </div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mb-4">
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className={cn(
                  'h-3 rounded-full transition-all duration-500 ease-out',
                  getProficiencyColor(language.proficiency)
                )}
                style={{ width: `${getProficiencyPercentage(language.proficiency)}%` }}
              />
            </div>
          </div>
          
          {variant === 'detailed' && (
            <div className="space-y-4">
              {/* Skills Breakdown */}
              <div className="grid grid-cols-2 gap-4">
                {language.speaking && (
                  <div className="flex items-center space-x-2">
                    <MessageCircle className="w-4 h-4 text-blue-600" />
                    <span className="text-sm text-gray-600">Oral:</span>
                    <span className="text-sm font-medium text-gray-900">{language.speaking}</span>
                  </div>
                )}
                
                {language.writing && (
                  <div className="flex items-center space-x-2">
                    <FileText className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-gray-600">Escrito:</span>
                    <span className="text-sm font-medium text-gray-900">{language.writing}</span>
                  </div>
                )}
                
                {language.reading && (
                  <div className="flex items-center space-x-2">
                    <Globe className="w-4 h-4 text-purple-600" />
                    <span className="text-sm text-gray-600">Lectura:</span>
                    <span className="text-sm font-medium text-gray-900">{language.reading}</span>
                  </div>
                )}
                
                {language.listening && (
                  <div className="flex items-center space-x-2">
                    <MessageCircle className="w-4 h-4 text-orange-600" />
                    <span className="text-sm text-gray-600">Comprensión:</span>
                    <span className="text-sm font-medium text-gray-900">{language.listening}</span>
                  </div>
                )}
              </div>
              
              {/* Certifications */}
              {language.certifications && language.certifications.length > 0 && (
                <div>
                  <h5 className="text-sm font-medium text-gray-900 mb-2">Certificaciones:</h5>
                  <div className="flex flex-wrap gap-2">
                    {language.certifications.map((cert, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {cert}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default LanguageSkills;