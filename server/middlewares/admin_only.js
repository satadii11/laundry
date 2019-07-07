const HttpStatus = require('http-status-codes');

module.exports = (req, res, next) => {
  if (req.user !== 'Admin') {
    return res.status(HttpStatus.UNAUTHORIZED).json({ 
      statusCode: HttpStatus.UNAUTHORIZED, 
      message: 'Anda tidak memiliki hak akses' 
    }).end();
  }
  next();
}
