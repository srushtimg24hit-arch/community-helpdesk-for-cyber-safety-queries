const express = require('express');
const router = express.Router();

const {
  createIncident,
  getAllIncidents,
  getIncidentById,
  updateIncidentStatus
} = require('../controllers/incidentController');

// Optional: protect/authorize middleware can be applied here if desired
// const { protect, authorize } = require('../middleware/authMiddleware');

// Create a new incident
router.post('/', createIncident);

// Get all incidents
router.get('/', getAllIncidents);

// Get one incident by id
router.get('/:id', getIncidentById);

// Update incident status (PUT used to update resource partially here)
router.put('/:id', updateIncidentStatus);

module.exports = router;
