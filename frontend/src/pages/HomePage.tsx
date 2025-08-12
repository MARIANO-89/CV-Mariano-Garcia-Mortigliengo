import React from 'react';
import { useCV } from '../hooks/useCV';
import { useLanguage } from '../contexts/LanguageContext';

// Components
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import CVSection from '../components/CV/CVSection';
import ExperienceItem from '../components/CV/ExperienceItem';
import EducationItem from '../components/CV/EducationItem';
import SkillsGrid from '../components/CV/SkillsGrid';
import ProjectCard from '../components/CV/ProjectCard';
import CertificationItem from '../components/CV/CertificationItem';
import LanguageSkills from '../components/CV/LanguageSkills';
import ContactInfo from '../components/CV/ContactInfo';

// Icons
import { 
  Briefcase, 
  GraduationCap, 
  Code,
  FolderOpen,
  Award,
  Globe,
  Mail,
  Download,
  FileText
} from 'lucide-react';

const HomePage: React.FC = () => {
  const { currentLanguage, t } = useLanguage();
  const { 
    profile, 
    experiences, 
    education, 
    skills, 
    projects, 
    certifications, 
    languages, 
    isLoading, 
    error 
  } = useCV();

  const handleDownloadCV = () => {
    // TODO: Implement CV download functionality
    console.log('Downloading CV...');
  };

  const handleDownloadPortfolio = () => {
    // TODO: Implement portfolio download functionality
    console.log('Downloading Portfolio...');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{t('error.loadingData')}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {t('common.retry')}
          </button>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">{t('error.noProfile')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="bg-white rounded-lg shadow-xl p-8 mb-8 overflow-hidden relative">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Cpath d='m36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            }} />
          </div>
          
          <div className="relative z-10 flex flex-col lg:flex-row items-center lg:items-start space-y-6 lg:space-y-0 lg:space-x-8">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <div className="relative">
                <img
                  src={profile.avatar || '/images/default-avatar.png'}
                  alt={`${profile.firstName} ${profile.lastName}`}
                  className="w-32 h-32 lg:w-40 lg:h-40 rounded-full object-cover border-6 border-white shadow-xl"
                />
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white shadow-lg" />
              </div>
            </div>
            
            {/* Profile Info */}
            <div className="flex-1 text-center lg:text-left">
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                {profile.firstName} {profile.lastName}
              </h1>
              <p className="text-xl text-blue-600 font-semibold mb-4">
                {currentLanguage === 'en' ? profile.titleEn : profile.title}
              </p>
              <p className="text-gray-700 text-lg leading-relaxed mb-6 max-w-2xl">
                {currentLanguage === 'en' ? profile.summaryEn : profile.summary}
              </p>
              
              {/* Action Buttons */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                <button
                  onClick={handleDownloadCV}
                  className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  <Download className="w-5 h-5 mr-2" />
                  {t('common.downloadCV')}
                </button>
                
                <button
                  onClick={handleDownloadPortfolio}
                  className="inline-flex items-center px-6 py-3 bg-white text-gray-700 font-semibold rounded-lg border-2 border-gray-300 hover:border-blue-600 hover:text-blue-600 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  <FileText className="w-5 h-5 mr-2" />
                  {t('common.downloadPortfolio')}
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Contact & Languages */}
          <div className="space-y-8">
            {/* Contact Information */}
            <CVSection
              title={t('sections.contact')}
              icon={<Mail className="w-6 h-6" />}
              variant="primary"
            >
              <ContactInfo 
                contact={{
                  firstName: profile.firstName,
                  lastName: profile.lastName,
                  email: profile.email,
                  phone: profile.phone,
                  location: profile.location,
                  website: profile.website,
                  socialMedia: profile.socialMedia,
                  avatar: profile.avatar
                }}
                variant="compact"
                showSocialMedia={true}
              />
            </CVSection>
            
            {/* Languages */}
            {languages.length > 0 && (
              <CVSection
                title={t('sections.languages')}
                icon={<Globe className="w-6 h-6" />}
                variant="secondary"
              >
                <LanguageSkills 
                  languages={languages} 
                  variant="compact"
                  showFlags={true}
                />
              </CVSection>
            )}
          </div>
          
          {/* Middle Column - Experience & Education */}
          <div className="space-y-8">
            {/* Professional Experience */}
            {experiences.length > 0 && (
              <CVSection
                title={t('sections.experience')}
                icon={<Briefcase className="w-6 h-6" />}
                variant="primary"
              >
                <div className="space-y-6">
                  {experiences.map((experience, index) => (
                    <ExperienceItem
                      key={experience.id}
                      experience={experience}
                      isLast={index === experiences.length - 1}
                      showTimeline={true}
                    />
                  ))}
                </div>
              </CVSection>
            )}
            
            {/* Education */}
            {education.length > 0 && (
              <CVSection
                title={t('sections.education')}
                icon={<GraduationCap className="w-6 h-6" />}
                variant="secondary"
              >
                <div className="space-y-6">
                  {education.map((edu, index) => (
                    <EducationItem
                      key={edu.id}
                      education={edu}
                      isLast={index === education.length - 1}
                      showTimeline={true}
                    />
                  ))}
                </div>
              </CVSection>
            )}
          </div>
          
          {/* Right Column - Skills, Projects, Certifications */}
          <div className="space-y-8">
            {/* Skills */}
            {skills.length > 0 && (
              <CVSection
                title={t('sections.skills')}
                icon={<Code className="w-6 h-6" />}
                variant="accent"
              >
                <SkillsGrid 
                  skills={skills}
                  columns={1}
                  variant="detailed"
                  showProgress={true}
                />
              </CVSection>
            )}
            
            {/* Certifications */}
            {certifications.length > 0 && (
              <CVSection
                title={t('sections.certifications')}
                icon={<Award className="w-6 h-6" />}
                variant="secondary"
              >
                <div className="space-y-6">
                  {certifications.slice(0, 3).map((certification, index) => (
                    <CertificationItem
                      key={certification.id}
                      certification={certification}
                      isLast={index === 2 || index === certifications.length - 1}
                      showTimeline={false}
                      compact={true}
                    />
                  ))}
                </div>
              </CVSection>
            )}
          </div>
        </div>
        
        {/* Projects Section - Full Width */}
        {projects.length > 0 && (
          <div className="mt-8">
            <CVSection
              title={t('sections.projects')}
              subtitle={`${projects.length} ${t('projects.total')}`}
              icon={<FolderOpen className="w-6 h-6" />}
              variant="primary"
              className="mb-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {projects.slice(0, 6).map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    variant="default"
                  />
                ))}
              </div>
              
              {projects.length > 6 && (
                <div className="text-center mt-6">
                  <button className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors">
                    {t('projects.viewAll')} ({projects.length - 6} {t('projects.more')})
                  </button>
                </div>
              )}
            </CVSection>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default HomePage;