const express = require('express');
const { createUser, handleLogin, getUser, getAccount } = require('../controllers/userController');
const auth = require('../middleware/auth');
const delay = require('../middleware/delay');

const { createProduct, getProductById, getProducts } = require('../controllers/productController')

const routerAPI = express.Router();



// Route test API
routerAPI.get("/", (req, res) => {
    return res.status(200).json("Hello world api");
});

// Auth routes
routerAPI.post("/register", createUser);
routerAPI.post("/login", handleLogin);


// Product routes
routerAPI.get("/products", getProducts);
routerAPI.get("/products/:id", getProductById);
//routerAPI.post("/products/new", createProduct);

// Middleware auth cho tất cả route
routerAPI.use(auth);

// User routes
routerAPI.get("/user", getUser);
routerAPI.get("/account", delay, getAccount);



module.exports = routerAPI; // export default
