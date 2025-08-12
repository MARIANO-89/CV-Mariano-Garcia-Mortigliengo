import React from 'react';
import { cn } from '../../utils/cn';
import { Calendar, ExternalLink, Github, Globe } from 'lucide-react';
import { Project } from '../../types';

interface ProjectCardProps {
  project: Project;
  className?: string;
  variant?: 'default' | 'minimal' | 'featured';
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  className,
  variant = 'default'
}) => {
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short'
    };
    return date.toLocaleDateString('es-ES', options);
  };

  const getStatusColor = (status: string): string => {
    const statusMap: Record<string, string> = {
      'completed': 'bg-green-100 text-green-800',
      'completado': 'bg-green-100 text-green-800',
      'in_progress': 'bg-blue-100 text-blue-800',
      'en_progreso': 'bg-blue-100 text-blue-800',
      'planned': 'bg-yellow-100 text-yellow-800',
      'planeado': 'bg-yellow-100 text-yellow-800',
      'on_hold': 'bg-gray-100 text-gray-800',
      'pausado': 'bg-gray-100 text-gray-800'
    };
    
    return statusMap[status.toLowerCase()] || 'bg-gray-100 text-gray-800';
  };

  const getStatusText = (status: string): string => {
    const statusTextMap: Record<string, string> = {
      'completed': 'Completado',
      'completado': 'Completado',
      'in_progress': 'En Progreso',
      'en_progreso': 'En Progreso',
      'planned': 'Planeado',
      'planeado': 'Planeado',
      'on_hold': 'Pausado',
      'pausado': 'Pausado'
    };
    
    return statusTextMap[status.toLowerCase()] || status;
  };

  if (variant === 'minimal') {
    return (
      <div className={cn(
        'bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200',
        className
      )}>
        <div className="flex items-start justify-between mb-2">
          <h4 className="font-semibold text-gray-900">{project.title}</h4>
          <div className="flex space-x-2">
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <Github className="w-4 h-4" />
              </a>
            )}
            {project.demo && (
              <a
                href={project.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>
        
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {project.description}
        </p>
        
        {project.technologies && project.technologies.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {project.technologies.slice(0, 3).map((tech, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
              >
                {tech}
              </span>
            ))}
            {project.technologies.length > 3 && (
              <span className="text-xs text-gray-500 px-2 py-0.5">
                +{project.technologies.length - 3} más
              </span>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={cn(
      'bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300',
      variant === 'featured' && 'ring-2 ring-blue-500 ring-opacity-20',
      className
    )}>
      {/* Header */}
      <div className={cn(
        'p-6 border-b border-gray-100',
        variant === 'featured' && 'bg-gradient-to-r from-blue-50 to-indigo-50'
      )}>
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className={cn(
              'font-bold text-gray-900 mb-2',
              variant === 'featured' ? 'text-xl' : 'text-lg'
            )}>
              {project.title}
            </h3>
            
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>
                  {formatDate(project.startDate)} - {' '}
                  {project.endDate ? formatDate(project.endDate) : 'Presente'}
                </span>
              </div>
              
              <span className={cn(
                'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                getStatusColor(project.status)
              )}>
                {getStatusText(project.status)}
              </span>
            </div>
          </div>
          
          <div className="flex space-x-2 ml-4">
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                <Github className="w-4 h-4 mr-2" />
                Código
              </a>
            )}
            
            {project.demo && (
              <a
                href={project.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-3 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors"
              >
                <Globe className="w-4 h-4 mr-2" />
                Demo
              </a>
            )}
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-6">
        <p className="text-gray-700 leading-relaxed mb-4">
          {project.description}
        </p>
        
        {/* Key Features */}
        {project.keyFeatures && project.keyFeatures.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-gray-900 mb-2">Características principales:</h4>
            <ul className="space-y-1">
              {project.keyFeatures.map((feature, index) => (
                <li key={index} className="flex items-start space-x-2 text-sm text-gray-700">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {/* Technologies */}
        {project.technologies && project.technologies.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-2">Tecnologías utilizadas:</h4>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 hover:bg-gray-200 transition-colors"
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

export default ProjectCard;