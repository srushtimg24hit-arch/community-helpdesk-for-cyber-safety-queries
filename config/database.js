const mongoose = require('mongoose');
const debug = require('debug')('app:db');

/**
 * connectDB - connects to MongoDB using MONGO_URI env var
 * Returns the mongoose connection promise
 */
async function connectDB() {
  const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/community-helpdesk';

  if (!MONGO_URI) {
    throw new Error('MONGO_URI is not defined in environment');
  }

  try {
    // Mongoose 6+ no longer requires these options but leaving for compatibility
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    debug('MongoDB connected');
    console.log('MongoDB connected');

    return mongoose.connection;
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    debug('MongoDB connection error: %O', err);
    throw err;
  }
}

module.exports = connectDB;
