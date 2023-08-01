import mongoose from "mongoose";

async function connect() {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("Database connected");
    } catch (error) {
        console.log(error);
    }
}

export default { connect };