import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'techtoolreviews-admin-secret-2026';

/**
 * Verify JWT token and extract admin data
 */
export function verifyToken(token) {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return { valid: true, decoded };
  } catch (error) {
    return { valid: false, error: error.message };
  }
}

/**
 * Generate JWT token for admin
 */
export function generateToken(adminId, username, role = 'admin') {
  return jwt.sign(
    { 
      id: adminId, 
      username, 
      role,
      iat: Math.floor(Date.now() / 1000),
    },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
}

/**
 * Middleware to protect API routes
 * Returns null if valid, error response if invalid
 */
export function authenticateAdmin(req) {
  const authHeader = req.headers.authorization || req.headers.get?.('authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return {
      status: 401,
      body: { success: false, message: 'Access denied. No token provided.' },
    };
  }

  const token = authHeader.split(' ')[1];
  const { valid, decoded, error } = verifyToken(token);

  if (!valid) {
    return {
      status: 401,
      body: { success: false, message: 'Invalid or expired token.', error },
    };
  }

  // Attach admin data to request
  req.admin = decoded;
  return null; // No error, continue
}

export default { verifyToken, generateToken, authenticateAdmin };
