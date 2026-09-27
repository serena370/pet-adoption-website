const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');

const petController = require('../controllers/petController');
const { authenticate, authorize } = require('../middleware/authMiddleware');


const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

/**
 * @swagger
 * tags:
 *   name: Pets
 *   description: Pet management for adopters and shelters
 */


// Public: Browse all pets (adopters, shelters)
/**
 * @swagger
 * /api/pets:
 *   get:
 *     summary: Browse all pets (public)
 *     tags: [Pets]
 *     responses:
 *       200:
 *         description: List of all pets
 *       500:
 *         description: Server error
 */
router.get('/', petController.getAllPets);


// Get pets of shelter
/**
 * @swagger
 * /api/pets/my-pets:
 *   get:
 *     summary: Get pets of logged-in shelter
 *     tags: [Pets]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of shelter's pets
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get('/my-pets', authenticate, authorize('shelter'), petController.getPetsByUser);


// Public: View single pet by ID
/**
 * @swagger
 * /api/pets/{id}:
 *   get:
 *     summary: View single pet by ID
 *     tags: [Pets]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Pet ID
 *     responses:
 *       200:
 *         description: Pet details
 *       404:
 *         description: Pet not found
 */
router.get('/:id', petController.getPetById);


// router.get('/my-adopted-pets', authenticate, authorize('adopter'), petController.getPetsByAdopter);

// Shelters: Add new pet
/**
 * @swagger
 * /api/pets:
 *   post:
 *     summary: Add a new pet (shelters only)
 *     tags: [Pets]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - age
 *               - breed
 *               - photo
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Buddy"
 *               age:
 *                 type: number
 *                 example: 2
 *               breed:
 *                 type: string
 *                 example: "Golden Retriever"
 *               photo:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Pet added successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */
router.post('/', authenticate, authorize('shelter'), upload.single('photo'), petController.addPet);


// Shelters: Update pet info
/**
 * @swagger
 * /api/pets/{id}:
 *   put:
 *     summary: Update a pet (shelters only)
 *     tags: [Pets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Pet ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Buddy"
 *               age:
 *                 type: number
 *                 example: 3
 *               breed:
 *                 type: string
 *                 example: "Golden Retriever"
 *               photo:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Pet updated successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Pet not found
 */
router.put('/:id', authenticate, authorize('shelter'), upload.single('photo'), petController.updatePet);


// Shelters: Delete pet
/**
 * @swagger
 * /api/pets/{id}:
 *   delete:
 *     summary: Delete a pet (shelters only)
 *     tags: [Pets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Pet ID
 *     responses:
 *       200:
 *         description: Pet deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Pet not found
 */
router.delete('/:id', authenticate, authorize('shelter'), petController.deletePet);

module.exports = router;
