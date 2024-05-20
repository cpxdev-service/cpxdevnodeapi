const jwt = require("jsonwebtoken");

function valid(req) {
  if (req.headers.authorization == undefined) {
    return false;
  }
  if (!(req.headers.authorization.toLowerCase().includes('bearer'))) {
    return false;
  }
  const token = req.headers.authorization.split(" ")[1];
  if (!token) {
    return false;
  }
  //Decoding the token
  const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
  if (Math.floor(Date.now() / 1000) > decodedToken.exp) {
    return false;
  }
  return true;
}

module.exports = {
  valid: valid,
};
