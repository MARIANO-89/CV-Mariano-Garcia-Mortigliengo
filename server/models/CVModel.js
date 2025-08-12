const { pool } = require('../database/connection');

class CVModel {
  // Get complete CV profile with all related data
  static async getCompleteProfile(profileId = null) {
    const client = await pool.connect();
    try {
      // Get main profile (if no ID provided, get the first active one)
      let profileQuery = `
        SELECT * FROM cv_profiles 
        WHERE is_active = true
      `;
      let profileParams = [];
      
      if (profileId) {
        profileQuery += ` AND id = $1`;
        profileParams = [profileId];
      } else {
        profileQuery += ` ORDER BY created_at ASC LIMIT 1`;
      }
      
      const profileResult = await client.query(profileQuery, profileParams);
      
      if (profileResult.rows.length === 0) {
        return null;
      }
      
      const profile = profileResult.rows[0];
      
      // Get all related data
      const [experiences, education, certifications, languages, skills, projects] = await Promise.all([
        client.query('SELECT * FROM cv_experiences WHERE profile_id = $1 ORDER BY order_index, start_date DESC', [profile.id]),
        client.query('SELECT * FROM cv_education WHERE profile_id = $1 ORDER BY order_index, graduation_date DESC', [profile.id]),
        client.query('SELECT * FROM cv_certifications WHERE profile_id = $1 ORDER BY order_index, issue_date DESC', [profile.id]),
        client.query('SELECT * FROM cv_languages WHERE profile_id = $1 ORDER BY order_index', [profile.id]),
        client.query('SELECT * FROM cv_skills WHERE profile_id = $1 ORDER BY order_index, category', [profile.id]),
        client.query('SELECT * FROM cv_projects WHERE profile_id = $1 ORDER BY order_index, start_date DESC', [profile.id])
      ]);
      
      return {
        ...profile,
        experiences: experiences.rows,
        education: education.rows,
        certifications: certifications.rows,
        languages: languages.rows,
        skills: skills.rows,
        projects: projects.rows
      };
    } finally {
      client.release();
    }
  }
  
  // Update profile basic information
  static async updateProfile(profileId, data) {
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
      values.push(profileId);
      
      const query = `
        UPDATE cv_profiles 
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
  
  // CRUD operations for experiences
  static async addExperience(profileId, data) {
    const client = await pool.connect();
    try {
      const result = await client.query(`
        INSERT INTO cv_experiences (
          profile_id, company_name, position, start_date, end_date,
          description_es, description_en, is_current, order_index
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING *;
      `, [
        profileId, data.company_name, data.position, data.start_date, data.end_date,
        data.description_es, data.description_en, data.is_current, data.order_index || 0
      ]);
      return result.rows[0];
    } finally {
      client.release();
    }
  }
  
  static async updateExperience(experienceId, data) {
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
      values.push(experienceId);
      
      const query = `
        UPDATE cv_experiences 
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
  
  static async deleteExperience(experienceId) {
    const client = await pool.connect();
    try {
      const result = await client.query('DELETE FROM cv_experiences WHERE id = $1 RETURNING *', [experienceId]);
      return result.rows[0];
    } finally {
      client.release();
    }
  }
  
  // Similar CRUD operations for other CV sections
  static async addEducation(profileId, data) {
    const client = await pool.connect();
    try {
      const result = await client.query(`
        INSERT INTO cv_education (
          profile_id, institution, degree, field_of_study, graduation_date,
          description_es, description_en, order_index
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *;
      `, [
        profileId, data.institution, data.degree, data.field_of_study, data.graduation_date,
        data.description_es, data.description_en, data.order_index || 0
      ]);
      return result.rows[0];
    } finally {
      client.release();
    }
  }
  
  static async addSkill(profileId, data) {
    const client = await pool.connect();
    try {
      const result = await client.query(`
        INSERT INTO cv_skills (
          profile_id, skill_name, category, proficiency_level, years_experience,
          description_es, description_en, order_index
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *;
      `, [
        profileId, data.skill_name, data.category, data.proficiency_level, data.years_experience,
        data.description_es, data.description_en, data.order_index || 0
      ]);
      return result.rows[0];
    } finally {
      client.release();
    }
  }
}

module.exports = CVModel;