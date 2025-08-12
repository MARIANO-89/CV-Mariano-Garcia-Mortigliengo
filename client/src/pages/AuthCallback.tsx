import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { Card, CardContent } from '@/components/ui/card'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'

function AuthCallback() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get the hash fragment from the URL
        const hashFragment = window.location.hash
        
        if (hashFragment && hashFragment.length > 0) {
          // Exchange the auth code for a session
          const { data, error } = await supabase.auth.getSession()

          if (error) {
            console.error('Error getting session:', error.message)
            setStatus('error')
            setMessage('Error al procesar la autenticación: ' + error.message)
            // Redirect to login with error after 3 seconds
            setTimeout(() => {
              navigate('/login?error=' + encodeURIComponent(error.message))
            }, 3000)
            return
          }

          if (data.session) {
            setStatus('success')
            setMessage('Autenticación exitosa. Redirigiendo...')
            // Successfully signed in, redirect to admin panel
            setTimeout(() => {
              navigate('/admin')
            }, 2000)
            return
          }
        }

        // If we get here, something went wrong
        setStatus('error')
        setMessage('No se encontró información de sesión')
        setTimeout(() => {
          navigate('/login?error=No session found')
        }, 3000)
      } catch (error: any) {
        console.error('Auth callback error:', error)
        setStatus('error')
        setMessage('Error inesperado durante la autenticación')
        setTimeout(() => {
          navigate('/login?error=' + encodeURIComponent('Unexpected error'))
        }, 3000)
      }
    }

    handleAuthCallback()
  }, [navigate])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl border-0">
        <CardContent className="p-8 text-center">
          <div className="space-y-6">
            {/* Status Icon */}
            <div className="flex justify-center">
              {status === 'loading' && (
                <Loader2 className="w-16 h-16 text-blue-600 animate-spin" />
              )}
              {status === 'success' && (
                <CheckCircle className="w-16 h-16 text-green-600" />
              )}
              {status === 'error' && (
                <XCircle className="w-16 h-16 text-red-600" />
              )}
            </div>
            
            {/* Status Text */}
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-slate-900">
                {status === 'loading' && 'Procesando autenticación...'}
                {status === 'success' && '¡Autenticación exitosa!'}
                {status === 'error' && 'Error de autenticación'}
              </h1>
              
              <p className="text-slate-600">
                {message || 'Por favor espera mientras procesamos tu autenticación.'}
              </p>
              
              {status === 'success' && (
                <p className="text-sm text-green-600">
                  Serás redirigido al panel de administración en unos momentos...
                </p>
              )}
              
              {status === 'error' && (
                <p className="text-sm text-red-600">
                  Serás redirigido a la página de login...
                </p>
              )}
            </div>
            
            {/* Loading Animation */}
            {status === 'loading' && (
              <div className="flex justify-center space-x-1">
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default AuthCallback