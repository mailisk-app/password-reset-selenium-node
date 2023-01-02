const express = require("express");
const nodemailer = require("nodemailer");
const path = require("path");
const cors = require("cors");
const { randomBytes } = require("crypto");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const PORT = 3001;

const transport = nodemailer.createTransport({
  pool: true,
  host: "smtp.mailisk.net",
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

// In a real application you would use something like redis to store one-time passwords (otp)
const otpStorage = {};

const userStorage = {
  "user@example.com": "password",
};

// We're using mailisk SMTP to send emails, but this could be substituted for any 3rd party email service
async function sendResetEmail(email) {
  // persist otp so it can be checked later
  const otp = randomBytes(8).toString("base64url").toUpperCase();
  otpStorage[email] = otp;

  const resetLink = `http://localhost:3000/reset?email=${email}&otp=${otp}`;

  // send email with otp
  await transport.sendMail({
    from: "no-reply@example.com",
    to: email,
    subject: "Reset password code",
    html: `Go to the <a href="${resetLink}">reset link</a> to reset your password.<br/>Your otp is: <strong>${otp}</strong>`,
  });
}

function createUser(email, password) {
  userStorage[email] = password;
}

function resetPassword(email, newPassword) {
  if (userStorage[email]) userStorage[email] = newPassword;
}

const app = express();
app.use(express.json());
app.use(cors());

app.post("/register", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  if (!email) return res.status(400).send("No email provided");
  if (!password) return res.status(400).send("No password provided");

  if (userStorage[email]) return res.status(400).send("User already exists");

  createUser(email, password);

  return res.sendStatus(200);
});

app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  if (!email) return res.status(400).send("No email provided");
  if (!password) return res.status(400).send("No password provided");

  if (!userStorage[email]) return res.status(400).send("User not found");

  if (userStorage[email] !== password) return res.status(400).send("Wrong password");

  // here we would set the session cookie or return a JWT
  return res.sendStatus(200);
});

app.post("/reset-password", async (req, res) => {
  console.log("received /reset-password with data:", req.body);

  const email = req.body.email;
  if (!email) return res.status(400).send("No email provided");

  if (!userStorage[email]) return res.status(400).send("User not found");

  try {
    await sendResetEmail(email);
  } catch (error) {
    console.error(error);
    return res.status(500).send("There was an error sending the email");
  }

  return res.sendStatus(200);
});

app.post("/confirm-reset-password", async (req, res) => {
  console.log("received /confirm-reset-password with data:", req.body);

  const otp = req.body.otp;
  const email = req.body.email;
  const newPassword = req.body.newPassword;
  if (!otp) return res.status(400).send("No otp provided");
  if (!email) return res.status(400).send("No email provided");
  if (!newPassword) return res.status(400).send("No new password provided");

  if (!otpStorage[email]) return res.status(400).send("Password reset has not been requested for this email");
  else if (otpStorage[email] !== otp) return res.status(400).send("Wrong otp for this email");

  await resetPassword(email, newPassword);

  // erase otp so it cannot be used again
  delete otpStorage[email];

  return res.sendStatus(200);
});

app.listen(PORT, () => console.log(`Started listening on port ${PORT}`));
