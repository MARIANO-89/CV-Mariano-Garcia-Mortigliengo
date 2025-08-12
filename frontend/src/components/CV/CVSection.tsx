import React from 'react';
import { cn } from '../../utils/cn';

interface CVSectionProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
  variant?: 'default' | 'primary' | 'secondary' | 'accent';
}

const CVSection: React.FC<CVSectionProps> = ({
  title,
  subtitle,
  icon,
  children,
  className,
  headerClassName,
  contentClassName,
  variant = 'default'
}) => {
  const variantStyles = {
    default: {
      container: 'bg-white border border-gray-200 shadow-sm',
      header: 'bg-gray-50 border-b border-gray-200 text-gray-900',
      accent: 'bg-blue-600'
    },
    primary: {
      container: 'bg-white border border-blue-200 shadow-md',
      header: 'bg-gradient-to-r from-blue-600 to-blue-700 text-white',
      accent: 'bg-yellow-400'
    },
    secondary: {
      container: 'bg-white border border-gray-300 shadow-sm',
      header: 'bg-gradient-to-r from-gray-700 to-gray-800 text-white',
      accent: 'bg-blue-400'
    },
    accent: {
      container: 'bg-white border border-orange-200 shadow-md',
      header: 'bg-gradient-to-r from-orange-500 to-red-500 text-white',
      accent: 'bg-yellow-400'
    }
  };

  const currentVariant = variantStyles[variant];

  return (
    <div className={cn(
      'rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg',
      currentVariant.container,
      className
    )}>
      {/* Header Section */}
      <div className={cn(
        'px-6 py-4 flex items-center space-x-3',
        currentVariant.header,
        headerClassName
      )}>
        {/* Accent Bar */}
        <div className={cn(
          'w-1 h-6 rounded-full',
          currentVariant.accent
        )} />
        
        {/* Icon */}
        {icon && (
          <div className="flex-shrink-0">
            {icon}
          </div>
        )}
        
        {/* Title and Subtitle */}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold truncate">
            {title}
          </h3>
          {subtitle && (
            <p className="text-sm opacity-90 mt-1 truncate">
              {subtitle}
            </p>
          )}
        </div>
        
        {/* Decorative Element */}
        <div className="hidden md:flex space-x-1">
          <div className="w-2 h-2 rounded-full bg-current opacity-30" />
          <div className="w-2 h-2 rounded-full bg-current opacity-50" />
          <div className="w-2 h-2 rounded-full bg-current opacity-70" />
        </div>
      </div>
      
      {/* Content Section */}
      <div className={cn(
        'px-6 py-5',
        contentClassName
      )}>
        {children}
      </div>
    </div>
  );
};

export default CVSection;