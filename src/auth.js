const jwt = require('jsonwebtoken');

const APP_SECRET = 'hackernew-secret';

const authtenticateAndGetUserId = (context) => {
  const authorization = context.request.get('Authorization');
  if (authorization) {
    const token = authorization.split(' ')[1];
    const result = jwt.verify(token, APP_SECRET);
    return result.userId;
  }

  throw new Error('Not authenticated');
};

module.exports = {
  APP_SECRET,
  authtenticateAndGetUserId,
};
