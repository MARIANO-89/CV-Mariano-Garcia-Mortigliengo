import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { 
  Download, 
  Palette, 
  RotateCcw, 
  Zap,
  Layout,
  Grid,
  Circle
} from 'lucide-react';

interface Template {
  id: string;
  name: string;
  description: string;
  preview: string;
  baseColors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
  };
}

const BackgroundDesignerPage: React.FC = () => {
  const { t } = useLanguage();
  const [selectedTemplate, setSelectedTemplate] = useState<string>('modern');
  const [customColors, setCustomColors] = useState({
    primary: '#0078D4',
    secondary: '#106EBE',
    accent: '#FFB900',
    background: '#F3F2F1'
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  const templates: Template[] = [
    {
      id: 'modern',
      name: 'Moderno',
      description: 'Diseño limpio y profesional con elementos geométricos',
      preview: '/images/template-modern-preview.png',
      baseColors: {
        primary: '#0078D4',
        secondary: '#106EBE',
        accent: '#FFB900',
        background: '#F3F2F1'
      }
    },
    {
      id: 'corporate',
      name: 'Corporativo',
      description: 'Estilo empresarial clásico con tonos azules y grises',
      preview: '/images/template-corporate-preview.png',
      baseColors: {
        primary: '#1F4E79',
        secondary: '#2E5B8A',
        accent: '#D83B01',
        background: '#FFFFFF'
      }
    },
    {
      id: 'creative',
      name: 'Creativo',
      description: 'Diseño vibrante con gradientes y formas orgánicas',
      preview: '/images/template-creative-preview.png',
      baseColors: {
        primary: '#8764B8',
        secondary: '#B146C2',
        accent: '#00BCF2',
        background: '#FAF9F8'
      }
    }
  ];

  const handleColorChange = (colorType: keyof typeof customColors, value: string) => {
    setCustomColors(prev => ({
      ...prev,
      [colorType]: value
    }));
  };

  const handleTemplateSelect = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setSelectedTemplate(templateId);
      setCustomColors(template.baseColors);
    }
  };

  const resetToDefaults = () => {
    const template = templates.find(t => t.id === selectedTemplate);
    if (template) {
      setCustomColors(template.baseColors);
    }
  };

  const generateBackground = async () => {
    setIsGenerating(true);
    try {
      // TODO: Call the Supabase Edge Function for background generation
      const response = await fetch('/functions/v1/generate-background', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          template: selectedTemplate,
          colors: customColors
        })
      });
      
      const data = await response.json();
      setGeneratedImage(data.imageUrl);
    } catch (error) {
      console.error('Error generating background:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadImage = (format: 'png' | 'jpg') => {
    if (!generatedImage) return;
    
    const link = document.createElement('a');
    link.href = generatedImage;
    link.download = `powerbi-background.${format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const selectedTemplateData = templates.find(t => t.id === selectedTemplate);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {t('tools.backgroundDesigner.title')}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {t('tools.backgroundDesigner.description')}
          </p>
        </div>
        
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Template Selection */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <Layout className="w-5 h-5 mr-2" />
                  Plantillas
                </h2>
                <div className="space-y-3">
                  {templates.map((template) => (
                    <div
                      key={template.id}
                      onClick={() => handleTemplateSelect(template.id)}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        selectedTemplate === template.id 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <h3 className="font-semibold text-gray-900 mb-1">{template.name}</h3>
                      <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                      <div className="flex space-x-2">
                        {Object.values(template.baseColors).map((color, index) => (
                          <div
                            key={index}
                            className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Color Customization */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center">
                    <Palette className="w-5 h-5 mr-2" />
                    Colores
                  </h2>
                  <button
                    onClick={resetToDefaults}
                    className="flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Resetear</span>
                  </button>
                </div>
                
                <div className="space-y-4">
                  {Object.entries(customColors).map(([colorType, value]) => (
                    <div key={colorType} className="flex items-center space-x-3">
                      <div 
                        className="w-10 h-10 rounded-lg border-2 border-gray-300 shadow-sm cursor-pointer"
                        style={{ backgroundColor: value }}
                      />
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                          {colorType === 'primary' && 'Principal'}
                          {colorType === 'secondary' && 'Secundario'}
                          {colorType === 'accent' && 'Acento'}
                          {colorType === 'background' && 'Fondo'}
                        </label>
                        <input
                          type="color"
                          value={value}
                          onChange={(e) => handleColorChange(colorType as keyof typeof customColors, e.target.value)}
                          className="w-full h-8 rounded border border-gray-300 cursor-pointer"
                        />
                      </div>
                      <input
                        type="text"
                        value={value}
                        onChange={(e) => handleColorChange(colorType as keyof typeof customColors, e.target.value)}
                        className="w-20 px-2 py-1 text-sm border border-gray-300 rounded font-mono"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Preview & Generation */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Vista Previa</h2>
                  <div className="flex space-x-3">
                    <button
                      onClick={generateBackground}
                      disabled={isGenerating}
                      className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {isGenerating ? (
                        <LoadingSpinner size="sm" color="white" />
                      ) : (
                        <Zap className="w-5 h-5" />
                      )}
                      <span>{isGenerating ? 'Generando...' : 'Generar'}</span>
                    </button>
                  </div>
                </div>
                
                {/* Template Preview */}
                <div className="mb-6">
                  <div 
                    className="w-full h-64 rounded-lg border-2 border-gray-200 flex items-center justify-center relative overflow-hidden"
                    style={{
                      background: `linear-gradient(135deg, ${customColors.primary}, ${customColors.secondary})`,
                    }}
                  >
                    {selectedTemplate === 'modern' && (
                      <div className="absolute inset-0">
                        <div 
                          className="absolute top-4 right-4 w-16 h-16 rounded-full opacity-20"
                          style={{ backgroundColor: customColors.accent }}
                        />
                        <div 
                          className="absolute bottom-4 left-4 w-24 h-24 opacity-10"
                          style={{ backgroundColor: customColors.background }}
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Grid className="w-32 h-32 text-white opacity-30" />
                        </div>
                      </div>
                    )}
                    
                    {selectedTemplate === 'corporate' && (
                      <div className="absolute inset-0">
                        <div 
                          className="absolute top-0 right-0 w-full h-2"
                          style={{ backgroundColor: customColors.accent }}
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Layout className="w-32 h-32 text-white opacity-40" />
                        </div>
                      </div>
                    )}
                    
                    {selectedTemplate === 'creative' && (
                      <div className="absolute inset-0">
                        <div 
                          className="absolute top-8 left-8 w-12 h-12 rounded-full opacity-30"
                          style={{ backgroundColor: customColors.accent }}
                        />
                        <div 
                          className="absolute bottom-8 right-8 w-20 h-20 rounded-full opacity-20"
                          style={{ backgroundColor: customColors.background }}
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Circle className="w-32 h-32 text-white opacity-25" />
                        </div>
                      </div>
                    )}
                    
                    <div className="relative z-10 text-center">
                      <h3 className="text-2xl font-bold text-white mb-2">
                        {selectedTemplateData?.name}
                      </h3>
                      <p className="text-white text-opacity-90">
                        Plantilla personalizada
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Generated Image */}
                {generatedImage && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Imagen Generada</h3>
                    <div className="relative">
                      <img 
                        src={generatedImage} 
                        alt="Generated background"
                        className="w-full h-64 object-cover rounded-lg border-2 border-gray-200"
                      />
                      <div className="absolute top-4 right-4 flex space-x-2">
                        <button
                          onClick={() => downloadImage('png')}
                          className="flex items-center space-x-1 px-3 py-2 bg-white bg-opacity-90 text-gray-700 rounded-lg hover:bg-opacity-100 transition-all shadow-sm"
                        >
                          <Download className="w-4 h-4" />
                          <span>PNG</span>
                        </button>
                        <button
                          onClick={() => downloadImage('jpg')}
                          className="flex items-center space-x-1 px-3 py-2 bg-white bg-opacity-90 text-gray-700 rounded-lg hover:bg-opacity-100 transition-all shadow-sm"
                        >
                          <Download className="w-4 h-4" />
                          <span>JPG</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Instructions */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 mb-2">Cómo usar en Power BI:</h4>
                  <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                    <li>Descarga la imagen generada en formato PNG o JPG</li>
                    <li>En Power BI, ve a Formato &gt; Fondo del lienzo</li>
                    <li>Selecciona "Imagen" y sube tu archivo descargado</li>
                    <li>Ajusta la transparencia según sea necesario</li>
                    <li>¡Disfruta de tu dashboard personalizado!</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default BackgroundDesignerPage;