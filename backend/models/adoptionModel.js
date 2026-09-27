const pool = require('../db');

const createAdoptionRequest = async (pet_id, adopter_id, fullName, phone, message) => {
  const [result] = await pool.query(
    'INSERT INTO adoption_requests (pet_id, adopter_id, fullName, phone, message) VALUES (?, ?, ?, ?, ?)',
    [pet_id, adopter_id, fullName, phone, message]
  );
  return result.insertId;
};


const getAllRequests = async () => {
  const [rows] = await pool.query(`
    SELECT 
      ar.request_id,
      ar.status,
      ar.request_date,
      ar.fullName,
      ar.phone,
      ar.message,
      u.user_id AS adopter_id,
      u.name AS adopter_name,
      u.email AS adopter_email,
      p.pet_id,
      p.name AS pet_name,
      p.species,
      p.breed,
      p.photo_url AS pet_photo
    FROM adoption_requests ar
    JOIN users u ON ar.adopter_id = u.user_id
    JOIN pets p ON ar.pet_id = p.pet_id
    ORDER BY ar.request_date DESC
  `);
  return rows;
};





const getRequestsByAdopter = async (adopter_id) => {
  const [rows] = await pool.query(
    `SELECT ar.request_id, ar.status, ar.request_date,
            p.pet_id, p.name AS pet_name, p.species, p.breed, p.age, p.gender, p.photo_url AS pet_photo
     FROM adoption_requests ar
     JOIN pets p ON ar.pet_id = p.pet_id
     WHERE ar.adopter_id = ?`,
    [adopter_id]
  );
  return rows;
};


const updateRequestStatus = async (request_id, status) => {
  const [result] = await pool.query(
    'UPDATE adoption_requests SET status = ? WHERE request_id = ?',
    [status, request_id]
  );
  return result.affectedRows;
};


// adoptionModel.js
const getApprovedPetsByAdopter = async (adopter_id) => {
  const [rows] = await pool.query(
    `SELECT p.pet_id, p.name AS pet_name, p.species, p.breed, p.age, p.gender, p.photo_url
     FROM adoption_requests ar
     JOIN pets p ON ar.pet_id = p.pet_id
     WHERE ar.adopter_id = ? AND ar.status = 'approved'`,
    [adopter_id]
  );
  return rows;
};

const getRequestById = async (request_id) => {
  const [rows] = await pool.query(
    'SELECT * FROM adoption_requests WHERE request_id = ?',
    [request_id]
  );
  return rows[0];
};


module.exports = {
  createAdoptionRequest,
  getAllRequests,
  getRequestsByAdopter,
  updateRequestStatus,
  getApprovedPetsByAdopter,
  getRequestById
};
