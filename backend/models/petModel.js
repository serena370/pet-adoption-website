const pool = require('../db');

// Get all pets
const getAllPets = async (filters) => {
  let sql = "SELECT * FROM pets WHERE 1=1";
  const params = [];

  // Filtering
  if (filters.species) {
    sql += " AND species = ?";
    params.push(filters.species);
  }

  if (filters.gender) {
    sql += " AND gender = ?";
    params.push(filters.gender);
  }

  if (filters.status) {
    sql += " AND status = ?";
    params.push(filters.status);
  }

  if (filters.maxAge) {
    sql += " AND age <= ?";
    params.push(filters.maxAge);
  }

  // Sorting
  if (filters.sort) {
    const allowedSort = ["name", "age", "species"];
    if (allowedSort.includes(filters.sort)) {
      sql += ` ORDER BY ${filters.sort}`;
    }
  }

  // Pagination
  if (filters.limit) {
    sql += " LIMIT ?";
    params.push(Number(filters.limit));
  }

  if (filters.offset) {
    sql += " OFFSET ?";
    params.push(Number(filters.offset));
  }

  const [rows] = await pool.query(sql, params);
  return rows;
};



// Get pet by ID
const getPetById = async (id) => {
  try {
    const [rows] = await pool.query('SELECT * FROM pets WHERE pet_id = ?', [id]);
    return rows[0];
  } catch (err) {
    throw err;
  }
};


// Get all pets for a specific user 
const getPetsByUser = async (userId) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM pets WHERE user_id = ?',
      [userId]
    );
    return rows;
  } catch (err) {
    throw err;
  }
};

// const getPetsByAdopter = async (adopterId) => {
//   try {
//     const [rows] = await pool.query(
//       `SELECT p.* 
//        FROM pets p 
//        JOIN adoption_requests ar ON p.pet_id = ar.pet_id
//        WHERE ar.adopter_id = ? AND ar.status = 'approved'`,
//       [adopterId]
//     );
//     return rows;
//   } catch (err) {
//     throw err;
//   }
// };

// Add new pet
const addPet = async (pet, shelterUserId) => {
  const { name, species, breed, age, gender, status, photo_url } = pet;

  try {
    const [result] = await pool.query(
      `INSERT INTO pets 
       (name, species, breed, age, gender, status, photo_url, user_id) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, species, breed, age, gender, status, photo_url, shelterUserId]
    );
    return result.insertId;
  } catch (err) {
    throw err;
  }
};


// Update pet info
const updatePet = async (id, pet, shelterUserId) => {
  try {
    const { name, species, breed, age, gender, status, photo_url } = pet;

    const [result] = await pool.query(
      `UPDATE pets 
       SET name = ?, species = ?, breed = ?, age = ?, gender = ?, status = ?, photo_url = ?, user_id = ? 
       WHERE pet_id = ?`,
      [
        name || null,
        species || null,
        breed || null,
        age || null,
        gender || null,
        status || null,
        photo_url || null,
        shelterUserId, // <-- use logged-in shelter ID
        id
      ]
    );

    return result.affectedRows;
  } catch (err) {
    console.error('Error in updatePet:', err);
    throw err;
  }
};



// Delete pet
const deletePet = async (id) => {
  try {
    const [result] = await pool.query('DELETE FROM pets WHERE pet_id=?', [id]);
    return result.affectedRows;
  } catch (err) {
    throw err;
  }
};


const updatePetStatus = async (pet_id, status) => {
  const [result] = await pool.query(
    'UPDATE pets SET status = ? WHERE pet_id = ?',
    [status, pet_id]
  );
  return result.affectedRows;
};


module.exports = {
  getAllPets,
  getPetById,
  getPetsByUser,
  addPet,
  updatePet,
  deletePet,
  updatePetStatus
};
