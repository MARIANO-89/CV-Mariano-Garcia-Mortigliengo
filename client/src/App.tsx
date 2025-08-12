import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from '@/context/AuthContext'
import { LanguageProvider } from '@/context/LanguageContext'
import Layout from '@/components/Layout'
import Home from '@/pages/Home'
import CV from '@/pages/CV'
import ColorAnalysis from '@/pages/ColorAnalysis'
import BackgroundDesigner from '@/pages/BackgroundDesigner'
import AdminPanel from '@/pages/AdminPanel'
import Login from '@/pages/Login'
import AuthCallback from '@/pages/AuthCallback'
import ProtectedRoute from '@/components/ProtectedRoute'
import { Toaster } from '@/components/ui/toaster'
import './App.css'

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/auth/callback" element={<AuthCallback />} />
              <Route element={<Layout />}>
                <Route path="/" element={<Home />} />
                <Route path="/cv" element={<CV />} />
                <Route path="/color-analysis" element={<ColorAnalysis />} />
                <Route path="/background-designer" element={<BackgroundDesigner />} />
                <Route 
                  path="/admin/*" 
                  element={
                    <ProtectedRoute requireAdmin>
                      <AdminPanel />
                    </ProtectedRoute>
                  } 
                />
              </Route>
            </Routes>
            <Toaster />
          </div>
        </Router>
      </AuthProvider>
    </LanguageProvider>
  )
}

export default App