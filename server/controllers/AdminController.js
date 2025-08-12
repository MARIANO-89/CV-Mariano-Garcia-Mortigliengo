const AdminModel = require('../models/AdminModel');
const CVModel = require('../models/CVModel');
const ColorAnalysisModel = require('../models/ColorAnalysisModel');
const BackgroundDesignModel = require('../models/BackgroundDesignModel');

class AdminController {
  // Get admin dashboard statistics
  static async getDashboardStats(req, res) {
    try {
      const stats = await AdminModel.getAdminStats();
      
      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      console.error('Error obteniendo estadísticas:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }
  
  // Get recent activity
  static async getRecentActivity(req, res) {
    try {
      const limit = parseInt(req.query.limit) || 20;
      
      const recentAnalysis = await ColorAnalysisModel.getRecentRequests(limit);
      
      res.json({
        success: true,
        data: {
          recent_analysis: recentAnalysis
        }
      });
    } catch (error) {
      console.error('Error obteniendo actividad reciente:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }
  
  // Get all color analysis requests with pagination
  static async getColorAnalysisRequests(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 20;
      const offset = (page - 1) * limit;
      
      // This would require updating the model to support pagination
      const requests = await ColorAnalysisModel.getRecentRequests(limit);
      
      res.json({
        success: true,
        data: {
          requests,
          pagination: {
            page,
            limit,
            hasMore: requests.length === limit
          }
        }
      });
    } catch (error) {
      console.error('Error obteniendo solicitudes de análisis:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }
  
  // Get all background designs
  static async getBackgroundDesigns(req, res) {
    try {
      const designs = await BackgroundDesignModel.getAllDesigns();
      
      res.json({
        success: true,
        data: designs
      });
    } catch (error) {
      console.error('Error obteniendo diseños de fondo:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }
  
  // Create new background design
  static async createBackgroundDesign(req, res) {
    try {
      const designData = req.body;
      
      // Validate required fields
      if (!designData.name || !designData.template_data) {
        return res.status(400).json({
          success: false,
          message: 'Nombre y datos de plantilla son requeridos'
        });
      }
      
      // Validate template_data is valid JSON
      if (typeof designData.template_data === 'string') {
        try {
          designData.template_data = JSON.parse(designData.template_data);
        } catch (e) {
          return res.status(400).json({
            success: false,
            message: 'Datos de plantilla deben ser JSON válido'
          });
        }
      }
      
      const newDesign = await BackgroundDesignModel.createDesign(designData);
      
      res.status(201).json({
        success: true,
        data: newDesign,
        message: 'Diseño de fondo creado exitosamente'
      });
    } catch (error) {
      console.error('Error creando diseño de fondo:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }
  
  // Update background design
  static async updateBackgroundDesign(req, res) {
    try {
      const designId = req.params.designId;
      const updateData = req.body;
      
      // Validate template_data if provided
      if (updateData.template_data && typeof updateData.template_data === 'string') {
        try {
          updateData.template_data = JSON.parse(updateData.template_data);
        } catch (e) {
          return res.status(400).json({
            success: false,
            message: 'Datos de plantilla deben ser JSON válido'
          });
        }
      }
      
      const updatedDesign = await BackgroundDesignModel.updateDesign(designId, updateData);
      
      if (!updatedDesign) {
        return res.status(404).json({
          success: false,
          message: 'Diseño de fondo no encontrado'
        });
      }
      
      res.json({
        success: true,
        data: updatedDesign,
        message: 'Diseño de fondo actualizado exitosamente'
      });
    } catch (error) {
      console.error('Error actualizando diseño de fondo:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }
}

module.exports = AdminController;