const IncidentReport = require('../models/IncidentReport');

// Create a new incident report
// Expects at minimum: title, description. Optionally: severity, metadata
async function createIncident(req, res, next) {
  try {
    const { title, description, severity, metadata } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: 'Title and description are required' });
    }

    const incidentData = {
      title,
      description,
      severity: severity || 'low'
    };

    // If authentication middleware attached a user, set reportedBy
    if (req.user && req.user._id) {
      incidentData.reportedBy = req.user._id;
    }

    if (metadata) {
      incidentData.metadata = metadata;
    }

    const incident = await IncidentReport.create(incidentData);

    return res.status(201).json({ success: true, data: incident });
  } catch (err) {
    next(err);
  }
}

// Get all incidents with optional filters: status, severity
async function getAllIncidents(req, res, next) {
  try {
    const { status, severity } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (severity) filter.severity = severity;

    const incidents = await IncidentReport.find(filter)
      .populate('reportedBy', 'name email role')
      .sort({ createdAt: -1 });

    return res.status(200).json({ success: true, count: incidents.length, data: incidents });
  } catch (err) {
    next(err);
  }
}

// Get a single incident by id
async function getIncidentById(req, res, next) {
  try {
    const { id } = req.params;

    const incident = await IncidentReport.findById(id).populate('reportedBy', 'name email role');

    if (!incident) {
      return res.status(404).json({ message: 'Incident not found' });
    }

    return res.status(200).json({ success: true, data: incident });
  } catch (err) {
    // If invalid ObjectId, Mongoose will throw CastError
    if (err.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid incident id' });
    }
    next(err);
  }
}

// Update only the status of an incident
// Expects body: { status: 'in_progress' }
async function updateIncidentStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: 'Status is required' });
    }

    const allowedStatuses = ['open', 'in_progress', 'resolved', 'closed'];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: `Invalid status. Allowed: ${allowedStatuses.join(', ')}` });
    }

    const incident = await IncidentReport.findById(id);
    if (!incident) {
      return res.status(404).json({ message: 'Incident not found' });
    }

    incident.status = status;
    incident.statusUpdatedAt = Date.now();
    await incident.save();

    const updated = await IncidentReport.findById(id).populate('reportedBy', 'name email role');

    return res.status(200).json({ success: true, data: updated });
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid incident id' });
    }
    next(err);
  }
}

module.exports = {
  createIncident,
  getAllIncidents,
  getIncidentById,
  updateIncidentStatus
};
