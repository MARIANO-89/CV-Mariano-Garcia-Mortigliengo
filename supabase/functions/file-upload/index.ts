Deno.serve(async (req) => {
    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
        'Access-Control-Max-Age': '86400',
        'Access-Control-Allow-Credentials': 'false'
    };

    if (req.method === 'OPTIONS') {
        return new Response(null, { status: 200, headers: corsHeaders });
    }

    try {
        const { imageData, fileName, folder } = await req.json();

        if (!imageData || !fileName) {
            throw new Error('Datos de imagen y nombre de archivo son requeridos');
        }

        // Get environment variables
        const supabaseUrl = Deno.env.get('SUPABASE_URL');
        const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

        if (!supabaseUrl || !serviceRoleKey) {
            throw new Error('Configuración de Supabase faltante');
        }

        // Extract base64 data
        const base64Data = imageData.split(',')[1];
        const mimeType = imageData.split(';')[0].split(':')[1];
        
        // Convert to binary
        const binaryData = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
        
        // Determine folder structure
        const folderPath = folder || 'general';
        const fullPath = `${folderPath}/${fileName}`;

        // Upload to Supabase Storage
        const uploadResponse = await fetch(`${supabaseUrl}/storage/v1/object/cv-assets/${fullPath}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${serviceRoleKey}`,
                'Content-Type': mimeType,
                'x-upsert': 'true'
            },
            body: binaryData
        });

        if (!uploadResponse.ok) {
            const errorText = await uploadResponse.text();
            throw new Error(`Error subiendo archivo: ${errorText}`);
        }

        // Get public URL
        const publicUrl = `${supabaseUrl}/storage/v1/object/public/cv-assets/${fullPath}`;

        console.log('Archivo subido exitosamente:', publicUrl);

        return new Response(JSON.stringify({
            success: true,
            data: {
                publicUrl,
                fileName,
                folder: folderPath,
                fileSize: binaryData.length,
                mimeType
            },
            message: 'Archivo subido exitosamente'
        }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Error en subida de archivo:', error);

        return new Response(JSON.stringify({
            success: false,
            error: {
                code: 'FILE_UPLOAD_FAILED',
                message: error.message
            }
        }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
});