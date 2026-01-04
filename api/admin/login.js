import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { getAdminModel } from './models/Admin.js';
import { generateToken } from './middleware/auth.js';

// MongoDB connection cache
let cachedConnection = null;

async function getMongoConnection() {
  if (cachedConnection && cachedConnection.connection.readyState === 1) {
    return cachedConnection;
  }

  const mongoURI = process.env.MONGODB_URI || process.env.MONGO_URI;
  if (!mongoURI) {
    throw new Error('Database configuration missing');
  }

  const conn = await mongoose.connect(mongoURI, {
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 45000,
    maxPoolSize: 10,
  });

  cachedConnection = conn;
  return conn;
}

// Default admin credentials (will be created on first login attempt if not exists)
const DEFAULT_ADMIN = {
  username: 'admin',
  password: process.env.ADMIN_PASSWORD || 'TechTool@2026!',
  email: process.env.ADMIN_EMAIL || 'admin@techtoolreviews.co',
  role: 'superadmin',
};

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username and password are required',
      });
    }

    // Connect to database
    await getMongoConnection();
    const Admin = getAdminModel();

    // Find admin by username
    let admin = await Admin.findOne({ username: username.toLowerCase() }).select('+password');

    // Create default admin if not exists
    if (!admin && username.toLowerCase() === DEFAULT_ADMIN.username) {
      console.log('[Admin Login] Creating default admin account...');
      admin = new Admin({
        username: DEFAULT_ADMIN.username,
        password: DEFAULT_ADMIN.password,
        email: DEFAULT_ADMIN.email,
        role: DEFAULT_ADMIN.role,
      });
      await admin.save();
      admin = await Admin.findOne({ username: username.toLowerCase() }).select('+password');
    }

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Verify password
    const isValidPassword = await admin.comparePassword(password);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Update last login
    admin.lastLogin = new Date();
    await admin.save();

    // Generate JWT token
    const token = generateToken(admin._id.toString(), admin.username, admin.role);

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      admin: {
        id: admin._id,
        username: admin.username,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error('[Admin Login] Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during login',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
}
