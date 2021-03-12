const jwt = require('jsonwebtoken');

function authorization(req, res, next) {
  const token = req.header('Authorization').split(' ')[1];

  if (!token) {
    return res.status(401).json('No Token. Access Denied');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
  } catch (err) {
    res.status(401).json('Invalid Token. Acess Denied');
  }
  next();
}

module.exports = authorization;
