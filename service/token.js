const jwt = require("jsonwebtoken");
const os = require("os");
const { MongoClient } = require("mongodb");

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
function getUser(req) {
  if (req.headers.authorization == undefined) {
    return '';
  }
  if (!(req.headers.authorization.toLowerCase().includes('bearer'))) {
    return '';
  }
  const token = req.headers.authorization.split(" ")[1];
  if (!token) {
    return '';
  }
  try {
    //Decoding the token
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (Math.floor(new Date().getTime() / 1000) > decodedToken.exp) {
      return '';
    }
    return decodedToken.userId;
  } catch (ex){
    return '';
  }
}
async function renewDeleteTime(userId) {
  const client = new MongoClient(process.env.mongocon);
  try {
    client.connect();
    const database = client.db("nodejsdemo");
    const movies = database.collection("authUser");
    await movies.updateOne(
      { userName: userId },
      {
        $set: {
          latestUsed: new Date(),
        },
      }
    );
    client.close();
  } catch (e) {
    client.close();
  }
}

module.exports = {
  valid: valid,
  getUser: getUser,
  renewDeleteTime: renewDeleteTime
};
