// simple validators — adapt as needed or replace with express-validator
const validateRegister = (req, res, next) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    res.status(400);
    return next(new Error('Name, email and password are required'));
  }
  next();
};

module.exports = { validateRegister };
