Deno.serve(async (req) => {
    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Max-Age': '86400',
        'Access-Control-Allow-Credentials': 'false'
    };

    if (req.method === 'OPTIONS') {
        return new Response(null, { status: 200, headers: corsHeaders });
    }

    try {
        const url = new URL(req.url);
        const pathParts = url.pathname.split('/');
        const fileName = pathParts[pathParts.length - 1];
        
        // Extract analysis ID from filename
        const analysisIdMatch = fileName.match(/analysis-([\w-]+)\.(txt|json)$/);
        if (!analysisIdMatch) {
            throw new Error('Formato de archivo inválido');
        }
        
        const analysisId = analysisIdMatch[1];
        const fileType = analysisIdMatch[2];
        
        // Get environment variables
        const supabaseUrl = Deno.env.get('SUPABASE_URL');
        const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

        if (!supabaseUrl || !serviceRoleKey) {
            throw new Error('Configuración de Supabase faltante');
        }

        // Get analysis data from database
        const dbResponse = await fetch(`${supabaseUrl}/rest/v1/color_analysis_requests?id=eq.${analysisId}`, {
            headers: {
                'Authorization': `Bearer ${serviceRoleKey}`,
                'apikey': serviceRoleKey
            }
        });

        if (!dbResponse.ok) {
            throw new Error('Análisis no encontrado');
        }

        const analyses = await dbResponse.json();
        if (analyses.length === 0) {
            throw new Error('Análisis no encontrado');
        }

        const analysis = analyses[0];
        let fileContent = '';
        let contentType = '';
        let downloadFileName = '';

        if (fileType === 'txt') {
            // Generate detailed text analysis report
            fileContent = generateTextReport(analysis);
            contentType = 'text/plain';
            downloadFileName = `analisis-colores-${analysisId}.txt`;
        } else if (fileType === 'json') {
            // Return Power BI theme JSON
            fileContent = JSON.stringify(analysis.powerbi_theme_json, null, 2);
            contentType = 'application/json';
            downloadFileName = `tema-powerbi-${analysisId}.json`;
        }

        return new Response(fileContent, {
            headers: {
                ...corsHeaders,
                'Content-Type': contentType,
                'Content-Disposition': `attachment; filename="${downloadFileName}"`,
                'Cache-Control': 'public, max-age=3600'
            }
        });

    } catch (error) {
        console.error('Error en descarga de archivo:', error);

        return new Response(JSON.stringify({
            success: false,
            error: {
                code: 'DOWNLOAD_FAILED',
                message: error.message
            }
        }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
});

// Function to generate detailed text report
function generateTextReport(analysis) {
    const timestamp = new Date(analysis.created_at).toLocaleString('es-ES');
    
    let report = `=== ANÁLISIS DE COLORES Y FUENTES - CV POWER BI ===\n`;
    report += `Generado por: MiniMax Agent\n`;
    report += `Fecha: ${timestamp}\n`;
    report += `ID del Análisis: ${analysis.id}\n\n`;
    
    report += `FUENTE ANALIZADA:\n`;
    report += `Tipo: ${analysis.source_type}\n`;
    if (analysis.source_url) {
        report += `URL: ${analysis.source_url}\n`;
    }
    if (analysis.file_name) {
        report += `Archivo: ${analysis.file_name}\n`;
    }
    report += `\n`;
    
    // Colors section
    if (analysis.extracted_colors && analysis.extracted_colors.dominantColors) {
        report += `COLORES DOMINANTES:\n`;
        report += `==================\n`;
        
        analysis.extracted_colors.dominantColors.forEach((color, index) => {
            report += `${index + 1}. ${color.name}\n`;
            report += `   Código HEX: ${color.hex}\n`;
            report += `   Porcentaje: ${color.percentage}%\n\n`;
        });
        
        report += `Total de colores detectados: ${analysis.extracted_colors.totalColors}\n`;
        report += `Armonía de colores: ${analysis.extracted_colors.colorHarmony}\n`;
        report += `Método de análisis: ${analysis.extracted_colors.analysisMethod}\n\n`;
    }
    
    // Fonts section
    if (analysis.extracted_fonts && analysis.extracted_fonts.detectedFonts) {
        report += `FUENTES DETECTADAS:\n`;
        report += `==================\n`;
        
        analysis.extracted_fonts.detectedFonts.forEach((font, index) => {
            report += `${index + 1}. ${font.family}\n`;
            report += `   Peso: ${font.weight}\n`;
            report += `   Uso: ${font.usage}\n\n`;
        });
        
        report += `Fuente principal: ${analysis.extracted_fonts.primaryFont}\n`;
        report += `Total de fuentes: ${analysis.extracted_fonts.totalFonts}\n`;
        report += `Método de análisis: ${analysis.extracted_fonts.analysisMethod}\n\n`;
    }
    
    report += `RECOMENDACIONES PARA POWER BI:\n`;
    report += `==============================\n`;
    report += `1. Utiliza los colores dominantes como paleta base\n`;
    report += `2. Aplica la fuente principal para mantener consistencia\n`;
    report += `3. Usa el archivo JSON generado para importar el tema\n`;
    report += `4. Considera la armonía de colores para visualizaciones\n\n`;
    
    report += `INSTRUCCIONES DE IMPORTACIÓN:\n`;
    report += `=============================\n`;
    report += `1. Abre Power BI Desktop\n`;
    report += `2. Ve a Ver > Temas > Examinar temas\n`;
    report += `3. Selecciona el archivo JSON generado\n`;
    report += `4. El tema se aplicará automáticamente\n\n`;
    
    report += `---\n`;
    report += `Generado por CV Power BI - Mariano García Mortigliengo\n`;
    report += `MiniMax Agent - ${new Date().getFullYear()}\n`;
    
    return report;
}