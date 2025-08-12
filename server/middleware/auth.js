const jwt = require('jsonwebtoken');
const AdminModel = require('../models/AdminModel');

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
  
  if (!token) {
    return res.status(401).json({ 
      success: false, 
      message: 'Token de acceso requerido' 
    });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Verify user still exists and is active
    const user = await AdminModel.findByEmail(decoded.email);
    
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Token inválido - usuario no encontrado' 
      });
    }
    
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false, 
        message: 'Token expirado' 
      });
    }
    
    return res.status(401).json({ 
      success: false, 
      message: 'Token inválido' 
    });
  }
};

const requireAdmin = (req, res, next) => {
  if (!req.user || !req.user.is_admin) {
    return res.status(403).json({ 
      success: false, 
      message: 'Acceso denegado - se requieren privilegios de administrador' 
    });
  }
  next();
};

const generateToken = (user) => {
  const payload = {
    id: user.id,
    email: user.email,
    user_id: user.user_id,
    is_admin: user.is_admin
  };
  
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
};

module.exports = {
  authenticateToken,
  requireAdmin,
  generateToken
};