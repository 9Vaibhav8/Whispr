import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
  const token = req.cookies.jwt || req.headers['authorization']?.split(' ')[1]; // Look for token in cookies or Authorization header

  if (!token) {
    return res.status(401).json({ message: 'Not authenticated' }); // No token found
  }

  try {
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user info to the request object
    req.user = { id: decoded.userId }; // THIS IS IMPORTANT
    
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Invalid or expired token' }); // Token is invalid or expired
  }
};

export default authMiddleware;
