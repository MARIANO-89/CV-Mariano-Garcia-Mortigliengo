import React from 'react';
import { cn } from '../../utils/cn';
import { Calendar, MapPin, ExternalLink, Building } from 'lucide-react';
import { Experience } from '../../types';

interface ExperienceItemProps {
  experience: Experience;
  isLast?: boolean;
  className?: string;
  showTimeline?: boolean;
  compact?: boolean;
}

const ExperienceItem: React.FC<ExperienceItemProps> = ({
  experience,
  isLast = false,
  className,
  showTimeline = true,
  compact = false
}) => {
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short'
    };
    return date.toLocaleDateString('es-ES', options);
  };

  const calculateDuration = (startDate: string, endDate?: string): string => {
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : new Date();
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffMonths = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30));
    
    if (diffMonths < 12) {
      return `${diffMonths} ${diffMonths === 1 ? 'mes' : 'meses'}`;
    } else {
      const years = Math.floor(diffMonths / 12);
      const remainingMonths = diffMonths % 12;
      if (remainingMonths === 0) {
        return `${years} ${years === 1 ? 'año' : 'años'}`;
      }
      return `${years} ${years === 1 ? 'año' : 'años'} ${remainingMonths} ${remainingMonths === 1 ? 'mes' : 'meses'}`;
    }
  };

  return (
    <div className={cn(
      'relative flex',
      className
    )}>
      {/* Timeline */}
      {showTimeline && (
        <div className="flex-shrink-0 mr-6">
          <div className="flex flex-col items-center">
            {/* Timeline Dot */}
            <div className="w-4 h-4 bg-blue-600 rounded-full border-4 border-white shadow-lg ring-2 ring-blue-100" />
            
            {/* Timeline Line */}
            {!isLast && (
              <div className="w-0.5 h-full bg-gradient-to-b from-blue-200 to-gray-200 mt-2" />
            )}
          </div>
        </div>
      )}
      
      {/* Content */}
      <div className={cn(
        'flex-1 pb-8',
        !isLast && 'border-b border-gray-100'
      )}>
        {/* Header */}
        <div className="mb-3">
          <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
            <h4 className={cn(
              'font-semibold text-gray-900',
              compact ? 'text-base' : 'text-lg'
            )}>
              {experience.position}
            </h4>
            
            {experience.website && (
              <a
                href={experience.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>
          
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <Building className="w-4 h-4" />
              <span className="font-medium">{experience.company}</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4" />
              <span>
                {formatDate(experience.startDate)} - {' '}
                {experience.endDate ? formatDate(experience.endDate) : 'Presente'}
              </span>
              <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                {calculateDuration(experience.startDate, experience.endDate)}
              </span>
            </div>
            
            {experience.location && (
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4" />
                <span>{experience.location}</span>
              </div>
            )}
          </div>
        </div>
        
        {/* Description */}
        {experience.description && (
          <div className="mb-4">
            <p className={cn(
              'text-gray-700 leading-relaxed',
              compact ? 'text-sm' : 'text-base'
            )}>
              {experience.description}
            </p>
          </div>
        )}
        
        {/* Achievements */}
        {experience.achievements && experience.achievements.length > 0 && (
          <div className="mb-4">
            <h5 className="text-sm font-medium text-gray-900 mb-2">Logros destacados:</h5>
            <ul className="space-y-1">
              {experience.achievements.map((achievement, index) => (
                <li key={index} className="flex items-start space-x-2 text-sm text-gray-700">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                  <span>{achievement}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {/* Technologies */}
        {experience.technologies && experience.technologies.length > 0 && (
          <div>
            <h5 className="text-sm font-medium text-gray-900 mb-2">Tecnologías utilizadas:</h5>
            <div className="flex flex-wrap gap-2">
              {experience.technologies.map((tech, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExperienceItem;