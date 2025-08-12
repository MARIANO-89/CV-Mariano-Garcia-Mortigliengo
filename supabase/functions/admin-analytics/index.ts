Deno.serve(async (req) => {
    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Max-Age': '86400',
        'Access-Control-Allow-Credentials': 'false'
    };

    if (req.method === 'OPTIONS') {
        return new Response(null, { status: 200, headers: corsHeaders });
    }

    try {
        const { adminUserId } = await req.json();

        // Get environment variables
        const supabaseUrl = Deno.env.get('SUPABASE_URL');
        const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

        if (!supabaseUrl || !serviceRoleKey) {
            throw new Error('Configuración de Supabase faltante');
        }

        // Get admin authentication
        const authHeader = req.headers.get('authorization');
        if (!authHeader) {
            throw new Error('Autorización requerida');
        }

        // Verify admin permissions
        const token = authHeader.replace('Bearer ', '');
        const userResponse = await fetch(`${supabaseUrl}/auth/v1/user`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'apikey': serviceRoleKey
            }
        });

        if (!userResponse.ok) {
            throw new Error('Token inválido');
        }

        const userData = await userResponse.json();
        const currentUserId = userData.id;

        // Check if current user is admin
        const adminCheckResponse = await fetch(`${supabaseUrl}/rest/v1/admin_users?user_id=eq.${currentUserId}&is_admin=eq.true&is_active=eq.true`, {
            headers: {
                'Authorization': `Bearer ${serviceRoleKey}`,
                'apikey': serviceRoleKey
            }
        });

        if (!adminCheckResponse.ok) {
            throw new Error('Error verificando permisos');
        }

        const adminUsers = await adminCheckResponse.json();
        if (adminUsers.length === 0) {
            throw new Error('Permisos insuficientes');
        }

        // Get comprehensive analytics data
        const [profilesRes, experiencesRes, skillsRes, projectsRes, analysisRes, designsRes] = await Promise.all([
            fetch(`${supabaseUrl}/rest/v1/cv_profiles?select=*`, {
                headers: { 'Authorization': `Bearer ${serviceRoleKey}`, 'apikey': serviceRoleKey }
            }),
            fetch(`${supabaseUrl}/rest/v1/cv_experiences?select=*`, {
                headers: { 'Authorization': `Bearer ${serviceRoleKey}`, 'apikey': serviceRoleKey }
            }),
            fetch(`${supabaseUrl}/rest/v1/cv_skills?select=*`, {
                headers: { 'Authorization': `Bearer ${serviceRoleKey}`, 'apikey': serviceRoleKey }
            }),
            fetch(`${supabaseUrl}/rest/v1/cv_projects?select=*`, {
                headers: { 'Authorization': `Bearer ${serviceRoleKey}`, 'apikey': serviceRoleKey }
            }),
            fetch(`${supabaseUrl}/rest/v1/color_analysis_requests?select=*&order=created_at.desc&limit=50`, {
                headers: { 'Authorization': `Bearer ${serviceRoleKey}`, 'apikey': serviceRoleKey }
            }),
            fetch(`${supabaseUrl}/rest/v1/background_designs?select=*`, {
                headers: { 'Authorization': `Bearer ${serviceRoleKey}`, 'apikey': serviceRoleKey }
            })
        ]);

        const profiles = await profilesRes.json();
        const experiences = await experiencesRes.json();
        const skills = await skillsRes.json();
        const projects = await projectsRes.json();
        const analyses = await analysisRes.json();
        const designs = await designsRes.json();

        // Calculate analytics
        const analytics = {
            overview: {
                totalProfiles: profiles.length,
                totalExperiences: experiences.length,
                totalSkills: skills.length,
                totalProjects: projects.length,
                totalAnalyses: analyses.length,
                totalDesigns: designs.length
            },
            recentActivity: {
                analysesThisMonth: analyses.filter(a => {
                    const createdDate = new Date(a.created_at);
                    const now = new Date();
                    return createdDate.getMonth() === now.getMonth() && createdDate.getFullYear() === now.getFullYear();
                }).length,
                topSkillCategories: getTopSkillCategories(skills),
                recentAnalyses: analyses.slice(0, 10)
            },
            usage: {
                analysisByType: getAnalysisByType(analyses),
                popularDesigns: getPopularDesigns(designs),
                skillDistribution: getSkillDistribution(skills)
            },
            timestamp: new Date().toISOString()
        };

        console.log('Analytics generadas para admin:', currentUserId);

        return new Response(JSON.stringify({
            success: true,
            data: analytics,
            message: 'Analytics obtenidas exitosamente'
        }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Error obteniendo analytics:', error);

        return new Response(JSON.stringify({
            success: false,
            error: {
                code: 'ANALYTICS_FAILED',
                message: error.message
            }
        }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
});

// Helper functions
function getTopSkillCategories(skills) {
    const categories = {};
    skills.forEach(skill => {
        const category = skill.category || 'Other';
        categories[category] = (categories[category] || 0) + 1;
    });
    
    return Object.entries(categories)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([category, count]) => ({ category, count }));
}

function getAnalysisByType(analyses) {
    const types = {};
    analyses.forEach(analysis => {
        const type = analysis.source_type || 'unknown';
        types[type] = (types[type] || 0) + 1;
    });
    
    return Object.entries(types).map(([type, count]) => ({ type, count }));
}

function getPopularDesigns(designs) {
    return designs
        .filter(d => d.is_active)
        .sort((a, b) => (b.usage_count || 0) - (a.usage_count || 0))
        .slice(0, 3)
        .map(design => ({
            id: design.id,
            name: design.name,
            usageCount: design.usage_count || 0
        }));
}

function getSkillDistribution(skills) {
    const distribution = {};
    skills.forEach(skill => {
        const level = skill.proficiency_level || 'Unknown';
        distribution[level] = (distribution[level] || 0) + 1;
    });
    
    return Object.entries(distribution).map(([level, count]) => ({ level, count }));
}