import React from 'react';
import { cn } from '../../utils/cn';
import { Calendar, MapPin, Award, GraduationCap } from 'lucide-react';
import { Education } from '../../types';

interface EducationItemProps {
  education: Education;
  isLast?: boolean;
  className?: string;
  showTimeline?: boolean;
  compact?: boolean;
}

const EducationItem: React.FC<EducationItemProps> = ({
  education,
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

  const getGradeColor = (grade?: string): string => {
    if (!grade) return 'bg-gray-100 text-gray-700';
    const lowerGrade = grade.toLowerCase();
    if (lowerGrade.includes('excelente') || lowerGrade.includes('excellent') || lowerGrade.includes('magna')) {
      return 'bg-green-100 text-green-800';
    }
    if (lowerGrade.includes('notable') || lowerGrade.includes('cum laude')) {
      return 'bg-blue-100 text-blue-800';
    }
    return 'bg-gray-100 text-gray-700';
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
            <div className="w-4 h-4 bg-green-600 rounded-full border-4 border-white shadow-lg ring-2 ring-green-100" />
            
            {/* Timeline Line */}
            {!isLast && (
              <div className="w-0.5 h-full bg-gradient-to-b from-green-200 to-gray-200 mt-2" />
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
              {education.degree}
            </h4>
            
            {education.grade && (
              <span className={cn(
                'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                getGradeColor(education.grade)
              )}>
                <Award className="w-3 h-3 mr-1" />
                {education.grade}
              </span>
            )}
          </div>
          
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <GraduationCap className="w-4 h-4" />
              <span className="font-medium">{education.institution}</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4" />
              <span>
                {formatDate(education.startDate)} - {' '}
                {education.endDate ? formatDate(education.endDate) : 'En curso'}
              </span>
            </div>
            
            {education.location && (
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4" />
                <span>{education.location}</span>
              </div>
            )}
          </div>
        </div>
        
        {/* Field of Study */}
        {education.fieldOfStudy && (
          <div className="mb-3">
            <p className="text-sm text-gray-600">
              <span className="font-medium">Especialización:</span> {education.fieldOfStudy}
            </p>
          </div>
        )}
        
        {/* Description */}
        {education.description && (
          <div className="mb-4">
            <p className={cn(
              'text-gray-700 leading-relaxed',
              compact ? 'text-sm' : 'text-base'
            )}>
              {education.description}
            </p>
          </div>
        )}
        
        {/* Relevant Coursework */}
        {education.relevantCoursework && education.relevantCoursework.length > 0 && (
          <div className="mb-4">
            <h5 className="text-sm font-medium text-gray-900 mb-2">Materias relevantes:</h5>
            <div className="flex flex-wrap gap-2">
              {education.relevantCoursework.map((course, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 hover:bg-green-200 transition-colors"
                >
                  {course}
                </span>
              ))}
            </div>
          </div>
        )}
        
        {/* Achievements */}
        {education.achievements && education.achievements.length > 0 && (
          <div>
            <h5 className="text-sm font-medium text-gray-900 mb-2">Logros académicos:</h5>
            <ul className="space-y-1">
              {education.achievements.map((achievement, index) => (
                <li key={index} className="flex items-start space-x-2 text-sm text-gray-700">
                  <div className="w-1.5 h-1.5 bg-green-600 rounded-full mt-2 flex-shrink-0" />
                  <span>{achievement}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default EducationItem;