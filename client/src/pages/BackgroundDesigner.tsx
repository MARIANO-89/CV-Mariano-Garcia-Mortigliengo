import React, { useState, useEffect } from 'react'
import { useLanguage } from '@/context/LanguageContext'
import { supabase, BackgroundDesign } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Slider } from '@/components/ui/slider'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Image as ImageIcon,
  Download,
  Eye,
  Palette,
  Settings,
  Loader2,
  CheckCircle,
  AlertCircle,
  Layers,
  Sparkles
} from 'lucide-react'

interface CustomizationOptions {
  colors?: string[]
  opacity?: number
  pattern?: string
  size?: string
}

function BackgroundDesigner() {
  const { t, language } = useLanguage()
  const [designs, setDesigns] = useState<BackgroundDesign[]>([])
  const [selectedDesign, setSelectedDesign] = useState<BackgroundDesign | null>(null)
  const [customizations, setCustomizations] = useState<CustomizationOptions>({})
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  
  // Configuration states
  const [format, setFormat] = useState<'png' | 'jpg'>('png')
  const [resolution, setResolution] = useState<'1920x1080' | '1366x768' | '3840x2160'>('1920x1080')
  const [primaryColor, setPrimaryColor] = useState('#1e3a8a')
  const [secondaryColor, setSecondaryColor] = useState('#3b82f6')
  const [opacity, setOpacity] = useState([90])

  useEffect(() => {
    fetchDesigns()
  }, [])

  const fetchDesigns = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('background_designs')
        .select('*')
        .eq('is_active', true)
        .order('order_index', { ascending: true })

      if (error) throw error
      setDesigns(data || [])
      if (data && data.length > 0) {
        setSelectedDesign(data[0])
      }
    } catch (err: any) {
      setError(err.message)
      console.error('Error fetching designs:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDesignSelect = (design: BackgroundDesign) => {
    setSelectedDesign(design)
    setGeneratedImage(null)
    setError(null)
    setSuccess(null)
    
    // Reset customizations based on design template
    const templateData = design.template_data
    if (templateData.colors && templateData.colors.length > 0) {
      setPrimaryColor(templateData.colors[0])
      setSecondaryColor(templateData.colors[1] || templateData.colors[0])
    }
    if (templateData.opacity) {
      setOpacity([templateData.opacity * 100])
    }
  }

  const handleGenerate = async () => {
    if (!selectedDesign) return

    setGenerating(true)
    setError(null)
    setSuccess(null)

    try {
      // Prepare customization data
      const customizationData: CustomizationOptions = {
        colors: [primaryColor, secondaryColor],
        opacity: opacity[0] / 100,
        pattern: selectedDesign.template_data.pattern,
        size: selectedDesign.template_data.size
      }

      // Parse resolution
      const [width, height] = resolution.split('x').map(Number)

      // Call Supabase edge function
      const { data, error } = await supabase.functions.invoke('background-generator', {
        body: {
          designId: selectedDesign.id,
          customizations: customizationData,
          format,
          dimensions: { width, height }
        }
      })

      if (error) throw error

      if (data.success) {
        setGeneratedImage(data.data.generatedImage)
        setSuccess('Fondo generado exitosamente')
      } else {
        throw new Error(data.error?.message || 'Error generando fondo')
      }
    } catch (err: any) {
      console.error('Generation error:', err)
      setError(err.message || 'Error al generar el fondo')
    } finally {
      setGenerating(false)
    }
  }

  const handleDownload = () => {
    if (!generatedImage || !selectedDesign) return

    try {
      const link = document.createElement('a')
      link.href = generatedImage
      link.download = `power-bi-background-${selectedDesign.name.toLowerCase().replace(/\s+/g, '-')}-${resolution}.${format}`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      setSuccess('Fondo descargado exitosamente')
    } catch (error) {
      setError('Error al descargar el fondo')
    }
  }

  const getDescription = (design: BackgroundDesign) => {
    return language === 'es' ? design.description_es : design.description_en || design.description_es
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            {t('backgroundDesigner.title')}
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            {t('backgroundDesigner.description')}
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Design Templates */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="shadow-xl border-0">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Layers className="w-5 h-5 text-blue-600" />
                  <span>Plantillas Predefinidas</span>
                </CardTitle>
                <CardDescription>
                  Selecciona un diseño base para personalizar
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {designs.map((design) => (
                    <div
                      key={design.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                        selectedDesign?.id === design.id 
                          ? 'border-blue-500 bg-blue-50 shadow-md' 
                          : 'border-slate-200 hover:border-blue-300'
                      }`}
                      onClick={() => handleDesignSelect(design)}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-slate-900">{design.name}</h3>
                          {selectedDesign?.id === design.id && (
                            <CheckCircle className="w-5 h-5 text-blue-600" />
                          )}
                        </div>
                        <p className="text-sm text-slate-600">{getDescription(design)}</p>
                        
                        {/* Preview Colors */}
                        <div className="flex space-x-2">
                          {design.template_data.colors && design.template_data.colors.slice(0, 4).map((color: string, index: number) => (
                            <div
                              key={index}
                              className="w-6 h-6 rounded border-2 border-white shadow-sm"
                              style={{ backgroundColor: color }}
                              title={color}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Customization Controls */}
            {selectedDesign && (
              <Card className="shadow-xl border-0">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Settings className="w-5 h-5 text-blue-600" />
                    <span>Personalización</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Primary Color */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Color Primario</label>
                    <div className="flex items-center space-x-3">
                      <input
                        type="color"
                        value={primaryColor}
                        onChange={(e) => setPrimaryColor(e.target.value)}
                        className="w-12 h-8 rounded border border-slate-300 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={primaryColor}
                        onChange={(e) => setPrimaryColor(e.target.value)}
                        className="flex-1 px-3 py-1 text-sm border border-slate-300 rounded font-mono"
                      />
                    </div>
                  </div>

                  {/* Secondary Color */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Color Secundario</label>
                    <div className="flex items-center space-x-3">
                      <input
                        type="color"
                        value={secondaryColor}
                        onChange={(e) => setSecondaryColor(e.target.value)}
                        className="w-12 h-8 rounded border border-slate-300 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={secondaryColor}
                        onChange={(e) => setSecondaryColor(e.target.value)}
                        className="flex-1 px-3 py-1 text-sm border border-slate-300 rounded font-mono"
                      />
                    </div>
                  </div>

                  {/* Opacity */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Opacidad: {opacity[0]}%</label>
                    <Slider
                      value={opacity}
                      onValueChange={setOpacity}
                      max={100}
                      min={10}
                      step={5}
                      className="w-full"
                    />
                  </div>

                  {/* Format */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Formato</label>
                    <Select value={format} onValueChange={(value: 'png' | 'jpg') => setFormat(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="png">PNG (transparencia)</SelectItem>
                        <SelectItem value="jpg">JPG (menor tamaño)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Resolution */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Resolución</label>
                    <Select value={resolution} onValueChange={(value: any) => setResolution(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1366x768">1366x768 (HD)</SelectItem>
                        <SelectItem value="1920x1080">1920x1080 (Full HD)</SelectItem>
                        <SelectItem value="3840x2160">3840x2160 (4K)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Generate Button */}
                  <Button 
                    onClick={handleGenerate} 
                    disabled={generating}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    {generating ? (
                      <div className="flex items-center space-x-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Generando...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Sparkles className="w-4 h-4" />
                        <span>Generar Fondo</span>
                      </div>
                    )}
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Preview & Results */}
          <div className="lg:col-span-2 space-y-6">
            {/* Alerts */}
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">{success}</AlertDescription>
              </Alert>
            )}

            {/* Preview Card */}
            <Card className="shadow-xl border-0">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Eye className="w-5 h-5 text-blue-600" />
                    <span>Vista Previa</span>
                  </div>
                  {generatedImage && (
                    <Button onClick={handleDownload} size="sm" className="flex items-center space-x-2">
                      <Download className="w-4 h-4" />
                      <span>Descargar</span>
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-slate-100 rounded-lg border-2 border-dashed border-slate-300 flex items-center justify-center overflow-hidden">
                  {generatedImage ? (
                    <div className="relative w-full h-full">
                      <img 
                        src={generatedImage} 
                        alt="Generated background" 
                        className="w-full h-full object-cover rounded-lg"
                      />
                      <div className="absolute top-2 right-2">
                        <Badge className="bg-black/50 text-white">
                          {resolution}
                        </Badge>
                      </div>
                    </div>
                  ) : selectedDesign ? (
                    <div className="text-center space-y-4">
                      <div className="w-24 h-24 bg-gradient-to-br from-slate-200 to-slate-300 rounded-2xl flex items-center justify-center mx-auto">
                        <ImageIcon className="w-12 h-12 text-slate-500" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900">{selectedDesign.name}</h3>
                        <p className="text-sm text-slate-600">Personaliza los colores y haz clic en "Generar Fondo"</p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center space-y-4">
                      <div className="w-24 h-24 bg-gradient-to-br from-slate-200 to-slate-300 rounded-2xl flex items-center justify-center mx-auto">
                        <Palette className="w-12 h-12 text-slate-500" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900">Selecciona una Plantilla</h3>
                        <p className="text-sm text-slate-600">Elige un diseño de la lista para comenzar</p>
                      </div>
                    </div>
                  )}
                </div>
                
                {generatedImage && (
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-2">Instrucciones de uso en Power BI:</h4>
                    <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                      <li>Descarga la imagen generada</li>
                      <li>Abre Power BI Desktop</li>
                      <li>Ve a "Formato" en el panel de visualizaciones</li>
                      <li>Selecciona "Página" → "Fondo de página"</li>
                      <li>Sube la imagen descargada</li>
                      <li>Ajusta la transparencia y posición según necesites</li>
                    </ol>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BackgroundDesigner