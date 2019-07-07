const jwt = require('jsonwebtoken');
const HttpStatus = require('http-status-codes');

module.exports = (req, res, next) => {
  let user = {};
  try {
    user = jwt.verify(req.header('token'), process.env.SECRET_KEY);
  } catch (err) {
    return res.status(HttpStatus.UNAUTHORIZED).json({ 
      statusCode: HttpStatus.UNAUTHORIZED, 
      message: 'Anda tidak memiliki akses ke dalam sistem' 
    }).end();
  }
  req.user = user.type;
  next();
}
