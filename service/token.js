const jwt = require("jsonwebtoken");
const os = require("os");

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
  try {
    //Decoding the token
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (decodedToken.host != os.hostname()) {
      return false;
    }
    if (Math.floor(new Date().getTime() / 1000) > decodedToken.exp) {
      return false;
    }
    return true;
  } catch (ex){
    return false;
  }
}

module.exports = {
  valid: valid,
};
