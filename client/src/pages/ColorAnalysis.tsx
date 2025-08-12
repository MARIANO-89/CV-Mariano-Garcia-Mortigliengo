import React, { useState, useRef } from 'react'
import { useLanguage } from '@/context/LanguageContext'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import {
  Upload,
  Link as LinkIcon,
  FileText,
  Image as ImageIcon,
  Palette,
  Type,
  Download,
  Eye,
  Check,
  AlertCircle,
  Loader2,
  Copy
} from 'lucide-react'

interface AnalysisResult {
  analysisId: string
  extractedColors: {
    dominantColors: Array<{
      hex: string
      name: string
      percentage: number
    }>
    totalColors: number
    colorHarmony: string
    analysisMethod: string
  }
  extractedFonts: {
    detectedFonts: Array<{
      family: string
      weight: string
      usage: string
    }>
    primaryFont: string
    totalFonts: number
    analysisMethod: string
  }
  powerbiTheme: any
  downloadUrls: {
    txtFile: string
    jsonFile: string
  }
}

function ColorAnalysis() {
  const { t } = useLanguage()
  const [activeTab, setActiveTab] = useState('image')
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [results, setResults] = useState<AnalysisResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  
  // Form states
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [url, setUrl] = useState('')
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  
  const fileInputRef = useRef<HTMLInputElement>(null)
  const pdfInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'pdf') => {
    const file = event.target.files?.[0]
    if (!file) return

    setSelectedFile(file)
    setError(null)
    setSuccess(null)

    if (type === 'image') {
      const reader = new FileReader()
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    } else {
      setPreviewUrl(null)
    }
  }

  const simulateProgress = () => {
    setProgress(0)
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval)
          return 90
        }
        return prev + Math.random() * 15
      })
    }, 500)
    return interval
  }

  const handleAnalyze = async () => {
    if (!selectedFile && !url) {
      setError('Por favor, selecciona un archivo o ingresa una URL')
      return
    }

    setLoading(true)
    setError(null)
    setSuccess(null)
    setResults(null)
    
    const progressInterval = simulateProgress()

    try {
      let analysisData: any = {}

      if (selectedFile) {
        // Convert file to base64
        const reader = new FileReader()
        const fileDataUrl = await new Promise<string>((resolve) => {
          reader.onload = (e) => resolve(e.target?.result as string)
          reader.readAsDataURL(selectedFile)
        })

        analysisData = {
          sourceType: selectedFile.type.includes('pdf') ? 'pdf' : 'image',
          fileName: selectedFile.name,
          imageData: fileDataUrl
        }
      } else if (url) {
        analysisData = {
          sourceType: 'url',
          sourceUrl: url
        }
      }

      // Call Supabase edge function for analysis
      const { data, error } = await supabase.functions.invoke('color-analysis', {
        body: analysisData
      })

      if (error) throw error

      clearInterval(progressInterval)
      setProgress(100)

      if (data.success) {
        setResults(data.data)
        setSuccess('Análisis completado exitosamente')
      } else {
        throw new Error(data.error?.message || 'Error en el análisis')
      }
    } catch (err: any) {
      console.error('Analysis error:', err)
      clearInterval(progressInterval)
      setError(err.message || 'Error al procesar el análisis')
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = async (type: 'txt' | 'json') => {
    if (!results) return

    try {
      const url = type === 'txt' ? results.downloadUrls.txtFile : results.downloadUrls.jsonFile
      const response = await fetch(url)
      const blob = await response.blob()
      
      const downloadUrl = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = downloadUrl
      a.download = `analisis-${results.analysisId}.${type}`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(downloadUrl)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Download error:', error)
      setError('Error al descargar el archivo')
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setSuccess('Copiado al portapapeles')
  }

  const resetForm = () => {
    setSelectedFile(null)
    setUrl('')
    setPreviewUrl(null)
    setResults(null)
    setError(null)
    setSuccess(null)
    setProgress(0)
    if (fileInputRef.current) fileInputRef.current.value = ''
    if (pdfInputRef.current) pdfInputRef.current.value = ''
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            {t('colorAnalysis.title')}
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            {t('colorAnalysis.description')}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Input */}
          <div className="space-y-6">
            {/* Analysis Input Card */}
            <Card className="shadow-xl border-0">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Palette className="w-6 h-6 text-blue-600" />
                  <span>Seleccionar Fuente de Análisis</span>
                </CardTitle>
                <CardDescription>
                  Elige el tipo de fuente que deseas analizar para extraer colores y fuentes.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="image" className="flex items-center space-x-2">
                      <ImageIcon className="w-4 h-4" />
                      <span>Imagen</span>
                    </TabsTrigger>
                    <TabsTrigger value="url" className="flex items-center space-x-2">
                      <LinkIcon className="w-4 h-4" />
                      <span>URL</span>
                    </TabsTrigger>
                    <TabsTrigger value="pdf" className="flex items-center space-x-2">
                      <FileText className="w-4 h-4" />
                      <span>PDF</span>
                    </TabsTrigger>
                  </TabsList>

                  {/* Image Upload Tab */}
                  <TabsContent value="image" className="space-y-4">
                    <div>
                      <Label htmlFor="image-upload">Subir Imagen</Label>
                      <div className="mt-2">
                        <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
                          <input
                            ref={fileInputRef}
                            id="image-upload"
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileSelect(e, 'image')}
                            className="hidden"
                          />
                          <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                          <p className="text-slate-600 mb-2">Arrastra una imagen aquí o haz clic para seleccionar</p>
                          <p className="text-sm text-slate-500">Soporta: JPG, PNG, GIF, WebP</p>
                          <Button
                            type="button"
                            variant="outline"
                            className="mt-4"
                            onClick={() => fileInputRef.current?.click()}
                          >
                            Seleccionar Imagen
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    {previewUrl && (
                      <div className="space-y-2">
                        <Label>Vista Previa</Label>
                        <div className="border rounded-lg p-4">
                          <img 
                            src={previewUrl} 
                            alt="Preview" 
                            className="max-w-full h-48 object-contain mx-auto rounded-lg"
                          />
                          <p className="text-sm text-slate-600 text-center mt-2">
                            {selectedFile?.name}
                          </p>
                        </div>
                      </div>
                    )}
                  </TabsContent>

                  {/* URL Tab */}
                  <TabsContent value="url" className="space-y-4">
                    <div>
                      <Label htmlFor="url-input">URL a Analizar</Label>
                      <Input
                        id="url-input"
                        type="url"
                        placeholder="https://ejemplo.com/imagen.jpg"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        className="mt-2"
                      />
                    </div>
                  </TabsContent>

                  {/* PDF Tab */}
                  <TabsContent value="pdf" className="space-y-4">
                    <div>
                      <Label htmlFor="pdf-upload">Subir PDF</Label>
                      <div className="mt-2">
                        <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
                          <input
                            ref={pdfInputRef}
                            id="pdf-upload"
                            type="file"
                            accept=".pdf"
                            onChange={(e) => handleFileSelect(e, 'pdf')}
                            className="hidden"
                          />
                          <FileText className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                          <p className="text-slate-600 mb-2">Arrastra un PDF aquí o haz clic para seleccionar</p>
                          <p className="text-sm text-slate-500">Soporta: archivos PDF hasta 50MB</p>
                          <Button
                            type="button"
                            variant="outline"
                            className="mt-4"
                            onClick={() => pdfInputRef.current?.click()}
                          >
                            Seleccionar PDF
                          </Button>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>

                {/* Action Buttons */}
                <div className="flex justify-between items-center pt-6 border-t">
                  <Button variant="outline" onClick={resetForm} disabled={loading}>
                    Limpiar
                  </Button>
                  <Button 
                    onClick={handleAnalyze} 
                    disabled={loading || (!selectedFile && !url)}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    {loading ? (
                      <div className="flex items-center space-x-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Analizando...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Eye className="w-4 h-4" />
                        <span>Analizar</span>
                      </div>
                    )}
                  </Button>
                </div>

                {/* Progress Bar */}
                {loading && (
                  <div className="space-y-2">
                    <Progress value={progress} className="w-full" />
                    <p className="text-sm text-slate-600 text-center">
                      Procesando análisis... {Math.round(progress)}%
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Alerts */}
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="border-green-200 bg-green-50">
                <Check className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">{success}</AlertDescription>
              </Alert>
            )}
          </div>

          {/* Right Column - Results */}
          <div className="space-y-6">
            {results ? (
              <>
                {/* Colors Results */}
                <Card className="shadow-xl border-0">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Palette className="w-5 h-5 text-blue-600" />
                      <span>Colores Detectados</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      {results.extractedColors.dominantColors.map((color, index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex items-center space-x-3">
                            <div 
                              className="w-8 h-8 rounded-lg border-2 border-slate-200"
                              style={{ backgroundColor: color.hex }}
                            ></div>
                            <div className="flex-1">
                              <div className="font-medium text-slate-900">{color.name}</div>
                              <div className="text-sm text-slate-600">{color.percentage}%</div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(color.hex)}
                            >
                              <Copy className="w-3 h-3" />
                            </Button>
                          </div>
                          <div className="text-xs font-mono text-slate-700 bg-slate-100 px-2 py-1 rounded">
                            {color.hex}
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="pt-4 border-t space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Total de colores:</span>
                        <span className="font-medium">{results.extractedColors.totalColors}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Armonía:</span>
                        <span className="font-medium">{results.extractedColors.colorHarmony}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Fonts Results */}
                <Card className="shadow-xl border-0">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Type className="w-5 h-5 text-blue-600" />
                      <span>Fuentes Detectadas</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {results.extractedFonts.detectedFonts.map((font, index) => (
                      <div key={index} className="p-3 bg-slate-50 rounded-lg">
                        <div className="font-semibold text-slate-900">{font.family}</div>
                        <div className="flex justify-between text-sm text-slate-600 mt-1">
                          <span>Peso: {font.weight}</span>
                          <span>Uso: {font.usage}</span>
                        </div>
                      </div>
                    ))}
                    
                    <div className="pt-4 border-t space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Fuente principal:</span>
                        <span className="font-medium">{results.extractedFonts.primaryFont}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Download Options */}
                <Card className="shadow-xl border-0">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Download className="w-5 h-5 text-blue-600" />
                      <span>Descargar Resultados</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Button 
                        variant="outline" 
                        className="flex items-center space-x-2"
                        onClick={() => handleDownload('txt')}
                      >
                        <FileText className="w-4 h-4" />
                        <span>Reporte TXT</span>
                      </Button>
                      <Button 
                        className="flex items-center space-x-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
                        onClick={() => handleDownload('json')}
                      >
                        <Download className="w-4 h-4" />
                        <span>Tema Power BI</span>
                      </Button>
                    </div>
                    <p className="text-sm text-slate-600 mt-4">
                      El archivo JSON contiene el tema completo listo para importar en Power BI Desktop.
                    </p>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card className="shadow-xl border-0">
                <CardContent className="p-12 text-center">
                  <Palette className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">Resultados del Análisis</h3>
                  <p className="text-slate-600">
                    Selecciona una fuente y haz clic en "Analizar" para ver los colores y fuentes detectadas.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ColorAnalysis