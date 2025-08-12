import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { 
  Upload, 
  Link, 
  FileText, 
  Image, 
  Download, 
  Palette, 
  Type,
  Copy,
  Check
} from 'lucide-react';

const ColorAnalyzerPage: React.FC = () => {
  const { t } = useLanguage();
  const [analysisType, setAnalysisType] = useState<'url' | 'image' | 'pdf'>('url');
  const [inputValue, setInputValue] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [copiedItem, setCopiedItem] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!inputValue.trim()) return;
    
    setIsAnalyzing(true);
    try {
      // TODO: Call the Supabase Edge Function for color analysis
      const response = await fetch('/functions/v1/analyze-colors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: analysisType,
          input: inputValue
        })
      });
      
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error('Error analyzing colors:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleCopy = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedItem(id);
      setTimeout(() => setCopiedItem(null), 2000);
    } catch (error) {
      console.error('Error copying to clipboard:', error);
    }
  };

  const handleDownload = (format: 'txt' | 'json') => {
    if (!results) return;
    
    let content = '';
    let filename = '';
    let mimeType = '';
    
    if (format === 'txt') {
      content = results.colors?.map((color: any) => `${color.name}: ${color.hex}`).join('\n') || '';
      filename = 'color-analysis.txt';
      mimeType = 'text/plain';
    } else {
      // Power BI theme format
      const theme = {
        name: 'Custom Theme',
        dataColors: results.colors?.map((color: any) => color.hex) || [],
        background: results.backgroundColor || '#FFFFFF',
        foreground: results.textColor || '#000000',
        tableAccent: results.accentColor || '#0078D4'
      };
      content = JSON.stringify(theme, null, 2);
      filename = 'powerbi-theme.json';
      mimeType = 'application/json';
    }
    
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {t('tools.colorAnalyzer.title')}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {t('tools.colorAnalyzer.description')}
          </p>
        </div>
        
        {/* Analysis Tool */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-xl p-8 mb-8">
            {/* Input Type Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Tipo de análisis:
              </label>
              <div className="flex space-x-4">
                <button
                  onClick={() => setAnalysisType('url')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg border-2 transition-all ${
                    analysisType === 'url' 
                      ? 'border-blue-500 bg-blue-50 text-blue-700' 
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <Link className="w-5 h-5" />
                  <span>URL</span>
                </button>
                <button
                  onClick={() => setAnalysisType('image')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg border-2 transition-all ${
                    analysisType === 'image' 
                      ? 'border-blue-500 bg-blue-50 text-blue-700' 
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <Image className="w-5 h-5" />
                  <span>Imagen</span>
                </button>
                <button
                  onClick={() => setAnalysisType('pdf')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg border-2 transition-all ${
                    analysisType === 'pdf' 
                      ? 'border-blue-500 bg-blue-50 text-blue-700' 
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <FileText className="w-5 h-5" />
                  <span>PDF</span>
                </button>
              </div>
            </div>
            
            {/* Input Field */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {analysisType === 'url' && 'URL del sitio web:'}
                {analysisType === 'image' && 'URL de la imagen:'}
                {analysisType === 'pdf' && 'URL del PDF:'}
              </label>
              <div className="flex space-x-4">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={
                    analysisType === 'url' ? 'https://ejemplo.com' :
                    analysisType === 'image' ? 'https://ejemplo.com/imagen.jpg' :
                    'https://ejemplo.com/documento.pdf'
                  }
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing || !inputValue.trim()}
                  className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isAnalyzing ? (
                    <LoadingSpinner size="sm" color="white" />
                  ) : (
                    'Analizar'
                  )}
                </button>
              </div>
            </div>
            
            {/* File Upload Alternative */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600 mb-2">O arrastra y suelta archivos aquí</p>
              <p className="text-sm text-gray-500">Soporta: JPG, PNG, PDF (máx. 10MB)</p>
            </div>
          </div>
          
          {/* Results Section */}
          {results && (
            <div className="bg-white rounded-lg shadow-xl p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Resultados del Análisis</h2>
                <div className="flex space-x-3">
                  <button
                    onClick={() => handleDownload('txt')}
                    className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    <span>TXT</span>
                  </button>
                  <button
                    onClick={() => handleDownload('json')}
                    className="flex items-center space-x-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    <span>Power BI JSON</span>
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Colors */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Palette className="w-5 h-5 mr-2" />
                    Paleta de Colores
                  </h3>
                  <div className="space-y-3">
                    {results.colors?.map((color: any, index: number) => (
                      <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <div 
                          className="w-10 h-10 rounded-lg border-2 border-white shadow-sm"
                          style={{ backgroundColor: color.hex }}
                        />
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{color.name}</p>
                          <p className="text-sm text-gray-600">{color.hex}</p>
                        </div>
                        <button
                          onClick={() => handleCopy(color.hex, `color-${index}`)}
                          className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          {copiedItem === `color-${index}` ? (
                            <Check className="w-4 h-4 text-green-600" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    )) || <p className="text-gray-500">No se encontraron colores</p>}
                  </div>
                </div>
                
                {/* Fonts */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Type className="w-5 h-5 mr-2" />
                    Fuentes Detectadas
                  </h3>
                  <div className="space-y-3">
                    {results.fonts?.map((font: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900" style={{ fontFamily: font.family }}>
                            {font.family}
                          </p>
                          <p className="text-sm text-gray-600">
                            Peso: {font.weight} | Tamaño: {font.size}
                          </p>
                        </div>
                        <button
                          onClick={() => handleCopy(font.family, `font-${index}`)}
                          className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          {copiedItem === `font-${index}` ? (
                            <Check className="w-4 h-4 text-green-600" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    )) || <p className="text-gray-500">No se encontraron fuentes</p>}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ColorAnalyzerPage;