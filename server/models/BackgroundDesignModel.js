const { pool } = require('../database/connection');

class BackgroundDesignModel {
  static async getAllDesigns() {
    const client = await pool.connect();
    try {
      const result = await client.query(`
        SELECT * FROM background_designs 
        WHERE is_active = true 
        ORDER BY order_index, created_at
      `);
      return result.rows;
    } finally {
      client.release();
    }
  }
  
  static async getDesign(designId) {
    const client = await pool.connect();
    try {
      const result = await client.query('SELECT * FROM background_designs WHERE id = $1', [designId]);
      return result.rows[0];
    } finally {
      client.release();
    }
  }
  
  static async createDesign(data) {
    const client = await pool.connect();
    try {
      const result = await client.query(`
        INSERT INTO background_designs (
          name, description_es, description_en, template_data, 
          preview_image_url, is_active, order_index
        ) VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *;
      `, [
        data.name,
        data.description_es,
        data.description_en,
        data.template_data,
        data.preview_image_url,
        data.is_active !== false,
        data.order_index || 0
      ]);
      return result.rows[0];
    } finally {
      client.release();
    }
  }
  
  static async updateDesign(designId, data) {
    const client = await pool.connect();
    try {
      const updateFields = [];
      const values = [];
      let paramCount = 1;
      
      Object.keys(data).forEach(key => {
        if (data[key] !== undefined) {
          updateFields.push(`${key} = $${paramCount}`);
          values.push(data[key]);
          paramCount++;
        }
      });
      
      updateFields.push(`updated_at = NOW()`);
      values.push(designId);
      
      const query = `
        UPDATE background_designs 
        SET ${updateFields.join(', ')}
        WHERE id = $${paramCount}
        RETURNING *;
      `;
      
      const result = await client.query(query, values);
      return result.rows[0];
    } finally {
      client.release();
    }
  }
}

module.exports = BackgroundDesignModel;