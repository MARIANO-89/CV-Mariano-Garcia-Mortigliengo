import React from 'react';
import { cn } from '../../utils/cn';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Globe, 
  Linkedin, 
  Github, 
  Twitter,
  Instagram,
  Facebook,
  Youtube,
  MessageCircle,
  Calendar,
  ExternalLink
} from 'lucide-react';
import { ContactInfo as ContactInfoType } from '../../types';

interface ContactInfoProps {
  contact: ContactInfoType;
  className?: string;
  variant?: 'default' | 'compact' | 'detailed' | 'card';
  showSocialMedia?: boolean;
  showAvatar?: boolean;
}

const ContactInfo: React.FC<ContactInfoProps> = ({
  contact,
  className,
  variant = 'default',
  showSocialMedia = true,
  showAvatar = true
}) => {
  const getContactIcon = (type: string) => {
    const iconMap: Record<string, React.ComponentType<any>> = {
      email: Mail,
      phone: Phone,
      location: MapPin,
      website: Globe,
      linkedin: Linkedin,
      github: Github,
      twitter: Twitter,
      instagram: Instagram,
      facebook: Facebook,
      youtube: Youtube,
      whatsapp: MessageCircle,
      telegram: MessageCircle
    };
    
    return iconMap[type.toLowerCase()] || ExternalLink;
  };

  const formatPhoneNumber = (phone: string): string => {
    // Simple phone formatting for display
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 9) {
      return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`;
    }
    return phone;
  };

  const getContactHref = (type: string, value: string): string => {
    const hrefMap: Record<string, (val: string) => string> = {
      email: (val) => `mailto:${val}`,
      phone: (val) => `tel:${val}`,
      whatsapp: (val) => `https://wa.me/${val.replace(/\D/g, '')}`,
      telegram: (val) => `https://t.me/${val}`,
      linkedin: (val) => val.startsWith('http') ? val : `https://linkedin.com/in/${val}`,
      github: (val) => val.startsWith('http') ? val : `https://github.com/${val}`,
      twitter: (val) => val.startsWith('http') ? val : `https://twitter.com/${val}`,
      instagram: (val) => val.startsWith('http') ? val : `https://instagram.com/${val}`,
      facebook: (val) => val.startsWith('http') ? val : `https://facebook.com/${val}`,
      youtube: (val) => val.startsWith('http') ? val : `https://youtube.com/${val}`,
      website: (val) => val.startsWith('http') ? val : `https://${val}`
    };
    
    const formatter = hrefMap[type.toLowerCase()];
    return formatter ? formatter(value) : value;
  };

  if (variant === 'compact') {
    return (
      <div className={cn('flex flex-wrap items-center gap-4', className)}>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Mail className="w-4 h-4" />
          <span>{contact.email}</span>
        </div>
        
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Phone className="w-4 h-4" />
          <span>{formatPhoneNumber(contact.phone)}</span>
        </div>
        
        {contact.location && (
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <MapPin className="w-4 h-4" />
            <span>{contact.location}</span>
          </div>
        )}
      </div>
    );
  }

  if (variant === 'card') {
    return (
      <div className={cn(
        'bg-white border border-gray-200 rounded-lg p-6 shadow-sm',
        className
      )}>
        {showAvatar && contact.avatar && (
          <div className="flex justify-center mb-6">
            <img
              src={contact.avatar}
              alt="Avatar"
              className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
            />
          </div>
        )}
        
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold text-gray-900 mb-1">
            {contact.fullName || `${contact.firstName} ${contact.lastName}`}
          </h3>
          {contact.title && (
            <p className="text-gray-600">{contact.title}</p>
          )}
        </div>
        
        <div className="space-y-3">
          {/* Primary Contact Info */}
          <a
            href={getContactHref('email', contact.email)}
            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
          >
            <div className="flex-shrink-0">
              <Mail className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
            </div>
            <span className="text-gray-900 group-hover:text-blue-600 transition-colors">
              {contact.email}
            </span>
          </a>
          
          <a
            href={getContactHref('phone', contact.phone)}
            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
          >
            <div className="flex-shrink-0">
              <Phone className="w-5 h-5 text-gray-400 group-hover:text-green-600 transition-colors" />
            </div>
            <span className="text-gray-900 group-hover:text-green-600 transition-colors">
              {formatPhoneNumber(contact.phone)}
            </span>
          </a>
          
          {contact.location && (
            <div className="flex items-center space-x-3 p-3 rounded-lg">
              <div className="flex-shrink-0">
                <MapPin className="w-5 h-5 text-gray-400" />
              </div>
              <span className="text-gray-900">{contact.location}</span>
            </div>
          )}
          
          {contact.website && (
            <a
              href={getContactHref('website', contact.website)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
            >
              <div className="flex-shrink-0">
                <Globe className="w-5 h-5 text-gray-400 group-hover:text-purple-600 transition-colors" />
              </div>
              <span className="text-gray-900 group-hover:text-purple-600 transition-colors">
                {contact.website}
              </span>
              <ExternalLink className="w-4 h-4 text-gray-400 ml-auto" />
            </a>
          )}
        </div>
        
        {/* Social Media */}
        {showSocialMedia && contact.socialMedia && contact.socialMedia.length > 0 && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h4 className="text-sm font-medium text-gray-900 mb-3">Redes sociales</h4>
            <div className="grid grid-cols-2 gap-2">
              {contact.socialMedia.map((social, index) => {
                const Icon = getContactIcon(social.platform);
                return (
                  <a
                    key={index}
                    href={getContactHref(social.platform, social.url)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 transition-colors group text-sm"
                  >
                    <Icon className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
                    <span className="text-gray-700 group-hover:text-blue-600 transition-colors capitalize">
                      {social.platform}
                    </span>
                  </a>
                );
              })}
            </div>
          </div>
        )}
        
        {/* Availability */}
        {contact.availability && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-center space-x-2 text-sm">
              <Calendar className="w-4 h-4 text-green-600" />
              <span className="text-gray-600">Disponibilidad:</span>
              <span className="font-medium text-green-600">{contact.availability}</span>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={cn('space-y-4', className)}>
      {/* Basic Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <a
          href={getContactHref('email', contact.email)}
          className="flex items-center space-x-3 p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-all group"
        >
          <div className="flex-shrink-0">
            <Mail className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Email</p>
            <p className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
              {contact.email}
            </p>
          </div>
        </a>
        
        <a
          href={getContactHref('phone', contact.phone)}
          className="flex items-center space-x-3 p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-all group"
        >
          <div className="flex-shrink-0">
            <Phone className="w-5 h-5 text-gray-400 group-hover:text-green-600 transition-colors" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Teléfono</p>
            <p className="font-medium text-gray-900 group-hover:text-green-600 transition-colors">
              {formatPhoneNumber(contact.phone)}
            </p>
          </div>
        </a>
      </div>
      
      {/* Additional Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {contact.location && (
          <div className="flex items-center space-x-3 p-4 bg-white border border-gray-200 rounded-lg">
            <div className="flex-shrink-0">
              <MapPin className="w-5 h-5 text-gray-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Ubicación</p>
              <p className="font-medium text-gray-900">{contact.location}</p>
            </div>
          </div>
        )}
        
        {contact.website && (
          <a
            href={getContactHref('website', contact.website)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-3 p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-all group"
          >
            <div className="flex-shrink-0">
              <Globe className="w-5 h-5 text-gray-400 group-hover:text-purple-600 transition-colors" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-600">Sitio web</p>
              <p className="font-medium text-gray-900 group-hover:text-purple-600 transition-colors">
                {contact.website}
              </p>
            </div>
            <ExternalLink className="w-4 h-4 text-gray-400" />
          </a>
        )}
      </div>
      
      {/* Social Media */}
      {showSocialMedia && contact.socialMedia && contact.socialMedia.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Redes sociales</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {contact.socialMedia.map((social, index) => {
              const Icon = getContactIcon(social.platform);
              return (
                <a
                  key={index}
                  href={getContactHref(social.platform, social.url)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                >
                  <Icon className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                  <span className="text-gray-900 group-hover:text-blue-600 transition-colors capitalize">
                    {social.platform}
                  </span>
                </a>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactInfo;