const { validateToken } = require("../services/authentication");

function checkForAuthenticationCookie(cookieName) {
  return (req, res, next) => {
    const tokenCookieValue = req.cookies[cookieName];
    if (!tokenCookieValue) {
      return next();
    }

    try {
      const userPayload = validateToken(tokenCookieValue);
      req.user = userPayload;  // Attach the user to the request object
      res.locals.user = userPayload;  // Make user available to all templates

      // Log the user payload for debugging
      // console.log("User set in locals:", res.locals.user);
    } catch (error) {
      console.error("Invalid token:", error.message);
    }

    next();
  };
}

module.exports = {
  checkForAuthenticationCookie,
};
