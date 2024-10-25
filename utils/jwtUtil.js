const jwt = require('jsonwebtoken');

class JwtUtil {
  generateToken(userId) {
    return jwt.sign({ id: userId }, 'secret', { expiresIn: '1h' });
  }

  verifyToken(req, res, next) {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    jwt.verify(token, 'secret', (err, decoded) => {
      if (err) {
        return res.status(403).json({ error: 'Invalid token' });
      }
      req.user = decoded;
      next();
    });
  }
}

module.exports = new JwtUtil();
