const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/auth');
const cvRoutes = require('./routes/cv');
const adminRoutes = require('./routes/admin');
const colorAnalysisRoutes = require('./routes/colorAnalysis');
const backgroundDesignRoutes = require('./routes/backgroundDesign');

// Import middleware
const errorHandler = require('./middleware/errorHandler');
const { initializeDatabase } = require('./database/connection');

const app = express();
const PORT = process.env.PORT || 5000;

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'production' ? 100 : 1000, // limit each IP to 100 requests per windowMs in production
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Middleware
app.use(helmet());
app.use(compression());
app.use(limiter);
app.use(morgan('combined'));

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:5173',
      process.env.CLIENT_URL
    ].filter(Boolean);
    
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0'
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/cv', cvRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/color-analysis', colorAnalysisRoutes);
app.use('/api/background-design', backgroundDesignRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'CV Power BI API Server', 
    version: '1.0.0',
    author: 'MiniMax Agent',
    description: 'Backend API para la aplicación CV profesional de Mariano García Mortigliengo con herramientas Power BI'
  });
});

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    success: false, 
    message: 'Ruta no encontrada',
    path: req.originalUrl 
  });
});

// Initialize database and start server
async function startServer() {
  try {
    // Initialize database connection
    await initializeDatabase();
    console.log('✅ Base de datos conectada exitosamente');
    
    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
      console.log(`📊 Entorno: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🌐 Health check: http://localhost:${PORT}/health`);
      console.log(`📝 CV API: http://localhost:${PORT}/api/cv`);
      console.log(`🎨 Color Analysis API: http://localhost:${PORT}/api/color-analysis`);
      console.log(`🖼️ Background Design API: http://localhost:${PORT}/api/background-design`);
      console.log(`🔧 Admin Panel API: http://localhost:${PORT}/api/admin`);
    });
  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🔄 Cerrando servidor...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🔄 Cerrando servidor...');
  process.exit(0);
});

startServer();

module.exports = app;