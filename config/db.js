const mongoose = require("mongoose")

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI)

        console.log(`mongodb connected: ${conn.connection.host}`.blue.underline)
    } catch(err) {
        console.log(err)
        process.exit(1)
    }
}

module.exports = connectDB