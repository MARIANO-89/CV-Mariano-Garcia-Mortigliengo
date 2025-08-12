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
        const { designId, customizations, format, dimensions } = await req.json();

        console.log('Generando fondo personalizado:', { designId, format, dimensions });

        // Get environment variables
        const supabaseUrl = Deno.env.get('SUPABASE_URL');
        const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

        if (!supabaseUrl || !serviceRoleKey) {
            throw new Error('Configuración de Supabase faltante');
        }

        // Get design template from database
        const designResponse = await fetch(`${supabaseUrl}/rest/v1/background_designs?id=eq.${designId}`, {
            headers: {
                'Authorization': `Bearer ${serviceRoleKey}`,
                'apikey': serviceRoleKey
            }
        });

        if (!designResponse.ok) {
            throw new Error('Diseño no encontrado');
        }

        const designs = await designResponse.json();
        if (designs.length === 0) {
            throw new Error('Diseño no encontrado');
        }

        const design = designs[0];
        const templateData = design.template_data;

        // Apply customizations to template
        const finalDesign = applyCustomizations(templateData, customizations);

        // Generate background image
        const generatedImage = await generateBackgroundImage(finalDesign, format, dimensions);

        // Convert to base64 for response
        const base64Image = btoa(String.fromCharCode(...generatedImage));
        const dataUrl = `data:image/${format};base64,${base64Image}`;

        return new Response(JSON.stringify({
            success: true,
            data: {
                designId,
                generatedImage: dataUrl,
                format,
                dimensions,
                downloadUrl: `/api/download/background-${designId}-${Date.now()}.${format}`
            },
            message: 'Fondo generado exitosamente'
        }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Error generando fondo:', error);

        return new Response(JSON.stringify({
            success: false,
            error: {
                code: 'BACKGROUND_GENERATION_FAILED',
                message: error.message
            }
        }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
});

// Function to apply customizations to template
function applyCustomizations(templateData, customizations) {
    const finalDesign = { ...templateData };
    
    if (customizations.colors) {
        finalDesign.colors = customizations.colors;
    }
    
    if (customizations.opacity !== undefined) {
        finalDesign.opacity = customizations.opacity;
    }
    
    if (customizations.pattern) {
        finalDesign.pattern = customizations.pattern;
    }
    
    if (customizations.size) {
        finalDesign.size = customizations.size;
    }
    
    return finalDesign;
}

// Function to generate background image (simplified version)
async function generateBackgroundImage(designData, format, dimensions) {
    // This is a simplified version - in production, you would use a proper image generation library
    // For now, we'll create a simple SVG and convert it
    
    const width = dimensions?.width || 1920;
    const height = dimensions?.height || 1080;
    
    let svg = '';
    
    if (designData.type === 'gradient') {
        const colors = designData.colors || ['#1e3a8a', '#3b82f6'];
        const direction = designData.direction === 'diagonal' ? '45deg' : '90deg';
        
        svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:${colors[0]};stop-opacity:${designData.opacity || 0.9}" />
                    <stop offset="50%" style="stop-color:${colors[1] || colors[0]};stop-opacity:${designData.opacity || 0.9}" />
                    <stop offset="100%" style="stop-color:${colors[2] || colors[1] || colors[0]};stop-opacity:${designData.opacity || 0.9}" />
                </linearGradient>
            </defs>
            <rect width="${width}" height="${height}" fill="url(#grad1)" />
        </svg>`;
    } else if (designData.type === 'pattern') {
        const baseColor = designData.baseColor || '#f8fafc';
        const accentColor = designData.accentColor || '#0ea5e9';
        
        svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
            <rect width="${width}" height="${height}" fill="${baseColor}" />
            <defs>
                <pattern id="hexPattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                    <polygon points="20,5 35,15 35,25 20,35 5,25 5,15" fill="none" stroke="${accentColor}" stroke-width="1" opacity="${designData.opacity || 0.1}"/>
                </pattern>
            </defs>
            <rect width="${width}" height="${height}" fill="url(#hexPattern)" />
        </svg>`;
    } else {
        // Default mesh pattern
        const colors = designData.colors || ['#0f172a', '#1e293b'];
        
        svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
            <rect width="${width}" height="${height}" fill="${colors[0]}" />
            <defs>
                <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="${colors[1]}" stroke-width="0.5" opacity="0.3"/>
                </pattern>
            </defs>
            <rect width="${width}" height="${height}" fill="url(#grid)" />
        </svg>`;
    }
    
    // Convert SVG to bytes (simplified)
    const svgBytes = new TextEncoder().encode(svg);
    return svgBytes;
}