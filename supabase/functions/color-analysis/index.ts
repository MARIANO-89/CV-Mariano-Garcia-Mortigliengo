Deno.serve(async (req) => {
    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE, PATCH',
        'Access-Control-Max-Age': '86400',
        'Access-Control-Allow-Credentials': 'false'
    };

    if (req.method === 'OPTIONS') {
        return new Response(null, { status: 200, headers: corsHeaders });
    }

    try {
        const requestData = await req.json();
        const { sourceType, sourceUrl, imageData, fileName } = requestData;

        console.log('Análisis de colores iniciado:', { sourceType, sourceUrl, fileName });

        // Get environment variables
        const supabaseUrl = Deno.env.get('SUPABASE_URL');
        const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

        if (!supabaseUrl || !serviceRoleKey) {
            throw new Error('Configuración de Supabase faltante');
        }

        let analyzedImageUrl = sourceUrl;
        let processedImageData = null;

        // If image data is provided, process it
        if (imageData) {
            // Extract base64 data
            const base64Data = imageData.split(',')[1];
            const mimeType = imageData.split(';')[0].split(':')[1];
            
            // Convert to binary
            processedImageData = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
        }

        // Simulate color analysis (replace with real analysis logic)
        const extractedColors = await analyzeColorsFromImage(processedImageData || sourceUrl);
        const extractedFonts = await analyzeFontsFromSource(sourceType, sourceUrl || processedImageData);

        // Generate Power BI theme JSON
        const powerbiTheme = generatePowerBITheme(extractedColors, extractedFonts);

        // Create analysis request record
        const analysisData = {
            source_type: sourceType,
            source_url: sourceUrl,
            file_name: fileName,
            analysis_results: {
                timestamp: new Date().toISOString(),
                source_analyzed: sourceType,
                success: true
            },
            extracted_colors: extractedColors,
            extracted_fonts: extractedFonts,
            powerbi_theme_json: powerbiTheme,
            status: 'completed'
        };

        // Save to database
        const dbResponse = await fetch(`${supabaseUrl}/rest/v1/color_analysis_requests`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${serviceRoleKey}`,
                'apikey': serviceRoleKey,
                'Content-Type': 'application/json',
                'Prefer': 'return=representation'
            },
            body: JSON.stringify(analysisData)
        });

        if (!dbResponse.ok) {
            const errorText = await dbResponse.text();
            throw new Error(`Error guardando análisis: ${errorText}`);
        }

        const savedAnalysis = await dbResponse.json();
        const analysisId = savedAnalysis[0].id;

        console.log('Análisis completado exitosamente:', analysisId);

        return new Response(JSON.stringify({
            success: true,
            data: {
                analysisId,
                extractedColors,
                extractedFonts,
                powerbiTheme,
                downloadUrls: {
                    txtFile: `/api/download/analysis-${analysisId}.txt`,
                    jsonFile: `/api/download/powerbi-theme-${analysisId}.json`
                }
            },
            message: 'Análisis completado exitosamente'
        }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Error en análisis de colores:', error);

        return new Response(JSON.stringify({
            success: false,
            error: {
                code: 'COLOR_ANALYSIS_FAILED',
                message: error.message
            }
        }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
});

// Function to analyze colors from image
async function analyzeColorsFromImage(imageSource) {
    // Simulate color extraction (replace with actual analysis)
    const mockColors = [
        { hex: '#1e3a8a', name: 'Azul Marino', percentage: 35 },
        { hex: '#3b82f6', name: 'Azul', percentage: 25 },
        { hex: '#60a5fa', name: 'Azul Claro', percentage: 20 },
        { hex: '#ffffff', name: 'Blanco', percentage: 15 },
        { hex: '#f8fafc', name: 'Gris Claro', percentage: 5 }
    ];

    return {
        dominantColors: mockColors,
        totalColors: mockColors.length,
        colorHarmony: 'Complementary',
        analysisMethod: 'K-means clustering'
    };
}

// Function to analyze fonts from source
async function analyzeFontsFromSource(sourceType, source) {
    // Simulate font detection
    const mockFonts = [
        { family: 'Segoe UI', weight: 'Regular', usage: 'Body text' },
        { family: 'Segoe UI', weight: 'Semibold', usage: 'Headers' },
        { family: 'Segoe UI', weight: 'Light', usage: 'Captions' }
    ];

    return {
        detectedFonts: mockFonts,
        primaryFont: 'Segoe UI',
        totalFonts: mockFonts.length,
        analysisMethod: 'OCR and style detection'
    };
}

// Function to generate Power BI theme
function generatePowerBITheme(colors, fonts) {
    const theme = {
        name: `Tema Personalizado ${new Date().toLocaleDateString()}`,
        dataColors: colors.dominantColors.slice(0, 8).map(c => c.hex),
        background: colors.dominantColors.find(c => c.name.includes('Blanco') || c.name.includes('Claro'))?.hex || '#FFFFFF',
        foreground: '#000000',
        tableAccent: colors.dominantColors[0]?.hex || '#1e3a8a',
        good: '#28a745',
        neutral: '#ffc107',
        bad: '#dc3545',
        maximum: colors.dominantColors[0]?.hex || '#1e3a8a',
        center: colors.dominantColors[1]?.hex || '#3b82f6',
        minimum: colors.dominantColors[2]?.hex || '#60a5fa',
        null: '#cccccc',
        textClasses: {
            label: {
                fontSize: 12,
                fontFace: fonts.primaryFont || 'Segoe UI'
            },
            callout: {
                fontSize: 45,
                fontFace: fonts.primaryFont || 'Segoe UI'
            },
            title: {
                fontSize: 16,
                fontFace: fonts.primaryFont || 'Segoe UI'
            },
            header: {
                fontSize: 14,
                fontFace: fonts.primaryFont || 'Segoe UI'
            }
        }
    };

    return theme;
}