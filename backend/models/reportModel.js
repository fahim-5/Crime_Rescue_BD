const { pool } = require("../config/db");

class ReportModel {
  /**
   * Create a new crime report
   * @returns {Promise<number>} The ID of the created report
   */
  static async create(location, time, crimeType, numCriminals, victimGender, armed, photos = [], videos = []) {
    const connection = await pool.getConnection();
    try {
      const query = `
        INSERT INTO crime_reports 
          (location, time, crime_type, num_criminals, victim_gender, armed, photos, videos)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `;
      
      const [result] = await connection.query(query, [
        location,
        new Date(time),
        crimeType,
        numCriminals,
        victimGender,
        armed,
        JSON.stringify(photos),
        JSON.stringify(videos)
      ]);
      
      return result.insertId;
    } catch (error) {
      console.error('Error creating report:', error);
      throw new Error('Failed to create report');
    } finally {
      connection.release();
    }
  }

  /**
   * Get all reports with parsed media arrays
   * @returns {Promise<Array>} Array of report objects
   */
  static async getAll() {
    const connection = await pool.getConnection();
    try {
      const [reports] = await connection.query(`
        SELECT *, 
          JSON_UNQUOTE(photos) as photos,
          JSON_UNQUOTE(videos) as videos 
        FROM crime_reports 
        ORDER BY created_at DESC
      `);
      
      return reports.map(report => ({
        ...report,
        photos: report.photos ? JSON.parse(report.photos) : [],
        videos: report.videos ? JSON.parse(report.videos) : []
      }));
    } catch (error) {
      console.error('Error fetching reports:', error);
      throw new Error('Failed to fetch reports');
    } finally {
      connection.release();
    }
  }

  /**
   * Get a single report by ID
   * @returns {Promise<Object|null>} The report object or null if not found
   */
  static async getById(id) {
    const connection = await pool.getConnection();
    try {
      const [reports] = await connection.query(`
        SELECT *, 
          JSON_UNQUOTE(photos) as photos,
          JSON_UNQUOTE(videos) as videos 
        FROM crime_reports 
        WHERE id = ?
      `, [id]);
      
      if (reports.length === 0) return null;
      
      const report = reports[0];
      return {
        ...report,
        photos: report.photos ? JSON.parse(report.photos) : [],
        videos: report.videos ? JSON.parse(report.videos) : []
      };
    } catch (error) {
      console.error('Error fetching report:', error);
      throw new Error('Failed to fetch report');
    } finally {
      connection.release();
    }
  }

  /**
   * Update a report by ID
   * @returns {Promise<number>} Number of affected rows
   */
  static async update(id, updates) {
    const connection = await pool.getConnection();
    try {
      const fieldsToUpdate = [];
      const values = [];
      
      // Dynamic field updates
      if (updates.location !== undefined) {
        fieldsToUpdate.push("location = ?");
        values.push(updates.location);
      }
      if (updates.time !== undefined) {
        fieldsToUpdate.push("time = ?");
        values.push(new Date(updates.time));
      }
      if (updates.crimeType !== undefined) {
        fieldsToUpdate.push("crime_type = ?");
        values.push(updates.crimeType);
      }
      if (updates.numCriminals !== undefined) {
        fieldsToUpdate.push("num_criminals = ?");
        values.push(updates.numCriminals);
      }
      if (updates.victimGender !== undefined) {
        fieldsToUpdate.push("victim_gender = ?");
        values.push(updates.victimGender);
      }
      if (updates.armed !== undefined) {
        fieldsToUpdate.push("armed = ?");
        values.push(updates.armed);
      }
      if (updates.photos !== undefined) {
        fieldsToUpdate.push("photos = ?");
        values.push(JSON.stringify(updates.photos));
      }
      if (updates.videos !== undefined) {
        fieldsToUpdate.push("videos = ?");
        values.push(JSON.stringify(updates.videos));
      }
      
      if (fieldsToUpdate.length === 0) {
        throw new Error("No valid fields provided for update");
      }
      
      values.push(id);
      const query = `UPDATE crime_reports SET ${fieldsToUpdate.join(", ")} WHERE id = ?`;
      
      const [result] = await connection.query(query, values);
      return result.affectedRows;
    } catch (error) {
      console.error('Error updating report:', error);
      throw new Error('Failed to update report');
    } finally {
      connection.release();
    }
  }

  /**
   * Delete a report by ID
   * @returns {Promise<number>} Number of affected rows
   */
  static async delete(id) {
    const connection = await pool.getConnection();
    try {
      const [result] = await connection.query(
        "DELETE FROM crime_reports WHERE id = ?", 
        [id]
      );
      return result.affectedRows;
    } catch (error) {
      console.error('Error deleting report:', error);
      throw new Error('Failed to delete report');
    } finally {
      connection.release();
    }
  }

  /**
   * Search reports with filters
   * @returns {Promise<Array>} Array of filtered reports
   */
  static async search({ location, crimeType, startDate, endDate }) {
    const connection = await pool.getConnection();
    try {
      let query = `
        SELECT *, 
          JSON_UNQUOTE(photos) as photos,
          JSON_UNQUOTE(videos) as videos 
        FROM crime_reports 
        WHERE 1=1
      `;
      const values = [];

      if (location) {
        query += " AND location LIKE ?";
        values.push(`%${location}%`);
      }
      if (crimeType) {
        query += " AND crime_type = ?";
        values.push(crimeType);
      }
      if (startDate) {
        query += " AND time >= ?";
        values.push(new Date(startDate));
      }
      if (endDate) {
        query += " AND time <= ?";
        values.push(new Date(endDate));
      }

      query += " ORDER BY created_at DESC";

      const [reports] = await connection.query(query, values);
      
      return reports.map(report => ({
        ...report,
        photos: report.photos ? JSON.parse(report.photos) : [],
        videos: report.videos ? JSON.parse(report.videos) : []
      }));
    } catch (error) {
      console.error('Error searching reports:', error);
      throw new Error('Failed to search reports');
    } finally {
      connection.release();
    }
  }
}

module.exports = ReportModel;