import React from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '@/context/LanguageContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  FileText,
  Palette,
  Image,
  BarChart3,
  Briefcase,
  Award,
  Globe,
  Mail,
  Phone,
  MapPin,
  Linkedin,
  ArrowRight,
  Star
} from 'lucide-react'

function Home() {
  const { t } = useLanguage()

  const features = [
    {
      icon: FileText,
      title: 'CV Dashboard Power BI',
      description: 'CV profesional interactivo con diseño estilo Power BI, sistema bilingüe y totalmente responsive.',
      link: '/cv',
      gradient: 'from-blue-500 to-blue-600'
    },
    {
      icon: Palette,
      title: 'Analizador de Colores',
      description: 'Extrae paletas de colores y fuentes de imágenes, PDFs y URLs. Genera temas para Power BI.',
      link: '/color-analysis',
      gradient: 'from-purple-500 to-purple-600'
    },
    {
      icon: Image,
      title: 'Diseñador de Fondos',
      description: 'Crea fondos personalizados para dashboards de Power BI con plantillas profesionales.',
      link: '/background-designer',
      gradient: 'from-emerald-500 to-emerald-600'
    }
  ]

  const stats = [
    { icon: Briefcase, label: '2+', sublabel: 'Años Experiencia BI' },
    { icon: Award, label: '2', sublabel: 'Certificaciones' },
    { icon: BarChart3, label: '10+', sublabel: 'Proyectos Completados' },
    { icon: Star, label: '5', sublabel: 'Herramientas Dominadas' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-5xl sm:text-6xl font-bold">
                  <span className="block text-slate-900">CV Power BI</span>
                  <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Profesional
                  </span>
                </h1>
                <p className="text-xl text-slate-600 max-w-2xl">
                  Plataforma integral para análisis visual y herramientas profesionales de Power BI. 
                  Desarrollado para <strong>Mariano García Mortigliengo</strong>, Developer BI especializado.
                </p>
              </div>
              
              {/* Contact Quick Info */}
              <div className="flex flex-wrap gap-6 text-slate-600">
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-blue-600" />
                  <span className="text-sm">nano_carp@hotmail.com</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-blue-600" />
                  <span className="text-sm">+34 675 688 410</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-blue-600" />
                  <span className="text-sm">Santander, Cantabria</span>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
                  <Link to="/cv">
                    <FileText className="w-5 h-5 mr-2" />
                    Ver CV Completo
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/color-analysis">
                    <Palette className="w-5 h-5 mr-2" />
                    Herramientas Power BI
                  </Link>
                </Button>
              </div>
            </div>

            {/* Hero Image/Visual */}
            <div className="relative">
              <div className="relative bg-white rounded-2xl shadow-2xl p-8">
                <div className="aspect-square bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto">
                      <BarChart3 className="w-12 h-12 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-slate-900">Business Intelligence</h3>
                      <p className="text-slate-600">Developer & Analyst</p>
                    </div>
                  </div>
                </div>
                
                {/* Floating Stats */}
                <div className="absolute -top-4 -right-4 bg-white rounded-lg shadow-lg p-4 border">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">2+</div>
                    <div className="text-xs text-slate-600">Años BI</div>
                  </div>
                </div>
                
                <div className="absolute -bottom-4 -left-4 bg-white rounded-lg shadow-lg p-4 border">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">PL-300</div>
                    <div className="text-xs text-slate-600">Certificado</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <div key={index} className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl mb-4">
                    <Icon className="w-8 h-8 text-blue-600" />
                  </div>
                  <div className="text-3xl font-bold text-slate-900 mb-1">{stat.label}</div>
                  <div className="text-sm text-slate-600">{stat.sublabel}</div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Herramientas Profesionales de Power BI
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Suite completa de herramientas para análisis visual, diseño de dashboards y desarrollo profesional en Business Intelligence.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <Card key={index} className="group hover:shadow-2xl transition-all duration-300 border-0 shadow-lg hover:-translate-y-1">
                  <CardHeader>
                    <div className={`inline-flex w-16 h-16 items-center justify-center rounded-xl bg-gradient-to-r ${feature.gradient} mb-4`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-xl font-bold text-slate-900">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <CardDescription className="text-slate-600">
                      {feature.description}
                    </CardDescription>
                    <Button asChild variant="ghost" className="group-hover:bg-slate-100 w-full justify-between">
                      <Link to={feature.link}>
                        Explorar
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* LinkedIn CTA */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white">
              ¿Interesado en colaborar?
            </h2>
            <p className="text-xl text-blue-100">
              Conéctate conmigo en LinkedIn para oportunidades profesionales y proyectos de Business Intelligence.
            </p>
            <Button 
              size="lg" 
              variant="secondary" 
              className="bg-white text-blue-600 hover:bg-blue-50"
              onClick={() => window.open('https://www.linkedin.com/in/marianogarciam', '_blank')}
            >
              <Linkedin className="w-5 h-5 mr-2" />
              Conectar en LinkedIn
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home