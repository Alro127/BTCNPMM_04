require('dotenv').config();
const mongoose = require('mongoose');

// Các trạng thái của kết nối DB
const dbState = [
    { value: 0, label: "Disconnected" },
    { value: 1, label: "Connected" },
    { value: 2, label: "Connecting" },
    { value: 3, label: "Disconnecting" }
];

// Hàm kết nối MongoDB
const connection = async () => {
    await mongoose.connect(process.env.MONGO_DB_URL);
    const state = Number(mongoose.connection.readyState);
    console.log(
        dbState.find(f => f.value === state).label,
        "to database"
    );
};

module.exports = connection;
