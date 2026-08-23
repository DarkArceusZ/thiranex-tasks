"use strict";

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const usersFile = path.join(__dirname, "../users.json");
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET && process.env.NODE_ENV === "production") {
  throw new Error("JWT_SECRET must be configured in production");
}

const signingSecret = JWT_SECRET || crypto.randomBytes(32).toString("hex");

function readUsers() {
  try {
    return JSON.parse(fs.readFileSync(usersFile, "utf8"));
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
    return [];
  }
}

function writeUsers(users) {
  const temporaryFile = `${usersFile}.tmp`;
  fs.writeFileSync(temporaryFile, JSON.stringify(users, null, 2), { mode: 0o600 });
  fs.renameSync(temporaryFile, usersFile);
}

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function validateCredentials(name, email, password, registering) {
  if (registering && (!name || name.trim().length < 2)) return "Name must be at least 2 characters";
  if (!/^\S+@\S+\.\S+$/.test(email)) return "Enter a valid email address";
  if (typeof password !== "string" || password.length < 8) return "Password must be at least 8 characters";
  return null;
}

function publicUser(user) {
  return { id: user.id, name: user.name, email: user.email };
}

function createToken(user) {
  return jwt.sign({ sub: user.id }, signingSecret, { expiresIn: "7d" });
}

async function register(name, email, password) {
  const normalizedEmail = normalizeEmail(email);
  const validationError = validateCredentials(name, normalizedEmail, password, true);
  if (validationError) return { error: validationError, status: 400 };

  const users = readUsers();
  if (users.some((user) => user.email === normalizedEmail)) {
    return { error: "An account with that email already exists", status: 409 };
  }

  const user = {
    id: crypto.randomUUID(),
    name: name.trim(),
    email: normalizedEmail,
    passwordHash: await bcrypt.hash(password, 12),
    createdAt: new Date().toISOString(),
  };
  users.push(user);
  writeUsers(users);
  return { user: publicUser(user), token: createToken(user) };
}

async function login(email, password) {
  const normalizedEmail = normalizeEmail(email);
  const validationError = validateCredentials("", normalizedEmail, password, false);
  if (validationError) return { error: validationError, status: 400 };

  const user = readUsers().find((candidate) => candidate.email === normalizedEmail);
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return { error: "Invalid email or password", status: 401 };
  }
  return { user: publicUser(user), token: createToken(user) };
}

function authenticate(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  if (!token) return res.status(401).json({ success: false, error: "Authentication required" });

  try {
    const payload = jwt.verify(token, signingSecret);
    const user = readUsers().find((candidate) => candidate.id === payload.sub);
    if (!user) return res.status(401).json({ success: false, error: "Account no longer exists" });
    req.user = publicUser(user);
    next();
  } catch {
    return res.status(401).json({ success: false, error: "Invalid or expired token" });
  }
}

module.exports = { authenticate, login, register };
