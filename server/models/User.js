const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

/**
 * User Schema for Community Helpdesk
 * Stores user information with role-based access control
 */
const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters long'],
      maxlength: [100, 'Name cannot exceed 100 characters'],
      match: [
        /^[a-zA-Z\s'-]+$/,
        'Name can only contain letters, spaces, hyphens, and apostrophes'
      ]
    },
    email: {
      type: String,
      required: [true, 'Please provide an email address'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email address'
      ],
      sparse: true
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [6, 'Password must be at least 6 characters long'],
      select: false // Don't include password in queries by default
    },
    role: {
      type: String,
      enum: {
        values: ['user', 'expert', 'admin'],
        message: 'Role must be either user, expert, or admin'
      },
      default: 'user'
    },
    isActive: {
      type: Boolean,
      default: true
    },
    isVerified: {
      type: Boolean,
      default: false
    },
    lastLogin: {
      type: Date,
      default: null
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

/**
 * Index for faster email lookups
 */
UserSchema.index({ email: 1 });
UserSchema.index({ createdAt: -1 });
UserSchema.index({ role: 1 });

/**
 * Middleware: Hash password before saving
 */
UserSchema.pre('save', async function (next) {
  // Only hash if password has been modified
  if (!this.isModified('password')) {
    return next();
  }

  try {
    // Generate salt
    const salt = await bcrypt.genSalt(10);
    // Hash password
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

/**
 * Middleware: Update the updatedAt field before saving
 */
UserSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

/**
 * Instance method: Compare password with hashed password
 * @param {String} enteredPassword - Password to compare
 * @returns {Promise<Boolean>} - True if passwords match
 */
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

/**
 * Instance method: Get user profile (without sensitive data)
 * @returns {Object} - User profile object
 */
UserSchema.methods.getPublicProfile = function () {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

/**
 * Instance method: Update last login timestamp
 * @returns {Promise} - Updated user document
 */
UserSchema.methods.updateLastLogin = async function () {
  this.lastLogin = new Date();
  return await this.save();
};

/**
 * Static method: Find user by email
 * @param {String} email - User email
 * @returns {Promise<Object>} - User document
 */
UserSchema.statics.findByEmail = function (email) {
  return this.findOne({ email: email.toLowerCase() });
};

/**
 * Static method: Find user by ID with password field (if needed)
 * @param {String} id - User ID
 * @param {Boolean} includePassword - Include password in result
 * @returns {Promise<Object>} - User document
 */
UserSchema.statics.findByIdWithPassword = function (id, includePassword = false) {
  const query = this.findById(id);
  if (includePassword) {
    query.select('+password');
  }
  return query;
};

/**
 * Instance method: Validate email format
 * @param {String} email - Email to validate
 * @returns {Boolean} - True if valid
 */
UserSchema.methods.isValidEmail = function (email) {
  const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  return emailRegex.test(email);
};

/**
 * Instance method: Validate password strength
 * @param {String} password - Password to validate
 * @returns {Object} - Validation result with isValid and errors
 */
UserSchema.statics.validatePasswordStrength = function (password) {
  const errors = [];
  
  if (password.length < 6) {
    errors.push('Password must be at least 6 characters long');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one digit');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Virtual: Get user's full display name
 */
UserSchema.virtual('displayName').get(function () {
  return this.name || this.email.split('@')[0];
});

/**
 * Remove sensitive fields before JSON stringify
 */
UserSchema.methods.toJSON = function () {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

/**
 * Create and export the User model
 */
const User = mongoose.model('User', UserSchema);

module.exports = User;
