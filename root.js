const express = require("express");
const app = express();
var cors = require("cors");
const path = require("path");
const { rateLimit } = require("express-rate-limit");
const dotenv = require("dotenv");
dotenv.config();

const Auth = require("./controller/auth");

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
app.use(cors());
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

app.use(express.json());

app.use("/auth", Auth);

app.listen(process.env.PORT || process.env.PORT, () => {
  console.log("Start server at port " + process.env.PORT + ".");
});
