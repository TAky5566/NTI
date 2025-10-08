const mongoose = require("mongoose");

const connectDB = () => {
    mongoose
        .connect("mongodb://localhost:27017/myDB")
        .then(() => console.log("MongoDB connected"))
        .catch((err) => console.log("DB connection error:", err));
};

module.exports = connectDB;
