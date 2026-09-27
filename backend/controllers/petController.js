const petModel = require('../models/petModel');

// Get all pets
const getAllPets = async (req, res) => {
  try {
    const pets = await petModel.getAllPets({
      limit: req.query.limit,
      offset: req.query.offset,
      species: req.query.species,
      gender: req.query.gender,
      minAge: req.query.minAge,
      maxAge: req.query.maxAge,
      sort: req.query.sort
    });

    res.status(200).json({ success: true, data: pets });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};



// Get a single pet by ID
const getPetById = async (req, res) => {
  const { id } = req.params;
  try {
    const pet = await petModel.getPetById(id);
    if (!pet) {
      return res.status(404).json({ success: false, message: 'Pet not found' });
    }
    res.status(200).json({ success: true, data: pet });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get all pets for specific user
const getPetsByUser = async (req, res) => {
  try {
    const userId = req.user.id; // logged-in shelter
    const pets = await petModel.getPetsByUser(userId);

    // Always return success, even if no pets
    res.status(200).json({ success: true, data: pets });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};


// const getPetsByAdopter = async (req, res) => {
//   try {
//     const adopterId = req.user.id; // From JWT
//     const pets = await petModel.getPetsByAdopter(adopterId);
//     res.status(200).json({ success: true, data: pets });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ success: false, message: 'Server error' });
//   }
// };

// Add a new pet
const addPet = async (req, res) => {
  const shelterUserId = req.user.id; // logged-in shelter ID
  const petData = req.body;

  try {

    if (req.file) {
      petData.photo_url = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    }

    const newPetId = await petModel.addPet(petData, shelterUserId);
    res.status(201).json({ success: true, message: 'Pet added successfully', petId: newPetId });
  } catch (err) {
    console.error('Error adding pet:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// Update pet info (handles FormData with optional file)
const updatePet = async (req, res) => {
  const petId = req.params.id;
  const shelterUserId = req.user.id; // logged-in shelter
  const petData = { ...req.body }; // contains fields from FormData

  try {
    // If a new photo is uploaded, set photo_url
    if (req.file) {
      petData.photo_url = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    }

    // Update pet in DB
    const affectedRows = await petModel.updatePet(petId, petData, shelterUserId);

    if (affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Pet not found or not owned by you" });
    }

    res.json({ success: true, message: "Pet updated successfully" });
  } catch (err) {
    console.error("Error updating pet:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


// Delete a pet
const deletePet = async (req, res) => {
  const { id } = req.params;
  try {
    const affectedRows = await petModel.deletePet(id);
    if (affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Pet not found' });
    }
    res.status(200).json({ success: true, message: 'Pet deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = {
  getAllPets,
  getPetById,
  getPetsByUser,
  addPet,
  updatePet,
  deletePet
};
