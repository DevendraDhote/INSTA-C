const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        mongoose.connect(process.env.MONGO_URI)
        console.log("Mongodb connected successfully");
    } catch (error) {
        console.log("error",error)
    }
};

module.exports = connectDB;