const Helper = require("../helper/helper");
const jwt = require("jsonwebtoken");

async function verifyUser(req, res, next) {
  const accessToken = req.cookies.accessToken;

  if (!accessToken) {
    try {
      await renewToken(req, res);
      if (req.cookies.accessToken) {
        return next();
      } else {
        Helper.sendFail(res, 401, 'Authentication required');
        return;
      }
    } catch (error) {
      Helper.sendFail(res, 401, error.message);
      return;
    }
  } else {
    jwt.verify(accessToken, process.env.ACCESS_TOKEN_JWT_SECRET_KEY, (err, decoded) => {
      if (err) {
        Helper.sendFail(res, 401, 'Invalid access token');
        return;
      } else {
        req.user = { _id: decoded.id, roles: decoded.roles };
        return next();
      }
    });
  }
}

function renewToken(req, res) {
  return new Promise((resolve, reject) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return reject(new Error('Refresh token has expired. Please login again'));
    }

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_JWT_SECRET_KEY, (err, decoded) => {
      if (err) {
        return reject(new Error('Invalid refresh token'));
      } else {
        const accessToken = jwt.sign(
          { id: decoded.id, roles: decoded.roles },
          process.env.ACCESS_TOKEN_JWT_SECRET_KEY,
          { expiresIn: '60m' }
        );
        res.cookie('accessToken', accessToken, {
          maxAge: 60 * 60 * 1000 
        });
        req.user = { _id: decoded.id, roles: decoded.roles };
        return resolve();
      }
    });
  });
}


function authorizeRoles(roles) {
  return (req, res, next) => {
    if (!req.user?.roles) {
      Helper.sendFail(res, 403, 'Forbidden: No roles assigned');
      return;
    }

    const userRoles = req.user.roles;
    const hasRole = roles.some(role => userRoles.includes(role));

    if (!hasRole) {
      Helper.sendFail(res, 403, 'Forbidden: You do not have the required role');
      return;
    }

    next();
  };
}



const AuthMiddlewares = {
  verifyUser, authorizeRoles
}
module.exports = AuthMiddlewares