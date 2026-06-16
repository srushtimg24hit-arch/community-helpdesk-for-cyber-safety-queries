const mongoose = require('mongoose');

/**
 * Query Schema for Community Helpdesk
 * Stores user queries/questions about cyber safety topics
 */
const QuerySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a query title'],
      trim: true,
      minlength: [5, 'Title must be at least 5 characters long'],
      maxlength: [200, 'Title cannot exceed 200 characters']
    },
    description: {
      type: String,
      required: [true, 'Please provide a query description'],
      trim: true,
      minlength: [10, 'Description must be at least 10 characters long'],
      maxlength: [5000, 'Description cannot exceed 5000 characters']
    },
    category: {
      type: String,
      required: [true, 'Please select a category'],
      enum: {
        values: [
          'Phishing',
          'Malware',
          'Password Security',
          'Social Engineering',
          'Identity Theft',
          'Online Harassment',
          'Data Privacy',
          'Ransomware',
          'DDoS Attacks',
          'Cybersecurity Best Practices',
          'Other'
        ],
        message: 'Invalid category selected'
      }
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Query must be associated with a user'],
      index: true
    },
    status: {
      type: String,
      enum: {
        values: ['Pending', 'Answered', 'Closed'],
        message: 'Status must be either Pending, Answered, or Closed'
      },
      default: 'Pending',
      index: true
    },
    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
        minlength: [2, 'Tag must be at least 2 characters long'],
        maxlength: [50, 'Tag cannot exceed 50 characters']
      }
    ],
    attachments: [
      {
        fileName: {
          type: String,
          trim: true
        },
        fileUrl: {
          type: String,
          trim: true
        },
        fileType: {
          type: String,
          enum: ['image', 'document', 'video'],
          default: 'document'
        },
        uploadedAt: {
          type: Date,
          default: Date.now
        }
      }
    ],
    views: {
      type: Number,
      default: 0,
      min: [0, 'Views cannot be negative']
    },
    isUrgent: {
      type: Boolean,
      default: false,
      index: true
    },
    isFeatured: {
      type: Boolean,
      default: false
    },
    responses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Response'
      }
    ],
    responseCount: {
      type: Number,
      default: 0,
      min: [0, 'Response count cannot be negative']
    },
    lastResponseAt: {
      type: Date,
      default: null
    },
    createdAt: {
      type: Date,
      default: Date.now,
      index: true
    },
    updatedAt: {
      type: Date,
      default: Date.now
    },
    resolvedAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

/**
 * Indexes for query optimization
 */
QuerySchema.index({ userId: 1, createdAt: -1 });
QuerySchema.index({ category: 1, status: 1 });
QuerySchema.index({ status: 1, createdAt: -1 });
QuerySchema.index({ isUrgent: 1, createdAt: -1 });
QuerySchema.index({ isFeatured: 1 });
QuerySchema.index({ tags: 1 });

/**
 * Middleware: Update the updatedAt field before saving
 */
QuerySchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

/**
 * Middleware: Automatically populate user info when querying
 */
QuerySchema.pre(/^find/, function (next) {
  if (this.options._recursed) {
    return next();
  }
  this.populate({
    path: 'userId',
    select: 'name email role'
  });
  next();
});

/**
 * Instance method: Add a response to the query
 * @param {ObjectId} responseId - Response ID to add
 * @returns {Promise} - Updated query document
 */
QuerySchema.methods.addResponse = async function (responseId) {
  if (!this.responses.includes(responseId)) {
    this.responses.push(responseId);
    this.responseCount = this.responses.length;
    this.lastResponseAt = new Date();
  }
  return await this.save();
};

/**
 * Instance method: Remove a response from the query
 * @param {ObjectId} responseId - Response ID to remove
 * @returns {Promise} - Updated query document
 */
QuerySchema.methods.removeResponse = async function (responseId) {
  this.responses = this.responses.filter(
    (id) => id.toString() !== responseId.toString()
  );
  this.responseCount = this.responses.length;
  if (this.responses.length === 0) {
    this.status = 'Pending';
  }
  return await this.save();
};

/**
 * Instance method: Mark query as answered
 * @returns {Promise} - Updated query document
 */
QuerySchema.methods.markAsAnswered = async function () {
  this.status = 'Answered';
  return await this.save();
};

/**
 * Instance method: Mark query as closed
 * @returns {Promise} - Updated query document
 */
