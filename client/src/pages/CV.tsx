import React, { useEffect, useState } from 'react'
import { useLanguage } from '@/context/LanguageContext'
import { supabase, CompleteProfile } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Calendar,
  Building,
  GraduationCap,
  Award,
  Globe,
  Code,
  ExternalLink,
  Download,
  Star,
  Clock,
  Briefcase
} from 'lucide-react'

function CV() {
  const { language, t } = useLanguage()
  const [profile, setProfile] = useState<CompleteProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      setLoading(true)
      
      // Get main profile
      const { data: profileData, error: profileError } = await supabase
        .from('cv_profiles')
        .select('*')
        .eq('is_active', true)
        .maybeSingle()

      if (profileError) throw profileError
      if (!profileData) throw new Error('Profile not found')

      // Get all related data
      const [experiencesRes, educationRes, certificationsRes, languagesRes, skillsRes, projectsRes] = await Promise.all([
        supabase.from('cv_experiences').select('*').eq('profile_id', profileData.id).order('order_index', { ascending: true }).order('start_date', { ascending: false }),
        supabase.from('cv_education').select('*').eq('profile_id', profileData.id).order('order_index', { ascending: true }),
        supabase.from('cv_certifications').select('*').eq('profile_id', profileData.id).order('order_index', { ascending: true }),
        supabase.from('cv_languages').select('*').eq('profile_id', profileData.id).order('order_index', { ascending: true }),
        supabase.from('cv_skills').select('*').eq('profile_id', profileData.id).order('order_index', { ascending: true }),
        supabase.from('cv_projects').select('*').eq('profile_id', profileData.id).order('order_index', { ascending: true })
      ])

      const completeProfile: CompleteProfile = {
        ...profileData,
        experiences: experiencesRes.data || [],
        education: educationRes.data || [],
        certifications: certificationsRes.data || [],
        languages: languagesRes.data || [],
        skills: skillsRes.data || [],
        projects: projectsRes.data || []
      }

      setProfile(completeProfile)
    } catch (err: any) {
      setError(err.message)
      console.error('Error fetching profile:', err)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return null
    const date = new Date(dateString)
    return date.toLocaleDateString(language === 'es' ? 'es-ES' : 'en-US', {
      year: 'numeric',
      month: 'long'
    })
  }

  const getDescription = (item: any) => {
    return language === 'es' ? item.description_es : item.description_en || item.description_es
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">Error Loading Profile</h1>
          <p className="text-slate-600 mb-8">{error || 'Profile not found'}</p>
          <Button onClick={fetchProfile}>Try Again</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">{t('cv.title')}</h1>
          <p className="text-xl text-slate-600">Dashboard Profesional - Estilo Power BI</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Personal Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Card */}
            <Card className="shadow-xl border-0">
              <CardHeader className="text-center pb-2">
                <div className="w-32 h-32 mx-auto mb-4 relative">
                  <div className="w-full h-full bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-4xl font-bold text-white">
                      {profile.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                </div>
                <CardTitle className="text-2xl font-bold text-slate-900">{profile.name}</CardTitle>
                <p className="text-lg text-blue-600 font-semibold">{profile.position}</p>
                <p className="text-sm text-slate-600 mt-2">
                  {language === 'es' ? profile.bio_es : profile.bio_en || profile.bio_es}
                </p>
              </CardHeader>
              <CardContent className="pt-4">
                {/* Contact Info */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 text-slate-700">
                    <Mail className="w-4 h-4 text-blue-600" />
                    <span className="text-sm">{profile.email}</span>
                  </div>
                  {profile.phone && (
                    <div className="flex items-center space-x-3 text-slate-700">
                      <Phone className="w-4 h-4 text-blue-600" />
                      <span className="text-sm">{profile.phone}</span>
                    </div>
                  )}
                  {profile.location && (
                    <div className="flex items-center space-x-3 text-slate-700">
                      <MapPin className="w-4 h-4 text-blue-600" />
                      <span className="text-sm">{profile.location}</span>
                    </div>
                  )}
                  {profile.linkedin && (
                    <div className="flex items-center space-x-3 text-slate-700">
                      <Linkedin className="w-4 h-4 text-blue-600" />
                      <a 
                        href={`https://linkedin.com/in/${profile.linkedin}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm hover:text-blue-600 transition-colors"
                      >
                        {profile.linkedin}
                      </a>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Languages */}
            <Card className="shadow-xl border-0">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Globe className="w-5 h-5 text-blue-600" />
                  <span>{t('cv.languages')}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {profile.languages.map((lang) => (
                    <div key={lang.id} className="flex items-center justify-between">
                      <span className="font-medium text-slate-700">{lang.language}</span>
                      <Badge 
                        variant={lang.proficiency === 'Nativo' || lang.proficiency === 'Native' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {lang.proficiency}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Skills */}
            <Card className="shadow-xl border-0">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Code className="w-5 h-5 text-blue-600" />
                  <span>{t('cv.skills')}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {profile.skills.reduce((acc, skill) => {
                    const category = skill.category || 'Other'
                    if (!acc[category]) acc[category] = []
                    acc[category].push(skill)
                    return acc
                  }, {} as Record<string, any[]>)
                  }
                  {Object.entries(
                    profile.skills.reduce((acc, skill) => {
                      const category = skill.category || 'Other'
                      if (!acc[category]) acc[category] = []
                      acc[category].push(skill)
                      return acc
                    }, {} as Record<string, any[]>)
                  ).map(([category, skills]) => (
                    <div key={category} className="space-y-2">
                      <h4 className="font-semibold text-slate-800 text-sm">{category}</h4>
                      <div className="space-y-2">
                        {skills.map((skill) => (
                          <div key={skill.id} className="space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium text-slate-700">{skill.skill_name}</span>
                              <Badge variant="outline" className="text-xs">
                                {skill.proficiency_level}
                              </Badge>
                            </div>
                            {getDescription(skill) && (
                              <p className="text-xs text-slate-600">{getDescription(skill)}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Experience, Education, etc. */}
          <div className="lg:col-span-2 space-y-6">
            {/* Experience */}
            <Card className="shadow-xl border-0">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-xl">
                  <Briefcase className="w-6 h-6 text-blue-600" />
                  <span>{t('cv.experience')}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {profile.experiences.map((exp, index) => (
                    <div key={exp.id} className="relative">
                      {index < profile.experiences.length - 1 && (
                        <div className="absolute left-4 top-12 w-0.5 h-full bg-blue-200"></div>
                      )}
                      <div className="flex items-start space-x-4">
                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                          <Building className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center justify-between flex-wrap gap-2">
                            <h3 className="text-lg font-bold text-slate-900">{exp.position}</h3>
                            {exp.is_current && (
                              <Badge className="bg-green-100 text-green-800">
                                <Clock className="w-3 h-3 mr-1" />
                                {t('cv.current')}
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center space-x-2 text-blue-600 font-semibold">
                            <Building className="w-4 h-4" />
                            <span>{exp.company_name}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-slate-600">
                            <Calendar className="w-4 h-4" />
                            <span>
                              {formatDate(exp.start_date)} - {exp.is_current ? t('cv.present') : formatDate(exp.end_date)}
                            </span>
                          </div>
                          <p className="text-slate-700 leading-relaxed">{getDescription(exp)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Education */}
            <Card className="shadow-xl border-0">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-xl">
                  <GraduationCap className="w-6 h-6 text-blue-600" />
                  <span>{t('cv.education')}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {profile.education.map((edu, index) => (
                    <div key={edu.id} className="relative">
                      {index < profile.education.length - 1 && (
                        <div className="absolute left-4 top-12 w-0.5 h-full bg-purple-200"></div>
                      )}
                      <div className="flex items-start space-x-4">
                        <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                          <GraduationCap className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1 space-y-2">
                          <h3 className="text-lg font-bold text-slate-900">{edu.degree}</h3>
                          <div className="text-purple-600 font-semibold">{edu.institution}</div>
                          {edu.field_of_study && (
                            <div className="text-slate-600">{edu.field_of_study}</div>
                          )}
                          {edu.graduation_date && (
                            <div className="flex items-center space-x-2 text-slate-600">
                              <Calendar className="w-4 h-4" />
                              <span>{formatDate(edu.graduation_date)}</span>
                            </div>
                          )}
                          {getDescription(edu) && (
                            <p className="text-slate-700 leading-relaxed">{getDescription(edu)}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Certifications */}
            <Card className="shadow-xl border-0">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-xl">
                  <Award className="w-6 h-6 text-blue-600" />
                  <span>{t('cv.certifications')}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {profile.certifications.map((cert) => (
                    <div key={cert.id} className="p-4 border border-slate-200 rounded-lg hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-bold text-slate-900 flex-1">{cert.name}</h3>
                        <Star className="w-5 h-5 text-yellow-500 flex-shrink-0 ml-2" />
                      </div>
                      {cert.issuer && (
                        <p className="text-blue-600 font-semibold text-sm mb-2">{cert.issuer}</p>
                      )}
                      {cert.issue_date && (
                        <div className="flex items-center space-x-2 text-slate-600 text-sm mb-2">
                          <Calendar className="w-3 h-3" />
                          <span>{formatDate(cert.issue_date)}</span>
                        </div>
                      )}
                      {getDescription(cert) && (
                        <p className="text-slate-700 text-sm leading-relaxed">{getDescription(cert)}</p>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Projects */}
            <Card className="shadow-xl border-0">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-xl">
                  <Code className="w-6 h-6 text-blue-600" />
                  <span>{t('cv.projects')}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {profile.projects.map((project) => (
                    <div key={project.id} className="p-6 border border-slate-200 rounded-xl hover:shadow-lg transition-all duration-300">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <h3 className="text-xl font-bold text-slate-900">{project.title}</h3>
                          {project.is_featured && (
                            <Badge className="bg-yellow-100 text-yellow-800">
                              <Star className="w-3 h-3 mr-1" />
                              Destacado
                            </Badge>
                          )}
                        </div>
                        
                        {(project.start_date || project.end_date) && (
                          <div className="flex items-center space-x-2 text-slate-600">
                            <Calendar className="w-4 h-4" />
                            <span>
                              {formatDate(project.start_date)} - {formatDate(project.end_date) || 'Presente'}
                            </span>
                          </div>
                        )}
                        
                        <p className="text-slate-700 leading-relaxed">{getDescription(project)}</p>
                        
                        {project.technologies_used && project.technologies_used.length > 0 && (
                          <div className="space-y-2">
                            <h4 className="text-sm font-semibold text-slate-800">Tecnologías utilizadas:</h4>
                            <div className="flex flex-wrap gap-2">
                              {project.technologies_used.map((tech, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {tech}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {project.project_url && (
                          <a 
                            href={project.project_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors"
                          >
                            <ExternalLink className="w-4 h-4" />
                            <span className="text-sm font-medium">Ver Proyecto</span>
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CV