require('dotenv').config();

// Import các package cần dùng
const express = require('express');
const cors = require('cors');

// Import config và route
const configViewEngine = require('./config/viewEngine');
const apiRoutes = require('./routes/api');
const connection = require('./config/database');
const { getHomepage } = require('./controllers/homeController');

const app = express(); // Tạo app Express

// Cấu hình port, ưu tiên lấy từ .env, nếu không có thì mặc định là 8888
const port = process.env.PORT || 8888;

// Middleware
app.use(cors()); // Cho phép CORS
app.use(express.json()); // Cho phép xử lý JSON trong req.body
app.use(express.urlencoded({ extended: true })); // Cho phép xử lý form-data

// Config template engine
configViewEngine(app);

// Config routes
const webAPI = express.Router();
webAPI.get("/", getHomepage);

app.use('/', webAPI);
app.use('/v1/api', apiRoutes);

// Chạy server
(async () => {
    try {
        // Kết nối database bằng mongoose
        await connection();

        // Lắng nghe port
        app.listen(port, () => {
            console.log(`Backend NodeJS App listening on port ${port}`);
        });
    } catch (error) {
        console.log("Error connect to DB: ", error);
    }
})();
