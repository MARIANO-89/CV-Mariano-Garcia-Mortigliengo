import React, { useState, useEffect } from 'react'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { useLanguage } from '@/context/LanguageContext'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  BarChart3,
  Users,
  FileText,
  Palette,
  Image,
  Settings,
  Activity,
  TrendingUp,
  Calendar,
  Award,
  Globe
} from 'lucide-react'

interface AdminStats {
  overview: {
    totalProfiles: number
    totalExperiences: number
    totalSkills: number
    totalProjects: number
    totalAnalyses: number
    totalDesigns: number
  }
  recentActivity: {
    analysesThisMonth: number
    topSkillCategories: Array<{ category: string; count: number }>
    recentAnalyses: any[]
  }
  usage: {
    analysisByType: Array<{ type: string; count: number }>
    popularDesigns: Array<{ id: string; name: string; usageCount: number }>
    skillDistribution: Array<{ level: string; count: number }>
  }
}

function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      setLoading(true)
      
      // Call admin analytics edge function
      const { data, error } = await supabase.functions.invoke('admin-analytics', {
        body: { adminUserId: 'current' }
      })

      if (error) throw error

      if (data.success) {
        setStats(data.data)
      } else {
        throw new Error(data.error?.message || 'Error loading analytics')
      }
    } catch (err: any) {
      console.error('Error fetching admin stats:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-slate-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-slate-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error || !stats) {
    return (
      <div className="p-6">
        <div className="text-center">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Error Loading Dashboard</h2>
          <p className="text-slate-600 mb-6">{error || 'Failed to load analytics'}</p>
          <Button onClick={fetchStats}>Try Again</Button>
        </div>
      </div>
    )
  }

  const statCards = [
    {
      title: 'Perfiles CV',
      value: stats.overview.totalProfiles,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Experiencias',
      value: stats.overview.totalExperiences,
      icon: FileText,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Habilidades',
      value: stats.overview.totalSkills,
      icon: Award,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      title: 'Análisis Totales',
      value: stats.overview.totalAnalyses,
      icon: Palette,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    }
  ]

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Dashboard Administrativo</h1>
        <p className="text-slate-600 mt-2">Resumen general de la plataforma CV Power BI</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index} className="shadow-lg border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">{stat.title}</p>
                    <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.bgColor}`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Analysis Activity */}
        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="w-5 h-5 text-blue-600" />
              <span>Actividad Reciente</span>
            </CardTitle>
            <CardDescription>
              Análisis de colores y actividad del mes actual
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                <div>
                  <p className="font-semibold text-blue-900">Análisis este mes</p>
                  <p className="text-sm text-blue-700">Solicitudes procesadas</p>
                </div>
                <div className="text-2xl font-bold text-blue-600">
                  {stats.recentActivity.analysesThisMonth}
                </div>
              </div>
              
              {/* Analysis by Type */}
              <div className="space-y-2">
                <h4 className="font-semibold text-slate-900">Por tipo de fuente:</h4>
                {stats.usage.analysisByType.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm text-slate-600 capitalize">{item.type}</span>
                    <Badge variant="secondary">{item.count}</Badge>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Top Skills */}
        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <span>Categorías de Habilidades</span>
            </CardTitle>
            <CardDescription>
              Distribución de habilidades por categoría
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.recentActivity.topSkillCategories.map((category, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <span className="font-medium text-slate-900">{category.category}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-16 h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-green-500 transition-all duration-500"
                        style={{ 
                          width: `${(category.count / Math.max(...stats.recentActivity.topSkillCategories.map(c => c.count))) * 100}%` 
                        }}
                      ></div>
                    </div>
                    <span className="text-sm font-semibold text-slate-700">{category.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Analyses */}
      <Card className="shadow-lg border-0">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-purple-600" />
            <span>Últimos Análisis Realizados</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats.recentActivity.recentAnalyses.slice(0, 5).map((analysis, index) => (
              <div key={index} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:shadow-md transition-shadow">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    {analysis.source_type === 'image' && <Image className="w-5 h-5 text-purple-600" />}
                    {analysis.source_type === 'pdf' && <FileText className="w-5 h-5 text-purple-600" />}
                    {analysis.source_type === 'url' && <Globe className="w-5 h-5 text-purple-600" />}
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">
                      {analysis.file_name || analysis.source_url || 'Análisis sin nombre'}
                    </p>
                    <p className="text-sm text-slate-600">
                      Tipo: {analysis.source_type} • {new Date(analysis.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <Badge 
                  variant={analysis.status === 'completed' ? 'default' : 'secondary'}
                  className={analysis.status === 'completed' ? 'bg-green-100 text-green-800' : ''}
                >
                  {analysis.status === 'completed' ? 'Completado' : 'Procesando'}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function AdminPanel() {
  const { user } = useAuth()
  const { t } = useLanguage()
  const location = useLocation()

  const navigationItems = [
    {
      path: '/admin',
      icon: BarChart3,
      label: 'Dashboard',
      exact: true
    },
    {
      path: '/admin/cv',
      icon: FileText,
      label: 'Gestión CV'
    },
    {
      path: '/admin/designs',
      icon: Image,
      label: 'Diseños de Fondo'
    },
    {
      path: '/admin/analytics',
      icon: Activity,
      label: 'Analíticas'
    },
    {
      path: '/admin/settings',
      icon: Settings,
      label: 'Configuración'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex">
          {/* Sidebar */}
          <div className="w-64 flex-shrink-0 py-8">
            <div className="bg-white rounded-xl shadow-xl border-0 overflow-hidden">
              {/* Admin Header */}
              <div className="p-6 bg-gradient-to-r from-blue-600 to-purple-600">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <Settings className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-white font-bold">Admin Panel</h2>
                    <p className="text-blue-100 text-sm">{user?.email}</p>
                  </div>
                </div>
              </div>
              
              {/* Navigation */}
              <nav className="p-2">
                {navigationItems.map((item) => {
                  const Icon = item.icon
                  const isActive = item.exact 
                    ? location.pathname === item.path
                    : location.pathname.startsWith(item.path)
                  
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                        isActive
                          ? 'bg-blue-100 text-blue-700 shadow-sm'
                          : 'text-slate-600 hover:text-blue-700 hover:bg-blue-50'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </Link>
                  )
                })}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 py-8 pl-8">
            <div className="bg-white rounded-xl shadow-xl border-0 min-h-[600px]">
              <Routes>
                <Route index element={<AdminDashboard />} />
                <Route path="cv" element={<div className="p-6"><h2 className="text-2xl font-bold">Gestión de CV - Próximamente</h2></div>} />
                <Route path="designs" element={<div className="p-6"><h2 className="text-2xl font-bold">Gestión de Diseños - Próximamente</h2></div>} />
                <Route path="analytics" element={<div className="p-6"><h2 className="text-2xl font-bold">Analíticas Avanzadas - Próximamente</h2></div>} />
                <Route path="settings" element={<div className="p-6"><h2 className="text-2xl font-bold">Configuración - Próximamente</h2></div>} />
              </Routes>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminPanel