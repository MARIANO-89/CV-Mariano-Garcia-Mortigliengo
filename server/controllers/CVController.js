const CVModel = require('../models/CVModel');

class CVController {
  // Get complete CV profile (public endpoint)
  static async getProfile(req, res) {
    try {
      const profileId = req.params.id;
      const profile = await CVModel.getCompleteProfile(profileId);
      
      if (!profile) {
        return res.status(404).json({
          success: false,
          message: 'Perfil no encontrado'
        });
      }
      
      res.json({
        success: true,
        data: profile
      });
    } catch (error) {
      console.error('Error obteniendo perfil:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }
  
  // Get main CV profile (public endpoint)
  static async getMainProfile(req, res) {
    try {
      const profile = await CVModel.getCompleteProfile(); // Gets first active profile
      
      if (!profile) {
        return res.status(404).json({
          success: false,
          message: 'Perfil no encontrado'
        });
      }
      
      res.json({
        success: true,
        data: profile
      });
    } catch (error) {
      console.error('Error obteniendo perfil principal:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }
  
  // Update profile (admin only)
  static async updateProfile(req, res) {
    try {
      const profileId = req.params.id;
      const updateData = req.body;
      
      // Validate required fields if provided
      if (updateData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(updateData.email)) {
        return res.status(400).json({
          success: false,
          message: 'Email inválido'
        });
      }
      
      const updatedProfile = await CVModel.updateProfile(profileId, updateData);
      
      if (!updatedProfile) {
        return res.status(404).json({
          success: false,
          message: 'Perfil no encontrado'
        });
      }
      
      res.json({
        success: true,
        data: updatedProfile,
        message: 'Perfil actualizado exitosamente'
      });
    } catch (error) {
      console.error('Error actualizando perfil:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }
  
  // Add new experience (admin only)
  static async addExperience(req, res) {
    try {
      const profileId = req.params.profileId;
      const experienceData = req.body;
      
      // Validate required fields
      if (!experienceData.company_name || !experienceData.position) {
        return res.status(400).json({
          success: false,
          message: 'Nombre de empresa y posición son requeridos'
        });
      }
      
      const newExperience = await CVModel.addExperience(profileId, experienceData);
      
      res.status(201).json({
        success: true,
        data: newExperience,
        message: 'Experiencia agregada exitosamente'
      });
    } catch (error) {
      console.error('Error agregando experiencia:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }
  
  // Update experience (admin only)
  static async updateExperience(req, res) {
    try {
      const experienceId = req.params.experienceId;
      const updateData = req.body;
      
      const updatedExperience = await CVModel.updateExperience(experienceId, updateData);
      
      if (!updatedExperience) {
        return res.status(404).json({
          success: false,
          message: 'Experiencia no encontrada'
        });
      }
      
      res.json({
        success: true,
        data: updatedExperience,
        message: 'Experiencia actualizada exitosamente'
      });
    } catch (error) {
      console.error('Error actualizando experiencia:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }
  
  // Delete experience (admin only)
  static async deleteExperience(req, res) {
    try {
      const experienceId = req.params.experienceId;
      
      const deletedExperience = await CVModel.deleteExperience(experienceId);
      
      if (!deletedExperience) {
        return res.status(404).json({
          success: false,
          message: 'Experiencia no encontrada'
        });
      }
      
      res.json({
        success: true,
        message: 'Experiencia eliminada exitosamente'
      });
    } catch (error) {
      console.error('Error eliminando experiencia:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }
  
  // Add education (admin only)
  static async addEducation(req, res) {
    try {
      const profileId = req.params.profileId;
      const educationData = req.body;
      
      // Validate required fields
      if (!educationData.institution || !educationData.degree) {
        return res.status(400).json({
          success: false,
          message: 'Institución y título son requeridos'
        });
      }
      
      const newEducation = await CVModel.addEducation(profileId, educationData);
      
      res.status(201).json({
        success: true,
        data: newEducation,
        message: 'Educación agregada exitosamente'
      });
    } catch (error) {
      console.error('Error agregando educación:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }
  
  // Add skill (admin only)
  static async addSkill(req, res) {
    try {
      const profileId = req.params.profileId;
      const skillData = req.body;
      
      // Validate required fields
      if (!skillData.skill_name) {
        return res.status(400).json({
          success: false,
          message: 'Nombre de habilidad es requerido'
        });
      }
      
      const newSkill = await CVModel.addSkill(profileId, skillData);
      
      res.status(201).json({
        success: true,
        data: newSkill,
        message: 'Habilidad agregada exitosamente'
      });
    } catch (error) {
      console.error('Error agregando habilidad:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }
}

module.exports = CVController;