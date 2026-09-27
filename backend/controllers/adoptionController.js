const adoptionModel = require('../models/adoptionModel');

const createRequest = async (req, res) => {
  const adopter_id = req.user.id; // From JWT
  const { pet_id, fullName, phone, message } = req.body;

  if (!pet_id || !fullName || !phone || !message) {
    return res.status(400).json({ success: false, message: 'All fields are required' });
  }

  try {
    const requestId = await adoptionModel.createAdoptionRequest(pet_id, adopter_id, fullName, phone, message);
    res.status(201).json({ success: true, message: 'Adoption request submitted', requestId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};


// Get all requests (shelter)
const getAllRequests = async (req, res) => {
  try {
    const requests = await adoptionModel.getAllRequests();
    res.status(200).json({ success: true, data: requests });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get requests by logged-in adopter
const getMyRequests = async (req, res) => {
  try {
    const adopter_id = req.user.id;
    const requests = await adoptionModel.getRequestsByAdopter(adopter_id);
    res.status(200).json({ success: true, data: requests });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Approve or reject a request
const petModel = require('../models/petModel'); // Make sure you have this
const sendEmail = require('../config/email');
const userModel = require('../models/userModel');

const updateStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    // Update adoption request
    const result = await adoptionModel.updateRequestStatus(id, status);
    if (result === 0) {
      return res.status(404).json({ success: false, message: 'Adoption request not found' });
    }

    // If approved, also update the pet's status and send email
    if (status === 'approved') {
      const adoption = await adoptionModel.getRequestById(id);
      if (!adoption) {
        return res.status(404).json({ success: false, message: 'Adoption request not found' });
      }

      await petModel.updatePetStatus(adoption.pet_id, 'Adopted');

      try {
        const adopter = await userModel.getUserById(adoption.adopter_id); // ensure this function exists
        if (adopter && adopter.email) {
          const emailHtml = `
            <h3>Adoption Request Approved!</h3>
            <p>Hi ${adopter.name},</p>
            <p>Your adoption request for <strong>pet ID ${adoption.pet_id}</strong> has been approved!</p>
            <p>Please contact the shelter to complete the adoption process.</p>
            <br>
            <p>Thank you for adopting!</p>
          `;
           sendEmail(adopter.email, "Your Adoption Request is Approved!", emailHtml)
           .then(() => console.log("Email sent to", adopter.email))
           .catch(err => console.error("Error sending email:", err));
           }else {
          console.warn(`Adopter not found or missing email for adopter_id: ${adoption.adopter_id}`);
        }
      } catch (emailErr) {
        console.error("Error sending approval email:", emailErr);
      }
    }

    res.status(200).json({ success: true, message: 'Request status updated' });
  } catch (err) {
    console.error("Error in updateStatus:", err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};


const getMyAdoptedPets = async (req, res) => {
  try {
    const adopter_id = req.user.id;
    const pets = await adoptionModel.getApprovedPetsByAdopter(adopter_id);
    res.status(200).json({ success: true, data: pets });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};



module.exports = {
  createRequest,
  getAllRequests,
  getMyRequests,
  updateStatus,
  getMyAdoptedPets
};
