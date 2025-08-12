const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);
  
  // Multer errors (file upload)
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      success: false,
      message: 'El archivo es demasiado grande',
      error_code: 'FILE_TOO_LARGE'
    });
  }
  
  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    return res.status(400).json({
      success: false,
      message: 'Tipo de archivo no permitido',
      error_code: 'INVALID_FILE_TYPE'
    });
  }
  
  // Database errors
  if (err.code === '23505') { // Unique violation
    return res.status(409).json({
      success: false,
      message: 'El recurso ya existe',
      error_code: 'DUPLICATE_RESOURCE'
    });
  }
  
  if (err.code === '23503') { // Foreign key violation
    return res.status(400).json({
      success: false,
      message: 'Referencia inválida',
      error_code: 'INVALID_REFERENCE'
    });
  }
  
  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Token inválido',
      error_code: 'INVALID_TOKEN'
    });
  }
  
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Token expirado',
      error_code: 'TOKEN_EXPIRED'
    });
  }
  
  // Validation errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Datos de entrada inválidos',
      error_code: 'VALIDATION_ERROR',
      details: err.details
    });
  }
  
  // Default error
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Error interno del servidor';
  
  res.status(statusCode).json({
    success: false,
    message,
    error_code: 'INTERNAL_ERROR',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = errorHandler;