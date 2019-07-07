const errorHandler = res => (err) => {
  console.error(err.message);
  return res.json({ status: err.status, message: err.message }).status(err.status).end();
};


module.exports = fn => (req, res) => {
  fn(req, res)
    .then(result => res.status(result.status).json(result).end())
    .catch(errorHandler(res));
};
