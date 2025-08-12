import React from 'react';
import { cn } from '../../utils/cn';
import { Skill } from '../../types';

interface SkillsGridProps {
  skills: Skill[];
  className?: string;
  columns?: 1 | 2 | 3 | 4;
  showProgress?: boolean;
  variant?: 'default' | 'compact' | 'detailed';
}

const SkillsGrid: React.FC<SkillsGridProps> = ({
  skills,
  className,
  columns = 3,
  showProgress = true,
  variant = 'default'
}) => {
  const getSkillLevelPercentage = (level: string): number => {
    const levelMap: Record<string, number> = {
      'beginner': 25,
      'principiante': 25,
      'básico': 25,
      'basic': 25,
      'intermediate': 50,
      'intermedio': 50,
      'medio': 50,
      'advanced': 75,
      'avanzado': 75,
      'expert': 100,
      'experto': 100,
      'professional': 90,
      'profesional': 90
    };
    
    return levelMap[level.toLowerCase()] || 50;
  };

  const getSkillLevelColor = (level: string): string => {
    const percentage = getSkillLevelPercentage(level);
    if (percentage >= 90) return 'bg-green-500';
    if (percentage >= 75) return 'bg-blue-500';
    if (percentage >= 50) return 'bg-yellow-500';
    return 'bg-orange-500';
  };

  const getSkillLevelText = (level: string): string => {
    const lowerLevel = level.toLowerCase();
    if (lowerLevel.includes('expert') || lowerLevel.includes('experto') || lowerLevel.includes('professional') || lowerLevel.includes('profesional')) {
      return 'Experto';
    }
    if (lowerLevel.includes('advanced') || lowerLevel.includes('avanzado')) {
      return 'Avanzado';
    }
    if (lowerLevel.includes('intermediate') || lowerLevel.includes('intermedio') || lowerLevel.includes('medio')) {
      return 'Intermedio';
    }
    return 'Básico';
  };

  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
  };

  // Group skills by category
  const skillsByCategory = skills.reduce((acc, skill) => {
    const category = skill.category || 'General';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  if (variant === 'compact') {
    return (
      <div className={cn('space-y-6', className)}>
        {Object.entries(skillsByCategory).map(([category, categorySkills]) => (
          <div key={category}>
            <h4 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wider">
              {category}
            </h4>
            <div className="flex flex-wrap gap-2">
              {categorySkills.map((skill) => (
                <span
                  key={skill.id}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors"
                >
                  {skill.name}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={cn('space-y-6', className)}>
      {Object.entries(skillsByCategory).map(([category, categorySkills]) => (
        <div key={category}>
          <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <div className="w-1 h-6 bg-blue-600 rounded-full mr-3" />
            {category}
          </h4>
          
          <div className={cn('grid gap-4', gridCols[columns])}>
            {categorySkills.map((skill) => (
              <div
                key={skill.id}
                className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-2">
                  <h5 className="font-semibold text-gray-900">{skill.name}</h5>
                  {variant === 'detailed' && (
                    <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                      {getSkillLevelText(skill.level)}
                    </span>
                  )}
                </div>
                
                {showProgress && (
                  <div className="mb-2">
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                      <span>Nivel</span>
                      <span>{getSkillLevelPercentage(skill.level)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={cn(
                          'h-2 rounded-full transition-all duration-500 ease-out',
                          getSkillLevelColor(skill.level)
                        )}
                        style={{ width: `${getSkillLevelPercentage(skill.level)}%` }}
                      />
                    </div>
                  </div>
                )}
                
                {skill.description && variant === 'detailed' && (
                  <p className="text-sm text-gray-600 mt-2">
                    {skill.description}
                  </p>
                )}
                
                {skill.yearsOfExperience && variant === 'detailed' && (
                  <div className="flex items-center mt-2 text-xs text-gray-500">
                    <span>
                      {skill.yearsOfExperience} {skill.yearsOfExperience === 1 ? 'año' : 'años'} de experiencia
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SkillsGrid;