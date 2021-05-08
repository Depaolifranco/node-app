const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { jwtSecret } = require('../../configs/configs')();

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, jwtSecret);
    const user = await User.findOne({ _id: decoded._id, 'tokens.token': token });
    if (!user) {
      throw new Error();
    }

    req.token = token;
    req.user = user;
    next();
  } catch (_) {
    res.status(401).send({ error: 'Provide validation token for this request' });
  }
};

module.exports = auth;
