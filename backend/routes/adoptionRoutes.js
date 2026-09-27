const express = require('express');
const router = express.Router();
const adoptionController = require('../controllers/adoptionController');
const { authenticate, authorize } = require('../middleware/authMiddleware');


/**
 * @swagger
 * tags:
 *   name: Adoption
 *   description: Adopter and Shelter adoption requests management
 */


// Adopter: Submit a new request
/**
 * @swagger
 * /api/adoptions:
 *   post:
 *     summary: Submit a new adoption request (Adopter)
 *     tags:
 *       - Adoptions
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - pet_id
 *               - fullName
 *               - phone
 *               - message
 *             properties:
 *               pet_id:
 *                 type: string
 *                 example: "22"
 *               fullName:
 *                 type: string
 *                 example: "test"
 *               phone:
 *                 type: string
 *                 example: "12345678"
 *               message:
 *                 type: string
 *                 example: "I would love to adopt this pet!"
 *     responses:
 *       201:
 *         description: Adoption request submitted successfully
 *       400:
 *         description: All fields are required
 *       500:
 *         description: Server error
 */
router.post('/', authenticate, authorize('adopter'), adoptionController.createRequest);




// Adopter: View own requests
/**
 * @swagger
 * /api/adoptions/my:
 *   get:
 *     summary: View all adoption requests of the logged-in adopter
 *     tags: [Adoption]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of adopter's requests
 *       401:
 *         description: Unauthorized
 */
router.get('/my', authenticate, authorize('adopter'), adoptionController.getMyRequests);




// Shelter: View all requests
/**
 * @swagger
 * /api/adoptions:
 *   get:
 *     summary: View all adoption requests (shelter only)
 *     tags: [Adoption]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all adoption requests
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get('/', authenticate, authorize('shelter'), adoptionController.getAllRequests);



// Shelter: Update request status
/**
 * @swagger
 * /api/adoptions/{id}:
 *   put:
 *     summary: Update status of an adoption request (shelter only)
 *     tags: [Adoption]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Adoption request ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 description: New status (approved, rejected)
 *     responses:
 *       200:
 *         description: Request status updated
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.put('/:id', authenticate, authorize('shelter'), adoptionController.updateStatus);



// Adopter: View only approved pets
/**
 * @swagger
 * /api/adoptions/my/adopted:
 *   get:
 *     summary: View only approved pets adopted by the logged-in adopter
 *     tags: [Adoption]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of adopted pets
 *       401:
 *         description: Unauthorized
 */
router.get('/my/adopted', authenticate, authorize('adopter'), adoptionController.getMyAdoptedPets);

module.exports = router;

