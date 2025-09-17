const express = require('express');
const { createUser, handleLogin, getUser, getAccount } = require('../controllers/userController');
const auth = require('../middleware/auth');
const delay = require('../middleware/delay');

const { getCategories, getProductById, getProducts, getProductsWithElasticSearch, increaseView, getRecentViewsByUser, recordRecentView, recordFavourite, getFavouritesByUser, getRelatedProducts } = require('../controllers/productController');
const { completeOrder } = require('../controllers/orderController');
const { getCommentCount, getCommentsByProduct, createComment } = require('../controllers/commentController');

const routerAPI = express.Router();



// Route test API
routerAPI.get("/", (req, res) => {
    return res.status(200).json("Hello world api");
});

// Auth routes
routerAPI.post("/register", createUser);
routerAPI.post("/login", handleLogin);


// Product routes
routerAPI.get("/products", getProductsWithElasticSearch);
//routerAPI.get("/products", getProducts);
routerAPI.get("/products-category", getCategories);
routerAPI.get("/products/related", getRelatedProducts);
routerAPI.get("/products/:id", getProductById);
routerAPI.patch("/products/:id/view", increaseView);

//routerAPI.post("/products/new", createProduct);

// Order routes
// routerAPI.post("/orders", createOrder);
// routerAPI.get("/orders", getOrders);
// routerAPI.get("/orders/:id", getOrderById);
routerAPI.patch("/orders/:id/complete", completeOrder);

// Comment routes

routerAPI.get("/products/:id/comments", getCommentsByProduct);
routerAPI.get("/products/:id/comments/count", getCommentCount);

// Middleware auth cho tất cả route
routerAPI.use(auth);

routerAPI.post("/products/:id/new-comment", createComment);

routerAPI.post("/products/:id/record-recent-view", recordRecentView);
routerAPI.get("/recent-views", getRecentViewsByUser);

routerAPI.post("/products/:id/record-favourite", recordFavourite);
routerAPI.get("/favourites", getFavouritesByUser);
// User routes
routerAPI.get("/user", getUser);
routerAPI.get("/account", delay, getAccount);

module.exports = routerAPI; // export default
