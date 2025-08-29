const express = require('express');
const { createUser, handleLogin, getUser, getAccount } = require('../controllers/userController');
const auth = require('../middleware/auth');
const delay = require('../middleware/delay');

const routerAPI = express.Router();

// Middleware auth cho tất cả route
routerAPI.use(auth);

// Route test API
routerAPI.get("/", (req, res) => {
    return res.status(200).json("Hello world api");
});

// Auth routes
routerAPI.post("/register", createUser);
routerAPI.post("/login", handleLogin);

// User routes
routerAPI.get("/user", getUser);
routerAPI.get("/account", delay, getAccount);

module.exports = routerAPI; // export default
