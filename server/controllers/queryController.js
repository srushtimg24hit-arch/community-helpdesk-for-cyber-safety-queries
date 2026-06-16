const Query = require('../models/Query');

/**
 * Create a new query
 * - Uses req.user._id if available, otherwise falls back to body.userId
 */
async function createQuery(req, res, next) {
  try {
    const { title, description, category } = req.body || {};
    const userId = (req.user && req.user._id) || req.body.userId;

    if (!title || !description || !category) {
      return res.status(400).json({ message: 'Title, description and category are required' });
    }
    if (!userId) {
      return res.status(400).json({ message: 'userId is required (either in request or from authenticated user)' });
    }

    const query = await Query.create({
      title: String(title).trim(),
      description: String(description).trim(),
      category: String(category).trim(),
      userId
    });

    return res.status(201).json({ message: 'Query created', query });
  } catch (err) {
    if (err && err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ message: 'Validation failed', errors });
    }
    next(err);
  }
}

/**
 * Get all queries with optional filters and pagination
 * Query params: page, limit, category, status, search
 */
async function getAllQueries(req, res, next) {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.max(1, parseInt(req.query.limit, 10) || 20);
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.category) filter.category = req.query.category;
    if (req.query.status) filter.status = req.query.status;

    if (req.query.search) {
      // simple case-insensitive search on title and description
      const q = req.query.search.trim();
      filter.$or = [
        { title: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } }
      ];
    }

    const [total, queries] = await Promise.all([
      Query.countDocuments(filter),
      Query.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate({ path: 'userId', select: 'name email role' })
    ]);

    return res.status(200).json({
      total,
      page,
      limit,
      results: queries
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Get a single query by id
 */
async function getQueryById(req, res, next) {
  try {
    const id = req.params.id;
    const query = await Query.findById(id).populate({ path: 'userId', select: 'name email role' });
    if (!query) {
      return res.status(404).json({ message: 'Query not found' });
    }
    return res.status(200).json({ query });
  } catch (err) {
    next(err);
  }
}

/**
 * Update a query
 * - Only the owner or an admin can update
 */
async function updateQuery(req, res, next) {
  try {
    const id = req.params.id;
    const updates = {};
    const allowed = ['title', 'description', 'category', 'status'];
    for (const key of allowed) {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    }

    const query = await Query.findById(id);
    if (!query) {
      return res.status(404).json({ message: 'Query not found' });
    }

    // authorization: owner or admin
    if (req.user && req.user.role !== 'admin' && query.userId.toString() !== String(req.user._id)) {
      return res.status(403).json({ message: 'Forbidden: not the owner' });
    }

    Object.assign(query, updates);
    await query.save();

    const updated = await Query.findById(id).populate({ path: 'userId', select: 'name email role' });
    return res.status(200).json({ message: 'Query updated', query: updated });
  } catch (err) {
    if (err && err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ message: 'Validation failed', errors });
    }
    next(err);
  }
}

/**
 * Delete a query
 * - Only the owner or an admin can delete
 */
async function deleteQuery(req, res, next) {
  try {
    const id = req.params.id;
    const query = await Query.findById(id);
    if (!query) {
      return res.status(404).json({ message: 'Query not found' });
    }

    // authorization: owner or admin
    if (req.user && req.user.role !== 'admin' && query.userId.toString() !== String(req.user._id)) {
      return res.status(403).json({ message: 'Forbidden: not the owner' });
    }

    await Query.deleteOne({ _id: id });
    return res.status(200).json({ message: 'Query deleted' });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createQuery,
  getAllQueries,
  getQueryById,
  updateQuery,
  deleteQuery
};
