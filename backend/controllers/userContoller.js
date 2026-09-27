// const { getAllUsers: getAllUsersModel, deleteUser: deleteUserModel, updateUser: updateUserModel } = require('../models/userModel');
// async function getAllUsers(req, res) {
//     try {
//         console.log("Fetching all users...");
//         const users = await getAllUsersModel();
//         console.log("Users fetched:", users);
//         res.status(200).json({ users });
//     } catch (err) {
//         console.error("Error fetching users in controller:", err);
//         res.status(500).json({ message: 'Server error while fetching users' });
//     }
// }


// async function deleteUser(req, res) {
//   try {
//     await deleteUserModel(req.params.id);
//     res.status(200).json({ message: 'User deleted successfully' });
//   } catch (err) {
//     console.error("Error deleting user:", err);
//     res.status(500).json({ message: 'Server error while deleting user' });
//   }
// }


const bcrypt = require('bcrypt');

async function updateUser(req, res) {
  try {
    const { name, email, password } = req.body;
    const updatedData = { name, email };

    if (password) {
      updatedData.password = await bcrypt.hash(password, 10);
    }

    await updateUserModel(req.params.id, updatedData);
    res.status(200).json({ success: true, message: 'User updated successfully' });
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).json({ success: false, message: 'Server error while updating user' });
  }
}


module.exports = {  updateUser };

