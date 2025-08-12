const { pool } = require('../database/connection');
const bcrypt = require('bcryptjs');

class AdminModel {
  static async findByEmail(email) {
    const client = await pool.connect();
    try {
      const result = await client.query(`
        SELECT au.*, cp.name, cp.profile_image_url 
        FROM admin_users au
        LEFT JOIN cv_profiles cp ON au.user_id = cp.id
        WHERE au.email = $1 AND au.is_active = true
      `, [email]);
      return result.rows[0];
    } finally {
      client.release();
    }
  }
  
  static async validatePassword(email, password) {
    const client = await pool.connect();
    try {
      const user = await this.findByEmail(email);
      if (!user) return null;
      
      const isValid = await bcrypt.compare(password, user.password_hash);
      if (!isValid) return null;
      
      // Update last login
      await client.query(
        'UPDATE admin_users SET last_login = NOW() WHERE id = $1',
        [user.id]
      );
      
      // Return user without password
      const { password_hash, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } finally {
      client.release();
    }
  }
  
  static async createAdmin(data) {
    const client = await pool.connect();
    try {
      const hashedPassword = await bcrypt.hash(data.password, 12);
      
      const result = await client.query(`
        INSERT INTO admin_users (
          user_id, email, password_hash, is_admin, is_active
        ) VALUES ($1, $2, $3, $4, $5)
        RETURNING id, user_id, email, is_admin, is_active, created_at;
      `, [
        data.user_id,
        data.email,
        hashedPassword,
        data.is_admin !== false,
        data.is_active !== false
      ]);
      
      return result.rows[0];
    } finally {
      client.release();
    }
  }
  
  static async updatePassword(userId, newPassword) {
    const client = await pool.connect();
    try {
      const hashedPassword = await bcrypt.hash(newPassword, 12);
      
      const result = await client.query(`
        UPDATE admin_users 
        SET password_hash = $1, updated_at = NOW()
        WHERE user_id = $2
        RETURNING id, email, is_admin;
      `, [hashedPassword, userId]);
      
      return result.rows[0];
    } finally {
      client.release();
    }
  }
  
  static async getAdminStats() {
    const client = await pool.connect();
    try {
      const [profilesCount, analysisCount, designsCount, recentAnalysis] = await Promise.all([
        client.query('SELECT COUNT(*) FROM cv_profiles WHERE is_active = true'),
        client.query('SELECT COUNT(*) FROM color_analysis_requests WHERE status = $1', ['completed']),
        client.query('SELECT COUNT(*) FROM background_designs WHERE is_active = true'),
        client.query(`
          SELECT source_type, COUNT(*) as count 
          FROM color_analysis_requests 
          WHERE created_at >= NOW() - INTERVAL '30 days'
          GROUP BY source_type
        `)
      ]);
      
      return {
        total_profiles: parseInt(profilesCount.rows[0].count),
        total_analysis: parseInt(analysisCount.rows[0].count),
        total_designs: parseInt(designsCount.rows[0].count),
        recent_analysis_by_type: recentAnalysis.rows
      };
    } finally {
      client.release();
    }
  }
}

module.exports = AdminModel;