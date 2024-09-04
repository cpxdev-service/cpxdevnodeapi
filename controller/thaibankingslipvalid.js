const { Router } = require("express");
const app = Router();
const { valid, getUser } = require("../service/token");
const { v4 } = require("uuid");
const { slipVerify } = require("promptparse/validate");
const { anyId } = require("promptparse/generate");

app.get("/generate/:id/:amount", async (req, res) => {
  if (!valid(req, res)) {
    res.status(401).json({
      status: false,
      message: "Token is expired or not found",
    });
    return;
  }

  if (req.params.amount < 1) {
    const payload = anyId({
      type: "EWALLETID",
      target: req.params.id,
      ref1: v4(),
    });
    res.status(200).json({
      status: true,
      response:
        "https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=" +
        payload,
    });
    return;
  }
  const payload = anyId({
    type: "EWALLETID",
    target: req.params.id,
    amount: parseFloat(req.params.amount),
    ref1: v4(),
  });
  res.status(200).json({
    status: true,
    response:
      "https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=" +
      payload,
  });
});
app.get("/validation/:code", async (req, res) => {
  if (!valid(req, res)) {
    res.status(401).json({
      status: false,
      message: "Token is expired or not found",
    });
    return;
  }

  try {
    atob(req.params.code);
  } catch {
    res.status(403).json({
      status: false,
      message: "Please encode Slip QR Code into Base64",
    });
    return;
  }

  const data = slipVerify(atob(req.params.code));

  if (!data) {
    res.status(403).json({
      status: false,
      message: "Slip QR Code cannot be read.",
    });
    return;
  }
  res.status(200).json({
    status: true,
    response: data,
  });
});

module.exports = app;
