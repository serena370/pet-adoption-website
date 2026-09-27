const db = require('../db');

// Create user
async function createUser(name, email, password) {
    const role ='adopter';
    const sql = 'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)';
    const [result] = await db.query(sql, [name, email, password, role]);
    return result;
}

// Get users by email
async function getUserByEmail(email) {
    const sql = 'SELECT * FROM users WHERE email = ?';
    const [rows] = await db.query(sql, [email]);
    return rows[0];
}

const getUserById = async (user_id) => {
  const [rows] = await db.query('SELECT * FROM users WHERE user_id = ?', [user_id]);
  return rows[0];
};

// // Get all users
// async function getAllUsers() {
//     const sql = 'SELECT user_id, name, email, role FROM users ';
//     const [rows] = await db.query(sql);
//     return rows;
// }


// // Delete user by ID
// async function deleteUser(userId) {
//   await db.query("DELETE FROM users WHERE user_id = ?", [userId]);
// }

// Update user
async function updateUser(userId, data) {
  const fields = [];
  const values = [];

  if (data.name) {
    fields.push("name = ?");
    values.push(data.name);
  }
  if (data.email) {
    fields.push("email = ?");
    values.push(data.email);
  }
  if (data.password) {
    fields.push("password = ?");
    values.push(data.password);
  }

  if (fields.length === 0) {
    throw new Error("No fields to update");
  }

  values.push(userId);

  const sql = `UPDATE users SET ${fields.join(", ")} WHERE user_id = ?`;
  await db.query(sql, values);
}



module.exports = {
    createUser,
    getUserByEmail,
   // getAllUsers,
   // deleteUser,
    updateUser,
    getUserById
};