QuerySchema.methods.markAsClosed = async function () {
  this.status = 'Closed';
  this.resolvedAt = new Date();
  return await this.save();
};

/**
 * Instance method: Increment view count
 * @returns {Promise} - Updated query document
 */
QuerySchema.methods.incrementViews = async function () {
  this.views += 1;
  return await this.save();
};

/**
 * Instance method: Add tags to query
 * @param {Array<String>} newTags - Tags to add
 * @returns {Promise} - Updated query document
 */
QuerySchema.methods.addTags = async function (newTags) {
  const uniqueTags = new Set([...this.tags, ...newTags]);
  this.tags = Array.from(uniqueTags);
  return await this.save();
};

/**
 * Instance method: Add an attachment
 * @param {Object} attachment - Attachment object with fileName, fileUrl, fileType
 * @returns {Promise} - Updated query document
 */
QuerySchema.methods.addAttachment = async function (attachment) {
  this.attachments.push(attachment);
  return await this.save();
};

/**
 * Instance method: Get query summary (for list view)
 * @returns {Object} - Query summary object
 */
QuerySchema.methods.getSummary = function () {
  return {
    _id: this._id,
    title: this.title,
    description: this.description.substring(0, 150) + '...',
    category: this.category,
    status: this.status,
    responseCount: this.responseCount,
    views: this.views,
    createdAt: this.createdAt,
    user: this.userId
  };
};

/**
 * Static method: Get queries by user
 * @param {ObjectId} userId - User ID
 * @param {Object} options - Query options (status, limit, skip)
 * @returns {Promise<Array>} - Array of queries
 */
QuerySchema.statics.getByUserId = function (userId, options = {}) {
  const { status, limit = 10, skip = 0 } = options;
  let query = this.findOne({ userId });

  if (status) {
    query = query.where('status').equals(status);
  }

  return query.limit(limit).skip(skip).sort({ createdAt: -1 });
};

/**
 * Static method: Get queries by category
 * @param {String} category - Category name
 * @param {Object} options - Query options (limit, skip, status)
 * @returns {Promise<Array>} - Array of queries
 */
QuerySchema.statics.getByCategory = function (category, options = {}) {
  const { limit = 10, skip = 0, status = 'Answered' } = options;
  let query = this.find({ category });

  if (status) {
    query = query.where('status').equals(status);
  }

  return query
    .limit(limit)
    .skip(skip)
    .sort({ isFeatured: -1, lastResponseAt: -1 });
};

/**
 * Static method: Get urgent queries
 * @param {Object} options - Query options (limit, skip)
 * @returns {Promise<Array>} - Array of urgent queries
 */
QuerySchema.statics.getUrgentQueries = function (options = {}) {
  const { limit = 10, skip = 0 } = options;
  return this.find({ isUrgent: true, status: 'Pending' })
    .limit(limit)
    .skip(skip)
    .sort({ createdAt: -1 });
};

/**
 * Static method: Search queries
 * @param {String} searchTerm - Search term
 * @param {Object} options - Query options (limit, skip)
 * @returns {Promise<Array>} - Array of matching queries
 */
QuerySchema.statics.searchQueries = function (searchTerm, options = {}) {
  const { limit = 10, skip = 0 } = options;
  return this.find({
    $or: [
      { title: { $regex: searchTerm, $options: 'i' } },
      { description: { $regex: searchTerm, $options: 'i' } },
      { tags: { $in: [new RegExp(searchTerm, 'i')] } }
    ]
  })
    .limit(limit)
    .skip(skip)
    .sort({ createdAt: -1 });
};

/**
 * Static method: Get trending queries
 * @param {Object} options - Query options (limit, days)
 * @returns {Promise<Array>} - Array of trending queries
 */
QuerySchema.statics.getTrendingQueries = function (options = {}) {
  const { limit = 10, days = 30 } = options;
  const daysAgo = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  return this.find({
    createdAt: { $gte: daysAgo },
    status: 'Answered'
  })
    .limit(limit)
    .sort({ views: -1, responseCount: -1 });
};

/**
 * Instance method: Get full details including all responses
 * @returns {Promise<Object>} - Query with populated responses
 */
QuerySchema.methods.getFullDetails = async function () {
  return await this.populate('responses').execPopulate();
};

/**
 * Remove sensitive fields before JSON stringify
 */
QuerySchema.methods.toJSON = function () {
  return this.toObject();
};

/**
 * Create and export the Query model
 */
const Query = mongoose.model('Query', QuerySchema);

module.exports = Query;
