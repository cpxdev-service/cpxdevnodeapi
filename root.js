const express = require("express");
const app = express();
const path = require("path");
const { rateLimit } = require("express-rate-limit");
const dotenv = require("dotenv");
dotenv.config();

const Auth = require("./controller/auth");
const MyNote = require("./controller/mynote");
const MyKeep = require("./controller/mykeep");

const limiter = rateLimit({
  windowMs: 60 * 1000, // 15 minutes
  limit: 120, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
  standardHeaders: true,
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
  message: {
    status: false,
    message: "Rate limit exceeded",
  },
});
app.use(limiter);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "/index.html"));
});
app.post("/status", (req, res) => {
  res.json({
    status: true,
    message: "Server is OK",
  });
});

app.use("/auth", Auth);
app.use("/mynote", MyNote);
app.use("/mykeep", MyKeep);

app.listen(process.env.PORT || process.env.PORT, () => {
  console.log("Start server at port " + process.env.PORT + ".");
});
