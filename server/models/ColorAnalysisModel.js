const { pool } = require('../database/connection');

class ColorAnalysisModel {
  static async createRequest(data) {
    const client = await pool.connect();
    try {
      const result = await client.query(`
        INSERT INTO color_analysis_requests (
          source_type, source_url, file_name, status
        ) VALUES ($1, $2, $3, $4)
        RETURNING *;
      `, [data.source_type, data.source_url, data.file_name, 'processing']);
      
      return result.rows[0];
    } finally {
      client.release();
    }
  }
  
  static async updateRequest(requestId, data) {
    const client = await pool.connect();
    try {
      const result = await client.query(`
        UPDATE color_analysis_requests 
        SET analysis_results = $1, extracted_colors = $2, extracted_fonts = $3, 
            powerbi_theme_json = $4, status = $5, error_message = $6
        WHERE id = $7
        RETURNING *;
      `, [
        data.analysis_results,
        data.extracted_colors,
        data.extracted_fonts,
        data.powerbi_theme_json,
        data.status,
        data.error_message,
        requestId
      ]);
      
      return result.rows[0];
    } finally {
      client.release();
    }
  }
  
  static async getRequest(requestId) {
    const client = await pool.connect();
    try {
      const result = await client.query('SELECT * FROM color_analysis_requests WHERE id = $1', [requestId]);
      return result.rows[0];
    } finally {
      client.release();
    }
  }
  
  static async getRecentRequests(limit = 50) {
    const client = await pool.connect();
    try {
      const result = await client.query(`
        SELECT * FROM color_analysis_requests 
        ORDER BY created_at DESC 
        LIMIT $1
      `, [limit]);
      return result.rows;
    } finally {
      client.release();
    }
  }
}

module.exports = ColorAnalysisModel;