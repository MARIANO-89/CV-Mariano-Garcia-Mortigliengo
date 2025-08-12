const AdminModel = require('../models/AdminModel');
const { generateToken } = require('../middleware/auth');

class AuthController {
  // Login endpoint
  static async login(req, res) {
    try {
      const { email, password } = req.body;
      
      // Validate input
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Email y contraseña son requeridos'
        });
      }
      
      // Validate email format
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({
          success: false,
          message: 'Formato de email inválido'
        });
      }
      
      // Validate user credentials
      const user = await AdminModel.validatePassword(email, password);
      
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Credenciales inválidas'
        });
      }
      
      // Generate JWT token
      const token = generateToken(user);
      
      res.json({
        success: true,
        data: {
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            is_admin: user.is_admin,
            profile_image_url: user.profile_image_url
          },
          token
        },
        message: 'Inicio de sesión exitoso'
      });
    } catch (error) {
      console.error('Error en login:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }
  
  // Get current user info (requires auth)
  static async getMe(req, res) {
    try {
      const user = req.user;
      
      res.json({
        success: true,
        data: {
          id: user.id,
          email: user.email,
          name: user.name,
          is_admin: user.is_admin,
          profile_image_url: user.profile_image_url,
          last_login: user.last_login
        }
      });
    } catch (error) {
      console.error('Error obteniendo usuario actual:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }
  
  // Refresh token (requires auth)
  static async refreshToken(req, res) {
    try {
      const user = req.user;
      const newToken = generateToken(user);
      
      res.json({
        success: true,
        data: {
          token: newToken
        },
        message: 'Token renovado exitosamente'
      });
    } catch (error) {
      console.error('Error renovando token:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }
  
  // Change password (requires auth)
  static async changePassword(req, res) {
    try {
      const { currentPassword, newPassword, confirmPassword } = req.body;
      const user = req.user;
      
      // Validate input
      if (!currentPassword || !newPassword || !confirmPassword) {
        return res.status(400).json({
          success: false,
          message: 'Todos los campos son requeridos'
        });
      }
      
      if (newPassword !== confirmPassword) {
        return res.status(400).json({
          success: false,
          message: 'Las contraseñas no coinciden'
        });
      }
      
      if (newPassword.length < 6) {
        return res.status(400).json({
          success: false,
          message: 'La contraseña debe tener al menos 6 caracteres'
        });
      }
      
      // Verify current password
      const validUser = await AdminModel.validatePassword(user.email, currentPassword);
      
      if (!validUser) {
        return res.status(401).json({
          success: false,
          message: 'Contraseña actual incorrecta'
        });
      }
      
      // Update password
      await AdminModel.updatePassword(user.user_id, newPassword);
      
      res.json({
        success: true,
        message: 'Contraseña actualizada exitosamente'
      });
    } catch (error) {
      console.error('Error cambiando contraseña:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }
  
  // Logout (client-side token removal, but we can track it)
  static async logout(req, res) {
    try {
      // Here you could add token blacklisting if needed
      // For now, we'll just send a success response
      
      res.json({
        success: true,
        message: 'Sesión cerrada exitosamente'
      });
    } catch (error) {
      console.error('Error en logout:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }
}

module.exports = AuthController;