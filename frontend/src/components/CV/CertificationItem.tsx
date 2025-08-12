import React from 'react';
import { cn } from '../../utils/cn';
import { Calendar, Award, ExternalLink, CheckCircle } from 'lucide-react';
import { Certification } from '../../types';

interface CertificationItemProps {
  certification: Certification;
  isLast?: boolean;
  className?: string;
  showTimeline?: boolean;
  compact?: boolean;
}

const CertificationItem: React.FC<CertificationItemProps> = ({
  certification,
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

  const isExpired = (): boolean => {
    if (!certification.expirationDate) return false;
    return new Date(certification.expirationDate) < new Date();
  };

  const getExpirationStatus = (): { text: string; color: string } => {
    if (!certification.expirationDate) {
      return { text: 'Sin vencimiento', color: 'bg-green-100 text-green-800' };
    }
    
    const expDate = new Date(certification.expirationDate);
    const now = new Date();
    const diffTime = expDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return { text: 'Vencida', color: 'bg-red-100 text-red-800' };
    } else if (diffDays <= 30) {
      return { text: 'Próxima a vencer', color: 'bg-yellow-100 text-yellow-800' };
    } else {
      return { text: 'Vigente', color: 'bg-green-100 text-green-800' };
    }
  };

  const expirationStatus = getExpirationStatus();

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
            <div className={cn(
              'w-4 h-4 rounded-full border-4 border-white shadow-lg ring-2',
              isExpired() 
                ? 'bg-red-600 ring-red-100' 
                : 'bg-purple-600 ring-purple-100'
            )} />
            
            {/* Timeline Line */}
            {!isLast && (
              <div className="w-0.5 h-full bg-gradient-to-b from-purple-200 to-gray-200 mt-2" />
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
              {certification.name}
            </h4>
            
            <div className="flex items-center space-x-2">
              {certification.credentialUrl && (
                <a
                  href={certification.credentialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 transition-colors"
                  title="Ver credencial"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
              
              <span className={cn(
                'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                expirationStatus.color
              )}>
                <CheckCircle className="w-3 h-3 mr-1" />
                {expirationStatus.text}
              </span>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <Award className="w-4 h-4" />
              <span className="font-medium">{certification.issuer}</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4" />
              <span>
                Emitida: {formatDate(certification.issueDate)}
              </span>
            </div>
            
            {certification.expirationDate && (
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>
                  {isExpired() ? 'Venció:' : 'Vence:'} {formatDate(certification.expirationDate)}
                </span>
              </div>
            )}
          </div>
        </div>
        
        {/* Credential ID */}
        {certification.credentialId && (
          <div className="mb-3">
            <p className="text-sm text-gray-600">
              <span className="font-medium">ID de Credencial:</span> {certification.credentialId}
            </p>
          </div>
        )}
        
        {/* Description */}
        {certification.description && (
          <div className="mb-4">
            <p className={cn(
              'text-gray-700 leading-relaxed',
              compact ? 'text-sm' : 'text-base'
            )}>
              {certification.description}
            </p>
          </div>
        )}
        
        {/* Skills Validated */}
        {certification.skillsValidated && certification.skillsValidated.length > 0 && (
          <div className="mb-4">
            <h5 className="text-sm font-medium text-gray-900 mb-2">Habilidades validadas:</h5>
            <div className="flex flex-wrap gap-2">
              {certification.skillsValidated.map((skill, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 hover:bg-purple-200 transition-colors"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
        
        {/* Requirements */}
        {certification.requirements && certification.requirements.length > 0 && (
          <div>
            <h5 className="text-sm font-medium text-gray-900 mb-2">Requisitos completados:</h5>
            <ul className="space-y-1">
              {certification.requirements.map((requirement, index) => (
                <li key={index} className="flex items-start space-x-2 text-sm text-gray-700">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>{requirement}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default CertificationItem;